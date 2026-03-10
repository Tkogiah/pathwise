# Task 7.1 Plan — Notes Data Model + API

## Context

The app has no authentication — demo users are client-side identities (`user-1`, `user-2`, `user-3` in `demo-users.ts`) that don't correspond to DB `User` records (which use cuid IDs from the seed). Notes need an `authorId` for ownership and an author-only edit check.

**Approach for author identity**: Store `authorId` as a plain string (the demo user ID, e.g., `"user-1"`). No foreign key to the `User` table — keeps it simple for the demo context. The POST endpoint accepts `authorId` in the body; the PATCH endpoint accepts `authorId` in the body and checks ownership.

## Steps

### Step 1 — Schema: add `NoteLabel` enum and `TaskNote` model

Add to `schema.prisma`:

```prisma
enum NoteLabel {
  APPOINTMENT
  DOCUMENTS
  HOUSING_SEARCH
  VOUCHER
  BENEFITS
  OUTREACH
  ID_VERIFICATION
  BARRIER
  TASK_UPDATE
  OTHER
}

model TaskNote {
  id             String    @id @default(cuid())
  taskInstanceId String
  authorId       String
  label          NoteLabel @default(OTHER)
  summary        String?
  body           String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  taskInstance TaskInstance @relation(fields: [taskInstanceId], references: [id])
}
```

Add `notes TaskNote[]` relation to the `TaskInstance` model.

Run migration: `npx prisma migrate dev --name add-task-notes`

### Step 2 — Create NestJS notes module

**Files:**

- `apps/api/src/notes/notes.module.ts`
- `apps/api/src/notes/notes.service.ts`
- `apps/api/src/notes/notes.controller.ts`
- `apps/api/src/notes/dto/create-note.dto.ts`
- `apps/api/src/notes/dto/update-note.dto.ts`

**DTOs (Zod):**

```ts
// create-note.dto.ts
CreateNoteSchema = z.object({
  authorId: z.string().min(1),
  label: z
    .enum([
      'APPOINTMENT',
      'DOCUMENTS',
      'HOUSING_SEARCH',
      'VOUCHER',
      'BENEFITS',
      'OUTREACH',
      'ID_VERIFICATION',
      'BARRIER',
      'TASK_UPDATE',
      'OTHER',
    ])
    .optional(),
  summary: z.string().min(1).max(200).optional(),
  body: z.string().min(1),
});

// update-note.dto.ts
UpdateNoteSchema = z.object({
  authorId: z.string().min(1),         // requestor — used for ownership check
  label: z
    .enum([
      'APPOINTMENT',
      'DOCUMENTS',
      'HOUSING_SEARCH',
      'VOUCHER',
      'BENEFITS',
      'OUTREACH',
      'ID_VERIFICATION',
      'BARRIER',
      'TASK_UPDATE',
      'OTHER',
    ])
    .optional(),
  summary: z.string().min(1).max(200).optional(),
  body: z.string().min(1).optional(),
}).refine(data => /* at least one field besides authorId */);
```

**Service:**

- `findByTask(taskInstanceId: string)` — returns notes ordered by `createdAt DESC`
- `create(taskInstanceId: string, dto)` — validates task exists, creates note
- `update(noteId: string, dto)` — validates note exists, checks `dto.authorId === note.authorId`, throws `ForbiddenException` if mismatch

**Controller:**

- `GET /task-instances/:taskId/notes` → `findByTask`
- `POST /task-instances/:taskId/notes` → `create`
- `PATCH /notes/:id` → `update`

Note: The GET and POST routes are nested under `task-instances/:taskId` for clarity. The PATCH route is top-level `notes/:id` since we have the note ID directly.

### Step 3 — Register module in AppModule

Add `NotesModule` to `app.module.ts` imports.

### Step 4 — Add frontend types

Add to `apps/web/src/lib/types.ts`:

```ts
export type NoteLabel =
  | 'APPOINTMENT'
  | 'DOCUMENTS'
  | 'HOUSING_SEARCH'
  | 'VOUCHER'
  | 'BENEFITS'
  | 'OUTREACH'
  | 'ID_VERIFICATION'
  | 'BARRIER'
  | 'TASK_UPDATE'
  | 'OTHER';

export interface TaskNoteVM {
  id: string;
  taskInstanceId: string;
  authorId: string;
  label: NoteLabel;
  summary: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
```

### Step 5 — Seed demo notes

Add 3–4 demo notes in `seed.ts` after Marcus Rivera's task setup:

- 1 note on "Review referral packet" by demo user `user-1` (label: PROGRESS)
- 1 note on "Complete participant orientation" by demo user `user-2` (label: FOLLOW_UP)
- 1 note on a David Thompson task by demo user `user-1` (label: GENERAL)

Use `prisma.taskNote.create()` with the task instance IDs from the seed's `taskInstanceMap`.

### Step 6 — Verify

- `npm run typecheck` passes
- `npm run lint` passes
- `npm run format:check` passes
- All E2E tests pass (no UI changes, API-only)

No new E2E tests needed — this task is API + data model only. UI integration will be a separate task.

## Files Changed

| File                                              | Change                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/api/prisma/schema.prisma`                   | Add `NoteLabel` enum, `TaskNote` model, relation on `TaskInstance` |
| `apps/api/prisma/migrations/...`                  | Auto-generated migration                                           |
| `apps/api/src/notes/notes.module.ts` (new)        | NestJS module                                                      |
| `apps/api/src/notes/notes.service.ts` (new)       | Service with `findByTask`, `create`, `update`                      |
| `apps/api/src/notes/notes.controller.ts` (new)    | Controller with 3 endpoints                                        |
| `apps/api/src/notes/dto/create-note.dto.ts` (new) | Zod schema for note creation                                       |
| `apps/api/src/notes/dto/update-note.dto.ts` (new) | Zod schema for note update (includes authorId ownership)           |
| `apps/api/src/app.module.ts`                      | Register `NotesModule`                                             |
| `apps/web/src/lib/types.ts`                       | Add `NoteLabel` type and `TaskNoteVM` interface                    |
| `apps/api/prisma/seed.ts`                         | Add 3–4 demo notes                                                 |

## Design Decisions

1. **No FK for authorId** — Demo user IDs (`user-1`, etc.) don't exist in the `User` table. Storing as a plain string avoids coupling and keeps the demo simple.
2. **Author check via body param** — Since there's no auth middleware, the requestor's ID is passed in the PATCH body. The service compares it with the stored `authorId`.
3. **Routes split across two controllers** — GET/POST nest under `task-instances/:taskId/notes` (logical grouping), PATCH is top-level `notes/:id` (direct resource access). Both live in the same `NotesModule`.
4. **No delete** — Per requirements.
5. **NoteLabel enum** — Starter set aligned to UI labels/icons. Default: OTHER.
