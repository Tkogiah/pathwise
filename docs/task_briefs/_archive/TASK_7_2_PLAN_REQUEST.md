# Task 7.2 Plan Request — Task Drawer Notes UI

## Goal

Add task‑scoped notes UI in the TaskDrawer with label selection, optional summary, and author‑only edit.

## Requirements

- Notes list (latest first)
- Add note composer with label + body
- Summary field appears if body length > N or via toggle
- Notes editable only by author (no delete)
- Keep UI minimal and collapsed by default

## Files Likely Touched

- `apps/web/src/components/TaskDrawer.tsx`
- `apps/web/src/components/TaskNotes.tsx` (new, optional)
- `apps/web/src/lib/types.ts`

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
