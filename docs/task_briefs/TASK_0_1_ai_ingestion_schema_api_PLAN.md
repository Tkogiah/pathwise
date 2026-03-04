# Task 0.1 Plan — AI Ingestion Schema + API

## Goal

Add the minimal Prisma schema and NestJS API surface needed to ingest Slack extraction
payloads into Pathwise with a human-review workflow. No Slack app, no UI in this task.

---

## 1. Schema Additions (`apps/api/prisma/schema.prisma`)

### New Enums

```prisma
enum ExtractionStatus {
  PENDING
  APPROVED
  REJECTED
}

enum EvidenceSource {
  SLACK
}
```

### New Models

```prisma
model Extraction {
  id                String           @id @default(cuid())
  programId         String           // FK → ProgramTemplate.id
  clientId          String?          // resolved on approval; null until then
  clientRef         String           // raw fuzzy ref from the bot ("frank_santos")
  rawText           String           // redacted summary text
  structuredPayload Json             // full redacted structured payload
  confidence        Float
  status            ExtractionStatus @default(PENDING)
  requiresReview    Boolean          @default(true)
  createdAt         DateTime         @default(now())
  approvedAt        DateTime?
  rejectedAt        DateTime?

  program  ProgramTemplate @relation(fields: [programId], references: [id])
  client   Client?         @relation(fields: [clientId], references: [id])
  evidence Evidence[]
  facts    Fact[]
}

model Evidence {
  id           String        @id @default(cuid())
  extractionId String
  source       EvidenceSource @default(SLACK)
  permalink    String
  author       String
  timestamp    DateTime
  createdAt    DateTime      @default(now())

  extraction Extraction @relation(fields: [extractionId], references: [id])
}

model Fact {
  id           String    @id @default(cuid())
  extractionId String
  clientId     String
  stageId      String?   // TemplateStage.id; null if stage not resolved
  taskId       String?   // TemplateTask.id; null if task not resolved
  statusValue  String?   // mirrors payload status string ("in_progress" etc.)
  notes        String?   // redacted notes
  source       String    @default("slack")
  createdAt    DateTime  @default(now())

  extraction    Extraction     @relation(fields: [extractionId], references: [id])
  client        Client         @relation(fields: [clientId], references: [id])
  templateStage TemplateStage? @relation(fields: [stageId], references: [id])
  templateTask  TemplateTask?  @relation(fields: [taskId], references: [id])
}
```

### ProgramTemplate slug (resolved)

Add `slug String @unique` to the existing `ProgramTemplate` model. This allows the Slack bot
to reference programs by a short, stable identifier (`"mthp"`) rather than a database cuid,
which is required for channel-to-program routing.

```prisma
model ProgramTemplate {
  // existing fields ...
  slug String @unique   // e.g. "housing", "mthp", "benefits"
  // existing relations ...
  extractions Extraction[]
}
```

The draft DTO's `program_id` field resolves via `ProgramTemplate.slug`, not `.id`.

### Existing model relation additions

Add back-relations on:

- `ProgramTemplate` → `extractions Extraction[]` (already covered above)
- `Client` → `extractions Extraction[]`, `facts Fact[]`
- `TemplateStage` → `facts Fact[]`
- `TemplateTask` → `facts Fact[]`

---

## 2. Redaction Utility (`apps/api/src/lib/redaction.ts`)

Pure function — no DB dependencies, fully unit-testable. Placed in `apps/api/src/lib/` (not
the slack-specific folder) so future integrations such as the Phase 4 Outlook pipeline can
reuse it without duplication.

```ts
export function detectPii(text: string): string[] { ... }
// Returns a list of matched PII categories found.
// Categories: SSN, DOB, PHONE, EMAIL, CASE_NUMBER, BENEFIT_ID, INCOME_AMOUNT, ADDRESS
```

Patterns to detect (regex):

- SSN: `\d{3}-\d{2}-\d{4}`
- Phone: `\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}`
- Email: standard email regex
- DOB: `\b(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}\b`
- Income amounts: `\$[\d,]+` or `\d+\s*(dollars|/month|/yr)`
- Case/benefit numbers: patterns TBD (flag for Codex to define based on program specifics)

The service layer calls `detectPii(notes)` before persisting. If any matches found → throw a
`400 Bad Request` with category list. The bot is responsible for pre-redaction; the API is a
safety net.

---

