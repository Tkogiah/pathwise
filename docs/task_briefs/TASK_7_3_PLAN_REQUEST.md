# Task 7.3 Plan Request — Client Activity Feed (Notes Rail)

## Goal

Populate the notes rail with a client‑scoped activity feed of notes across all tasks/roadmaps.

## Requirements

- Client‑only feed (no global feed)
- Filters: last 24 hours / last 7 days
- Each entry shows label + icon + summary (or first line) + timestamp + breadcrumbs
- Clicking an entry jumps to its task and opens the drawer

## Files Likely Touched

- `apps/web/src/components/NotesRail.tsx`
- `apps/web/src/components/ClientRoadmapShell.tsx`
- `apps/web/src/components/RoadmapView.tsx`
- API endpoint for client notes aggregation (or reuse existing endpoints)

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
