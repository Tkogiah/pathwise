# Task 0.4 Plan Request — Derived State Audit

## Goal

- Audit Pathwise UI to identify any remaining derived state in UI components and move derivation into engine/API where appropriate.

## Context

- Architecture goal: all program/roadmap/stage/task derived state should live in engine/API.
- Recent refactor: roadmap progress moved to engine.

## Scope

- In scope:
  - Identify UI‑side derived logic (e.g., `isStageBehind`, upcoming appointments, program day calculations).
  - Propose which items should move to engine/API in follow‑up tasks.
  - Document findings + recommended ordering.
- Out of scope:
  - Implementing the refactors (separate tasks).

## Constraints

- Keep audit objective and scoped; no feature changes.

## Tests

- Not applicable (audit only).

## Files (anticipated)

- `docs/task_briefs/TASK_0_4_derived_state_audit_PLAN.md`
- `docs/DERIVED_STATE_AUDIT.md` (if you want a standalone report)

## Success Criteria

- Clear list of UI‑derived logic and recommended engine/API destinations.
- Ordered follow‑up tasks for refactors.
