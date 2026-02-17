# Task 7.7 Plan — Verification

## Goal

Verify Phase 7 work end-to-end.

## Steps

1. Run typecheck
2. Run lint
3. Run tests (unit + e2e)
4. Run format check
5. Note any pre-existing warnings

## Outcome

No code changes required; this is a verification task.

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
