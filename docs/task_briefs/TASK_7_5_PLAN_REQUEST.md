# Task 7.5 Plan Request — Note Labels + Icons

## Goal

Implement label list and icon mapping for notes, consistent across task notes and activity feed.

## Starter Labels

- Appointment
- Documents
- Housing Search
- Voucher
- Benefits
- Outreach
- ID/Verification
- Barrier
- Task Update
- Other

## Files Likely Touched

- Shared label/emoji map (e.g., `apps/web/src/lib/note-labels.ts`)
- Task notes UI + activity feed
- API validation (enum)

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
