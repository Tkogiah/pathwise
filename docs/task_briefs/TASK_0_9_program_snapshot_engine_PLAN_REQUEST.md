# Task 0.9 Plan Request — Program Snapshot Engine (Composition Only)

## Goal

Create a program‑level snapshot function that composes existing engine derivations (no new business rules) for reuse across API views and future reporting.

## Context

- Task 0.4 audit recommended a single program‑level derived snapshot.
- Tasks 0.7 and 0.8 moved upcomingAppointments and daysInProgram into API/engine outputs.
- This task should **compose existing derivations only**, not add new fields or logic.

## Scope

- In scope:
  - New engine function `getProgramSnapshot(...)` that consumes existing derived fields and returns a combined snapshot object.
  - API can optionally call it (or prepare for future usage).
- Out of scope:
  - New business rules or new derived fields.
  - UI changes.

## Constraints

- Must not duplicate logic already in engine (use existing functions).
- Keep output minimal and directly useful for future reporting.

## Tests (required)

- Unit tests verifying snapshot composition over mixed stage states.

## Files (anticipated)

- `packages/engine/src/program.ts`
- `packages/engine/src/__tests__/program.test.ts`
- `packages/engine/src/index.ts`
- `apps/api/src/roadmaps/roadmaps.service.ts` (optional usage)

## Deployment Notes

- Redeploy Railway after merge if API uses snapshot.
- No schema changes or migrations.

## Success Criteria

- Snapshot function composes existing derivations without new rules.
- Tests confirm correct aggregation.
