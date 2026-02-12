# Task 1.4 Plan — Roadmap Bar

## Scope

- Render horizontal stage roadmap bar on client detail page
- Allow stage selection for detail view

## Data Source

- GET `/roadmaps/:id` provides stage status, progress, redTaskCount, iconName

## UI Structure

- RoadmapView (client component) manages selected stage state
- RoadmapBar renders scrollable row of StageNode cards
- StageNode shows icon, title, status dot, progress fraction, red badge

## Required Behavior

- Tooltip: title="{completed} of {total} tasks complete"
- Default selected stage: first activated stage, else first stage
- Max 7 visible at a time (fixed-width nodes, horizontal scroll)

## Steps

1. Add shared response types in `src/lib/types.ts`
2. Update client detail page to fetch roadmap and pass to RoadmapView
3. Create RoadmapView (client component) with selectedStageId state
4. Create RoadmapBar and StageNode components
5. Icon mapping (iconName → emoji)
6. Verify build/lint/format

## Files

- `apps/web/src/lib/types.ts`
- `apps/web/src/app/clients/[id]/page.tsx`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/components/RoadmapBar.tsx`
- `apps/web/src/components/StageNode.tsx`
