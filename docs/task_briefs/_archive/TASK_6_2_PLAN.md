# Task 6.2 Plan — Roadmap Activation (Client Detail)

## Context

- Only one template exists: **Housing Program**.
- The seed's `cloneProgram()` shows the pattern: create `ClientProgramInstance` → create a `StageInstance` per `TemplateStage` → create a `TaskInstance` per `TemplateTask`.
- No uniqueness constraint exists on `ClientProgramInstance` by template, so duplicate prevention must be enforced in application code.
- `apiPost` helper already exists on the frontend.
- The client detail page already has a header row with the client name + archive button — the "Add Roadmap" button goes there.

## Steps

### Step 1 — API: Add `GET /templates` endpoint

Create a new `TemplatesModule` (`templates.module.ts`, `templates.controller.ts`, `templates.service.ts`).

**`GET /templates`** returns all active templates:

```json
[{ "id": "...", "name": "Housing Program" }]
```

Service: `this.prisma.programTemplate.findMany({ where: { isActive: true }, select: { id, name } })`.

Register `TemplatesModule` in `AppModule`.

### Step 2 — API: Add `POST /clients/:id/roadmaps` endpoint

Add to existing `ClientsController` and `ClientsService`.

**DTO** (Zod):

```ts
z.object({ templateId: z.string() });
```

**Service method `activateRoadmap(clientId, templateId)`**:

1. Verify client exists (404 if not).
2. Verify template exists and is active (400 if not).
3. **Duplicate check**: query `clientProgramInstance.findFirst({ where: { clientId, templateId } })`. If found, throw `BadRequestException('Client already has this roadmap')`.
4. **Create in a transaction** (`prisma.$transaction(async (tx) => { ... })`):
   - Create `ClientProgramInstance` with `startDate: new Date()`, `isActive: true`.
   - Fetch all `TemplateStage` records for the template (ordered by `orderIndex`).
   - For each stage, create `StageInstance` (first stage gets `activatedAt: new Date()`, rest `null`).
   - For each stage, fetch `TemplateTask` records, create a `TaskInstance` per task (all `NOT_STARTED`).
5. Return the new `ClientProgramInstance.id`.

### Step 3 — UI: Create `AddRoadmapButton` component

New file: `apps/web/src/components/AddRoadmapButton.tsx` (client component).

**Behavior**:

1. On mount, fetch `GET /templates`.
2. Filter out templates the client already has **by templateId** (not name).
   - Update `GET /clients/:id` to include `templateId` in each roadmap summary.
3. If no eligible templates remain, render nothing.
4. Render an "Add Roadmap" button in the client header.
5. On click:
   - If only one eligible template → confirm dialog ("Activate Housing Program for this client?").
   - If multiple eligible templates → show a simple dropdown/modal to pick one (future‑proof).
6. On confirm, `POST /clients/:id/roadmaps` with `{ templateId }`.
7. On success, call `router.refresh()` to reload the server component with the new roadmap.

### Step 4 — UI: Place `AddRoadmapButton` in client detail page

In `apps/web/src/app/clients/[id]/page.tsx`:

- Render `<AddRoadmapButton>` in the header row, after the `ArchiveButton`.
- Pass `clientId={client.id}` and `existingTemplateIds={client.roadmaps.map(r => r.templateId)}`.
- Hide when `client.isArchived` (archived clients shouldn't get new roadmaps).

### Step 5 — UI: Post‑activation view

After `router.refresh()`, the server component re‑fetches `GET /clients/:id` which now includes the new roadmap. `ClientRoadmapShell` already supports multiple roadmaps and will show tabs when `roadmaps.length > 1`.

### Step 6 — E2E test update

Add **Test 5** to `e2e/smoke.spec.ts`:

1. Navigate to Marcus Rivera (1 roadmap).
2. Verify "Add Roadmap" button is visible.
3. Click it, confirm activation.
4. Verify roadmap tabs now show 2 roadmaps.

**Cleanup**: rely on seed reset (no delete endpoint).

### Step 7 — Verify

- `npm run typecheck`
- `npm run lint`
- `npm run format`
- `npm run test` (including E2E)

## Files Changed / Created

| File                                             | Change                                   |
| ------------------------------------------------ | ---------------------------------------- |
| `apps/api/src/templates/templates.module.ts`     | **New** — NestJS module                  |
| `apps/api/src/templates/templates.controller.ts` | **New** — `GET /templates`               |
| `apps/api/src/templates/templates.service.ts`    | **New** — `findAll()`                    |
| `apps/api/src/app.module.ts`                     | Import `TemplatesModule`                 |
| `apps/api/src/clients/clients.controller.ts`     | Add `POST :id/roadmaps`                  |
| `apps/api/src/clients/clients.service.ts`        | Add `activateRoadmap()` method           |
| `apps/web/src/components/AddRoadmapButton.tsx`   | **New** — client component               |
| `apps/web/src/app/clients/[id]/page.tsx`         | Render `AddRoadmapButton` in header      |
| `apps/web/src/lib/types.ts`                      | Add `templateId` to roadmap summary type |
| `e2e/smoke.spec.ts`                              | Add Test 5                               |

## No Changes Needed

- **Schema / migrations**: no new fields; `ClientProgramInstance` already links client → template
- **RoadmapTabs / ClientRoadmapShell**: already support multiple roadmaps
- **RoadmapsService**: `findOne()` already transforms any instance to `RoadmapVM`
- **Engine**: no changes
