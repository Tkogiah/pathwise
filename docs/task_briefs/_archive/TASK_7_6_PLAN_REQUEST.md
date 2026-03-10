# Task 7.6 Plan Request — Notes Permissions + UX Rules

## Goal

Apply visibility and edit rules for notes, and add non‑PHI guidance in the UI.

## Requirements

- All users can view notes
- Only author can edit
- No delete
- Non‑PHI reminder near composer

## Files Likely Touched

- API authorization checks
- Task drawer notes UI
- Activity feed UI

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
