# Task 2.4 Plan — Locked Task Enforcement

## Scope

- Enforcement is already in place (API 422, UI disabled status).
- Add clarity: locked explanation banner in TaskDrawer.

## Steps

1. Add info banner in TaskDrawer when `task.isLocked`.
   - Message: "This task is locked because a required dependency is not yet complete."
2. Verify existing enforcement:
   - API returns 422 for locked tasks
   - Status dropdown disabled when locked
   - Lock icon + muted text in task list
3. Run build/lint/format/test

## Files

- `apps/web/src/components/TaskDrawer.tsx`
