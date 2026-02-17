# Task 7.6 Plan — Notes Permissions + UX Rules

## Goal

Confirm notes permissions and non‑PHI UX rules are enforced.

## Current State (already implemented)

- **Visibility:** Notes are readable by all users (no auth gating).
- **Author‑only edit:** `PATCH /notes/:id` checks `authorId` match; UI only shows Edit for author.
- **No delete:** No delete endpoint or UI.
- **Non‑PHI reminder:** Composer shows “Avoid entering PHI/SSN/ID numbers.”
- **Read‑only mode:** Notes composer and edit are disabled when `readOnly` is true.

## Steps

1. Verify API author check is enforced (`notes.service.ts`).
2. Verify UI hides edit for non‑author and when read‑only.
3. Verify non‑PHI reminder present in composer.

## Outcome

No code changes required; task is satisfied by existing implementation.

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