## 3. NestJS Module (`apps/api/src/integrations/slack/`)

### Files

```
apps/api/src/integrations/
  slack/
    slack.module.ts
    slack.controller.ts
    slack.service.ts
    dto/
      create-extraction.dto.ts
```

### DTO (`create-extraction.dto.ts`)

Validated with `class-validator` (matching existing API patterns):

```ts
class EvidenceDto {
  source: 'slack';
  permalink: string; // must be a URL
  author: string;
  timestamp: string; // ISO 8601
}

class CreateExtractionDto {
  program_id: string; // ProgramTemplate.slug (e.g. "mthp")
  client_ref: string; // fuzzy name ref; stored as-is
  stage?: string; // stage title; used at approval for resolution
  task?: string; // task title; used at approval for resolution
  status?: string; // task status string from AI
  notes?: string; // must pass redaction check
  evidence: EvidenceDto[];
  confidence: number; // 0–1
  requires_review: boolean;
}
```

### Auth guard (`apps/api/src/integrations/guards/api-key.guard.ts`)

These endpoints use an API key guard rather than JWT. The guard checks for a header:

```
x-api-key: <value of INTEGRATION_API_KEY env var>
```

- If `INTEGRATION_API_KEY` is not set → guard rejects all requests with 401.
- If the header is missing or wrong → 401.
- The Slack bot (and future integration callers) must include this key in every request.

This approach is simpler than JWT for service-to-service use and avoids opening the endpoints
without any protection. Add `INTEGRATION_API_KEY` to `apps/api/.env.example` and
`docs/DEPLOYMENT.md`.

### Controller (`slack.controller.ts`)

```
POST   /integrations/slack/extractions             → createDraft
PATCH  /integrations/slack/extractions/:id/approve → approve
PATCH  /integrations/slack/extractions/:id/reject  → reject
```

All three endpoints are protected by `@UseGuards(ApiKeyGuard)`. The guard is NOT applied
globally — it is scoped to the `SlackController` only.

### Service (`slack.service.ts`)

**`createDraft(dto)`**

1. Validate `dto.notes` through `detectPii` → throw 400 if PII found.
2. Resolve `ProgramTemplate` by `slug = dto.program_id` → throw 404 if not found.
3. Create `Extraction` (status: PENDING) + `Evidence[]` records in a transaction.
4. Return extraction id.

**`approve(id)`**

1. Load extraction; throw 404 if not found, 409 if already APPROVED/REJECTED.
2. Resolve `clientId`:
   - Query `Client` where programInstance matches programId and name fuzzy-matches `clientRef`.
   - Exact match only for MVP. If zero matches → throw 422 with message "client not resolved".
   - If multiple matches → throw 422 with message "ambiguous client ref".
3. Resolve `stageId`: find `TemplateStage` by title within the program template. Null if not
   matched (non-blocking — fact is stored with null stageId).
4. Resolve `taskId`: find `TemplateTask` by title within the resolved stage. Null if not
   matched.
5. In a transaction:
   - Create `Fact` record.
   - Update `Extraction` → status: APPROVED, approvedAt: now(), clientId: resolved id.
6. Return fact id.

**`reject(id)`**

1. Load extraction; throw 404 if not found, 409 if already APPROVED/REJECTED.
2. Update `Extraction` → status: REJECTED, rejectedAt: now().
3. Return extraction id.

---

## 4. App Module (`apps/api/src/app.module.ts`)

Import `SlackModule` into root AppModule. No other changes.

---

## 5. Test Fixture (`apps/api/test/fixtures/slack_event.json`)

```json
{
  "program_id": "housing",
  "client_ref": "frank_santos",
  "stage": "Housing Search & Applications",
  "task": "Assist with housing applications",
  "status": "in_progress",
  "notes": "Assisted Frank with housing applications today.",
  "evidence": [
    {
      "source": "slack",
      "permalink": "https://example.slack.com/archives/C000/p000",
      "author": "Ryan",
      "timestamp": "2026-03-04T22:19:00Z"
    }
  ],
  "confidence": 0.74,
  "requires_review": true
}
```

The Housing template seed must set `slug = "housing"` on its ProgramTemplate row. The
integration test setup should seed a matching client with firstName/lastName matching
"frank santos" (case-insensitive).

---

## 6. Tests

### Integration tests (`apps/api/test/integrations/slack.e2e-spec.ts`)

Use existing Supertest + NestJS test app pattern.

