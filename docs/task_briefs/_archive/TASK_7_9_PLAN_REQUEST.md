# Task 7.9 Plan Request — Roadmap Overview Card + Current Focus

## Goal

Make the roadmap overview use the same detail-card layout as stage view, and add an editable “current focus” summary for the roadmap.

## Scope

- Overview state shows a card with:
  - Progress arc (overall)
  - Program name
  - Overall completion + day/length + start date
  - Editable “current focus” summary
- Appointment list appears below the card (task list style)
- Remove the compact day/start text from the client header row

## Requirements

- New editable roadmap-level summary field (current focus)
- Summary is persisted per roadmap
- Overview card structure mirrors stage detail card for continuity

## Files Likely Touched

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/*`
- `apps/api/src/roadmaps/*`
- `apps/api/prisma/seed.ts`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/components/OverviewSummary.tsx` (new)
- `apps/web/src/app/clients/[id]/page.tsx`
- `apps/web/src/lib/types.ts`

## Notes

- Summary should be editable unless the roadmap is archived.
