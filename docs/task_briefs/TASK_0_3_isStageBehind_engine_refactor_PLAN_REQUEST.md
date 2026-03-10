# Task 0.3 Plan Request — isStageBehind Derivation Refactor

## Goal

- Move `isStageBehind` logic out of UI and into the engine/API so roadmap state is fully derived from task data.

## Context

- Current UI logic: `apps/web/src/lib/utils.ts` uses `stage.status`, `activatedAt`, and `Date.now()`.
- Architecture goal: all derived state lives in engine/API, not UI.

## Scope

- In scope:
  - Extract `isStageBehind` into engine (pure function) with tests.
  - API computes `stage.isBehind` (or similar) when building roadmap response.
  - UI reads derived `isBehind` flag only.
- Out of scope:
  - Additional roadmap logic refactors (handled in separate tasks).

## Constraints

- Keep function pure (no DB, no UI).
- Do not change existing stage status rules.

## Tests (required)

- Unit tests for `isStageBehind` in engine.
- API response includes `isBehind` on stages.

## Files (anticipated)

- `packages/engine/src/*`
- `packages/engine/src/__tests__/*`
- `apps/api/src/roadmaps/roadmaps.service.ts`
- `apps/web/src/lib/types.ts`
- `apps/web/src/components/RoadmapView.tsx`

## Success Criteria

- UI no longer computes `isStageBehind`.
- Stage “behind schedule” badge is driven by engine‑derived flag.
