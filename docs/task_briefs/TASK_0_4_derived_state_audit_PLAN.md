# Task 0.4 Plan — Derived State Audit

## Goal

- Audit UI/API for remaining derived state in UI components and document what should move into engine/API.

## Scope

- In scope:
  - Identify UI-side derivations.
  - Classify what should move to API/engine vs. what is acceptable in UI.
  - Produce a concrete audit report with recommended follow-up tasks.
- Out of scope:
  - Any implementation or refactors.

## Deliverable

- `docs/DERIVED_STATE_AUDIT.md` containing:
  - Current derived logic already in API (for context).
  - UI-derived logic that should move to API/engine.
  - UI-derived logic that is acceptable to keep in UI.
  - Proposed follow-up tasks with **renumbered** IDs:
    - Task 0.7 — Move upcomingAppointments to API
    - Task 0.8 — Add daysInProgram to RoadmapVM
    - Task 0.9 — getProgramSnapshot engine function

## Constraints

- No code changes.
- Keep the report concise and actionable.

## Success Criteria

- The audit report exists and clearly identifies remaining UI-derived logic.
- Follow-up tasks are renumbered to avoid collisions with 0.5 and 0.6.
