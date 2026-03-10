# Task 0.10 Plan Request — Housing Due Offset Full Backfill (Rule A)

## Goal

Ensure **all** Housing template tasks have `dueOffsetDays` set so every new Housing roadmap auto-populates due dates from template metadata.

## Rule A (Chosen)

- For tasks without an explicit due day, set `dueOffsetDays` to the **stage timeline end day**.
  - Example: Stage timeline “Day 7–30” → default offset `30`.

## Scope

- In scope:
  - Production backfill: set `dueOffsetDays` for **all Housing template tasks** (existing production DB rows).
  - Local seed update: set `dueOffsetDays` for all Housing tasks in `apps/api/prisma/seed.ts` using Rule A.
  - Provide a clear mapping table (stage → default offset) in the task plan.
- Out of scope:
  - Benefits template offsets (separate task if desired).
  - UI changes.

## Constraints

- Must not change existing task titles or ordering.
- Only touch Housing template tasks (`ProgramTemplate.slug = 'housing'`).

## Success Criteria

- All Housing tasks have non‑null `dueOffsetDays`.
- New Housing roadmaps auto‑populate due dates for **every** task.
- Seed data matches production logic.

## Files (anticipated)

- `apps/api/prisma/seed.ts`
- One‑off SQL (documented in task plan)
- `docs/DEPLOYMENT.md` (optional note about production backfill)
