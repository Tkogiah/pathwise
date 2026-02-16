# Task 6.3 Plan — Program Metadata (Start Date + Length)

## Context

- `ClientProgramInstance` already has a `startDate DateTime` field.
- No `programLengthDays` field exists — needs a migration.
- `RoadmapVM` already exposes `startDate` as a string.
- `RoadmapsController` only has `GET /roadmaps/:id` — needs a `PATCH` endpoint.
- The existing update pattern uses Zod DTOs + controller validation + service with business logic.

## Steps

### Step 1 — Schema: Add `programLengthDays` to `ClientProgramInstance`

Add to `apps/api/prisma/schema.prisma`:

```prisma
programLengthDays Int?
```

Run `npx prisma migrate dev --name add_program_length_days` to create the migration.

### Step 2 — Seed: Set `programLengthDays` on existing instances

Update `apps/api/prisma/seed.ts` to set `programLengthDays` when creating instances via `cloneProgram()`. Use a sensible default (e.g., `90` days for the Housing Program).

### Step 3 — API: Add `PATCH /roadmaps/:id` endpoint

**DTO** (`apps/api/src/roadmaps/dto/update-roadmap.dto.ts`):

```ts
z.object({
  startDate: z.string().datetime().optional(),
  programLengthDays: z.number().int().min(1).nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});
```

**Service method** (`roadmaps.service.ts`):

1. Verify program instance exists (404 if not).
2. Build update data from validated DTO.
3. `prisma.clientProgramInstance.update(...)`.
4. Return the updated `RoadmapVM` via `toViewModel()`.

**Controller** (`roadmaps.controller.ts`):

- Add `@Patch(':id')` with Zod validation (same pattern as task‑instances).

### Step 4 — Update `RoadmapVM` type and serializer

**`apps/web/src/lib/types.ts`** — Add `programLengthDays: number | null` to `RoadmapVM`.

**`roadmaps.service.ts` `toViewModel()`** — Include `programLengthDays` from the instance.

### Step 5 — UI: Add `ProgramMetadata` inline editor

New component: `apps/web/src/components/ProgramMetadata.tsx` (client component).

**Display mode** (default):

- Shows "Start: Jan 15, 2026" and "Length: 90 days" inline.
- An "Edit" button switches to edit mode.
- Hidden when `readOnly` (archived clients).

**Edit mode**:

- `<input type="date">` for start date (pre‑filled).
- `<input type="number" min="1">` for program length in days (pre‑filled).
- **Save** and **Cancel** buttons.
- On Save: `apiPatch('/roadmaps/:id', { startDate, programLengthDays })`.
  - Convert `YYYY-MM-DD` to ISO before sending: `new Date(value + 'T00:00:00').toISOString()`.
- On success: call `onUpdated()` to refresh the roadmap data.

### Step 6 — Wire `ProgramMetadata` into `RoadmapView`

In `RoadmapView.tsx`:

- Import and render `<ProgramMetadata>` with props: `roadmapId`, `startDate`, `programLengthDays`, `readOnly`, `onUpdated={refreshRoadmap}`.
- **Placement**: render it **above the RoadmapBar** so it’s visible in both overview and zoom‑in states (outside the selectedStage conditional block).

### Step 7 — Verify

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm run test` (54 unit tests)

## Files Changed / Created

| File                                              | Change                                                                |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| `apps/api/prisma/schema.prisma`                   | Add `programLengthDays Int?` to `ClientProgramInstance`               |
| `apps/api/prisma/migrations/...`                  | New migration                                                         |
| `apps/api/prisma/seed.ts`                         | Set `programLengthDays: 90` in `cloneProgram()`                       |
| `apps/api/src/roadmaps/dto/update-roadmap.dto.ts` | **New** — Zod DTO                                                     |
| `apps/api/src/roadmaps/roadmaps.controller.ts`    | Add `PATCH :id`                                                       |
| `apps/api/src/roadmaps/roadmaps.service.ts`       | Add `update()` method, include `programLengthDays` in `toViewModel()` |
| `apps/web/src/lib/types.ts`                       | Add `programLengthDays` to `RoadmapVM`                                |
| `apps/web/src/components/ProgramMetadata.tsx`     | **New** — inline editor component                                     |
| `apps/web/src/components/RoadmapView.tsx`         | Render `ProgramMetadata`                                              |

## No Changes Needed

- **Engine**: no impact on task/stage calculations (program length is display‑only for now)
- **ClientRoadmapShell / RoadmapTabs**: no changes
- **E2E tests**: metadata editing is low‑risk display; can add tests in a future task
