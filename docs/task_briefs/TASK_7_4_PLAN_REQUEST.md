# Task 7.4 Plan Request — Clickable Appointment Indicators

## Goal

Make appointment indicators clickable so users can jump directly to the related task.

## Requirements

- Overview “Upcoming appointments” chip opens first upcoming appointment task
- Stage appointment badge opens stage + first appointment task
- Task row appointment indicator opens drawer

## Files Likely Touched

- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/components/StageNode.tsx`
- `apps/web/src/components/TaskRow.tsx`

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
