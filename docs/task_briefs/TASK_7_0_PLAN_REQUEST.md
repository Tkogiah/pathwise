# Task 7.0 Plan Request — Client Layout Restructure + Notes Rail Scaffold

## Goal

Restructure the client detail layout so the roadmap remains the primary canvas while a muted, collapsible notes rail is always available (but not visually dominant).

## Scope

- Consolidate the current header rows into one “hero header” row.
- Introduce a two‑column layout on desktop: primary roadmap canvas + secondary notes rail.
- Notes rail is collapsible (muted), with state persisted in localStorage per demo user.
- Mobile stacks the notes rail below the roadmap.
- No notes data yet (placeholder/empty state only).

## Requirements

- Roadmap remains the dominant visual element.
- Notes rail is narrower and visually muted.
- Collapsed state shows a slim tab/handle (“Notes”) that can expand.
- Persist collapsed/expanded state per demo user.

## Files Likely Touched

- `apps/web/src/components/ClientRoadmapShell.tsx`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/app/clients/[id]/page.tsx`
- (new) `apps/web/src/components/NotesRail.tsx`

## Open Questions

- Exact placement of demo user + theme toggle in hero header row.
- Preferred width ratio for left vs right columns.
