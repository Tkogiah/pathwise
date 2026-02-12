# Task 3.1 Plan — Multi‑Roadmap Tabs

## Scope

- Add tabs for multiple roadmaps
- Switch roadmap view without losing demo user context

## Steps

1. Create `RoadmapTabs` component (tab bar)
2. Create `ClientRoadmapShell` client component
   - Holds selectedRoadmapId
   - Holds demo user selection (lift from RoadmapView)
   - Fetches roadmap data on tab switch
3. Update `/clients/[id]/page.tsx` to render ClientRoadmapShell
4. Hide tabs when only one roadmap
5. Loading state displayed within roadmap content area only
6. Verify build/lint/format/test

## Notes

- Avoid remounting RoadmapView if it would reset demo user state
- Keep tabs visible during loading