| Test                                                    | Expected                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| POST /integrations/slack/extractions with valid payload | 201, extraction in DB with PENDING status, Evidence records created |
| POST with PII in notes (`"SSN: 123-45-6789"`)           | 400 with PII category in response                                   |
| POST with unknown program_id                            | 404                                                                 |
| POST then PATCH approve                                 | 200, extraction APPROVED, Fact created, clientId resolved           |
| PATCH approve on already-approved extraction            | 409                                                                 |
| PATCH approve with unresolvable clientRef               | 422                                                                 |
| POST then PATCH reject                                  | 200, extraction REJECTED, no Fact created                           |
| PATCH reject on already-rejected extraction             | 409                                                                 |

### Unit tests (`apps/api/src/lib/redaction.spec.ts`)

| Test                           | Expected                         |
| ------------------------------ | -------------------------------- |
| SSN pattern in text            | detects "SSN" category           |
| Phone number in text           | detects "PHONE" category         |
| Email address in text          | detects "EMAIL" category         |
| DOB pattern in text            | detects "DOB" category           |
| Income amount (`$1,200/month`) | detects "INCOME_AMOUNT" category |
| Clean clinical note            | returns empty array              |

---

## 7. Files Summary

| File                                                           | Action                                                          |
| -------------------------------------------------------------- | --------------------------------------------------------------- |
| `apps/api/prisma/schema.prisma`                                | Add enums + 3 models + slug on ProgramTemplate + back-relations |
| `apps/api/prisma/migrations/...`                               | Generated by `prisma migrate dev`                               |
| `apps/api/src/integrations/slack/slack.module.ts`              | New                                                             |
| `apps/api/src/integrations/slack/slack.controller.ts`          | New                                                             |
| `apps/api/src/integrations/slack/slack.service.ts`             | New                                                             |
| `apps/api/src/integrations/slack/dto/create-extraction.dto.ts` | New                                                             |
| `apps/api/src/integrations/guards/api-key.guard.ts`            | New                                                             |
| `apps/api/src/lib/redaction.ts`                                | New                                                             |
| `apps/api/src/lib/redaction.spec.ts`                           | New                                                             |
| `apps/api/src/app.module.ts`                                   | Import SlackModule                                              |
| `apps/api/src/db/seed.ts` (or equivalent)                      | Add `slug` to Housing + Benefits template seed rows             |
| `apps/api/test/integrations/slack.e2e-spec.ts`                 | New                                                             |
| `apps/api/test/fixtures/slack_event.json`                      | New                                                             |
| `apps/api/package.json`                                        | Add `"test": "vitest run"` script + vitest devDependency        |
| `package.json` (root)                                          | Add `"test:api": "npm exec -w @pathwise/api -- vitest run"`     |
| `apps/api/.env.example`                                        | Add `INTEGRATION_API_KEY`                                       |
| `docs/DEPLOYMENT.md`                                           | Document `INTEGRATION_API_KEY`                                  |

---

## 8. Resolved Decisions

1. **`program_id` format** → **RESOLVED**: Use `ProgramTemplate.slug`. Add `slug String @unique`
   to schema. Seed Housing as `"housing"`, Benefits as `"benefits"`. Bot sends slug in payload.

2. **Redaction: reject vs. strip** → **RESOLVED**: Reject with 400. Bot is responsible for
   pre-redaction; API is safety net only.

3. **Client resolution at draft vs. approval** → **RESOLVED**: Resolution at approval only.
   Draft stores `clientRef` as-is.

4. **Ambiguous client match** → **RESOLVED**: 422 for MVP. Keeps logic simple and safe.

5. **Fact vs. TaskInstance mutation** → **RESOLVED**: Fact is audit-only for this task.
   No TaskInstance mutations. Phase 2 scope.

6. **Auth guard** → **RESOLVED**: API key guard (`x-api-key` header) scoped to SlackController.
   Not JWT. `INTEGRATION_API_KEY` env var. Missing key = 401.

---

## 9. Verification (for Claude after implementation)

```bash
npm run typecheck       # from repo root — tsc strict across all packages
npm run lint            # from repo root
npm run test            # engine unit tests (packages/engine)
npm run test:api        # API integration tests + redaction unit tests (apps/api vitest)
```

Note: `npm run test:e2e` runs Playwright UI tests and is NOT used for this task.
`test:api` is a new root script that must be added as part of this task.
