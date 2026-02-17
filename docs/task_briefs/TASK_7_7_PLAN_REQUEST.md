# Task 7.7 Plan Request — Verification

## Goal

Verify the Phase 7 work.

## Required

- Update tests if needed
- Run `typecheck`, `lint`, `test`, `format`
- Note any pre‑existing warnings

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
