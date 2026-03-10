# Task 0.6 Plan Request — Template Due Date Rules (dueOffsetDays)

## Goal

- Auto‑assign task due dates based on template metadata (`dueOffsetDays`) while keeping user edits allowed for now.

## Context

- Product goal: due dates should be derived from the roadmap template, not manually set each time.
- Users can still override in MVP; role‑based permissions can be added later.

## Scope

- In scope:
  - Add `dueOffsetDays` to `TemplateTask`.
  - Set `TaskInstance.dueDate` on roadmap creation using `startDate + dueOffsetDays`.
  - Allow user edits (no permission gating yet).
  - Update seed data to include offsets for key tasks.
- Out of scope:
  - Role‑based due date permissions.
  - UI changes beyond showing computed dates (existing UI already does this).

## Constraints

- Must not break existing roadmap creation.
- If `dueOffsetDays` is null, leave `dueDate` unchanged.

## Tests (required)

- Unit test for due date derivation (offset → correct date).
- Integration test for roadmap creation populating task due dates.

## Files (anticipated)

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/seed.ts`
- `apps/api/src/roadmaps/*`
- `packages/engine/*` (if derivation lives in engine)
- `apps/api/test/*`

## Success Criteria

- New roadmaps auto‑populate task due dates from template offsets.
- Users can still edit due dates manually.
- No regressions in existing roadmap creation flow.
