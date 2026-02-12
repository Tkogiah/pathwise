# Task 2.3 Plan — My Tasks Filter

## UI Placement

- Toggle lives in RoadmapView between stage header/handoff and StageDetailList

## Steps

1. Add filter state in RoadmapView: `'all' | 'mine'`
2. Create `TaskFilterToggle` component
3. Filter tasks in RoadmapView based on currentDemoUserId
4. Pass filtered tasks to StageDetailList
5. Add `emptyMessage` prop to StageDetailList
   - When filter = `mine`: "No tasks assigned to you in this stage."
6. Keep filter sticky across stage switches

## Files

- `apps/web/src/components/TaskFilterToggle.tsx`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/components/StageDetailList.tsx`
