# Task 0.8 Plan Request — daysInProgram in RoadmapVM

## Goal

Move `daysInProgram` derivation from UI to API so program day is derived consistently and not recomputed in the frontend.

## Context

- UI currently computes program day from `startDate` in `RoadmapView.tsx`.
- Client list already receives `daysInProgram` from the API.
- Derived State Audit (Task 0.4) flagged this as a required move.

## Scope

- In scope:
  - API computes `daysInProgram` for RoadmapVM.
  - UI removes inline calculation and uses API field.
- Out of scope:
  - Changes to program length or scheduling logic.

## Constraints

- Must keep existing UI display format.
- No UI regressions for archived or null start dates.

## Tests (required)

- Integration test verifying daysInProgram is set correctly on RoadmapVM.

## Files (anticipated)

- `apps/api/src/roadmaps/roadmaps.service.ts`
- `apps/web/src/lib/types.ts`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/api/test/integrations/*`

## Deployment Notes

- Redeploy Railway (API) first, then Vercel (web).

## Success Criteria

- UI no longer computes program day.
- RoadmapVM includes `daysInProgram` from API.
