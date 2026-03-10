# Task 7.4 Plan — Clickable Appointment Indicators

## Context

Appointments are now visible at three levels:

- Roadmap overview chip ("Upcoming appointments")
- Stage node badge (count)
- Task row appointment indicator

Users expect all of these to be clickable and to open the related task directly.

## Goal

Make appointment indicators navigable so they open the correct task drawer and stage, without adding new API endpoints.

## Steps

### Step 1 — Make task row appointment indicator open the drawer

- In `TaskRow.tsx`, wrap the appointment indicator in the existing row click behavior (already opens the drawer).
- Ensure click target on the appointment indicator does not stop propagation (no `stopPropagation`).
- Result: clicking the indicator is the same as clicking the row.

### Step 2 — Make overview appointment chip clickable

- In `RoadmapView.tsx` (overview state), convert the "Upcoming appointments" chip into a button.
- On click:
  1. Find the first task with `appointmentAt` in the future (across all stages).
  2. Set `selectedStageId` to that task’s stage.
  3. Set `selectedTask` to that task to open the drawer.
- If none found, no-op.

### Step 3 — Make stage appointment badge clickable

- In `StageNode.tsx`, wrap the appointment badge in a button (or make it a clickable element) that calls a new prop handler like `onOpenFirstAppointment(stageId)`.
- In `RoadmapBar` / `RoadmapView`, implement the handler:
  1. Find the first task within that stage with a future `appointmentAt`.
  2. Set `selectedStageId` and `selectedTask`.

### Step 4 — Avoid conflicts with stage selection

- Clicking the stage badge should open the appointment without toggling off the stage (don’t trigger the stage deselect logic).
- Use `event.stopPropagation()` on the badge click so it doesn’t trigger the node’s main onSelect.

### Step 5 — Verify (manual + automated)

- Manual: click each indicator and confirm drawer opens to the correct task.
- No new E2E tests required (existing tests don’t interact with these).

## Files to Change

- `apps/web/src/components/TaskRow.tsx`
- `apps/web/src/components/StageNode.tsx`
- `apps/web/src/components/RoadmapBar.tsx` (if needed for handler wiring)
- `apps/web/src/components/RoadmapView.tsx`

## Notes

- Use future appointments only: `new Date(appointmentAt).getTime() > Date.now()`.
- Keep UI unchanged except for making indicators clickable.

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
