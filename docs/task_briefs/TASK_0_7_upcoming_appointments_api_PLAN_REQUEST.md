# Task 0.7 Plan Request — Upcoming Appointments in API

## Goal

Move upcoming appointments derivation from UI to API so derived state is centralized and consistent.

## Context

- Current UI derives upcoming appointments by filtering tasks with `appointmentAt > Date.now()` and sorting.
- StageNode also computes per‑stage appointment counts in the UI.
- Derived‑state audit (Task 0.4) calls this out as a required refactor.

## Scope

- In scope:
  - API computes `upcomingAppointments` list for RoadmapVM.
  - API provides per‑stage appointment count OR UI derives it from the list.
  - UI removes filter/sort logic for upcoming appointments.
- Out of scope:
  - Any changes to appointment scheduling UX.
  - Any changes to appointment data model.

## Constraints

- Must not change existing appointment semantics.
- No UI behavior regressions.
- Keep logic in engine/API; UI only renders.

## Tests (required)

- API integration test verifying upcoming appointments list is sorted and filtered by `now`.
- If appointment count is added per stage, include a unit/integration assertion.

## Files (anticipated)

- `apps/api/src/roadmaps/roadmaps.service.ts`
- `apps/web/src/lib/types.ts`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/components/StageNode.tsx`
- `apps/api/test/integrations/*` (if adding integration test)
- `packages/engine/*` (only if helper needed)

## Deployment Notes

- Ensure Railway redeploy triggers when engine/API code changes (watch paths include `apps/api/**` + `packages/**`).
- After merge, redeploy Railway first, then Vercel.
- Validate in prod by creating a new appointment and verifying it appears in the upcoming list.

## Success Criteria

- Upcoming appointments derived in API, not in UI.
- UI uses API‑provided values only.
- Both local and production behave consistently.
