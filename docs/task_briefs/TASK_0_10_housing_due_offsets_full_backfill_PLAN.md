# Task 0.10 Plan — Housing Due Offset Full Backfill

## Goal

Ensure **all Housing template tasks** have `dueOffsetDays` set so every new Housing roadmap auto‑populates due dates from template metadata.

## Rule A Mapping (Stage timeline end day)

| Stage                                   | Timeline  | Default offset |
| --------------------------------------- | --------- | -------------- |
| 1 — Intake & Initial Engagement         | Day 0–3   | 3              |
| 2 — Housing Assessment & Planning       | Day 4–14  | 14             |
| 3 — Documentation & Housing Readiness   | Day 7–30  | 30             |
| 4 — Housing Search & Applications       | Day 14–75 | 75             |
| 5 — Housing Match & Move‑In Preparation | Day 45–90 | 90             |
| 6 — Exit Planning & Transition          | Day 60–90 | 90             |

## Existing offsets (from Task 0.6)

- Stage 1: all 9 tasks already set (offsets 1 or 3).
- Stage 2: tasks s2t5–s2t8 already set (offsets 10 or 14).

## Tasks still null (must backfill)

- Stage 2: s2t1–s2t4 → 14
- Stage 3: all 6 → 30
- Stage 4: all 7 → 75
- Stage 5: all 6 → 90
- Stage 6: all 7 → 90

## Changes

1. **Seed update** — `apps/api/prisma/seed.ts`
   - Add `dueOffsetDays` for all remaining Housing tasks listed above.

2. **Production backfill script** — `docs/backfills/HOUSING_DUE_OFFSETS.sql`
   - Raw SQL that updates `TemplateTask.dueOffsetDays` for Housing tasks where null.
   - Keyed by `ProgramTemplate.slug = 'housing'` and task title.

3. **Deployment note** — `docs/DEPLOYMENT.md`
   - Add a short pointer to the backfill script for production.

## Testing

- No new tests required. Existing 0.6 integration test already validates computeDueDate.

## Success Criteria

- All Housing template tasks have non‑null `dueOffsetDays`.
- New Housing roadmaps auto‑populate due dates for **every** task.
- Production backfill script is versioned and documented.
