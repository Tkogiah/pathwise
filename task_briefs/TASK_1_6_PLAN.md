# Task 1.6 Plan — Task Drawer Skeleton

## Scope
- Read-only task drawer
- Mobile-first slide-up, desktop right panel
- No new dependencies

## Steps
1. Add state in `RoadmapView` for `selectedTask: TaskVM | null`
2. Create `TaskDrawer` component
3. Render read-only fields from TaskVM
4. Add backdrop + close behavior
5. Wire click handlers from TaskRow → StageDetailList → RoadmapView
6. Render `<TaskDrawer />` inside RoadmapView

## Required Fields
- Title, description
- Status
- Assigned user (or Unassigned)
- Due date (formatted)
- Blocker type + note (if blocked)
- N/A reason (if isNa)

## Accessibility + UX
- Add `role="dialog"`, `aria-modal`, `aria-labelledby`
- Close on backdrop click and `Esc`
- Lock body scroll while drawer open

## Files
- `apps/web/src/components/TaskDrawer.tsx` (new)
- `apps/web/src/components/RoadmapView.tsx` (modify)
- `apps/web/src/components/StageDetailList.tsx` (modify)
- `apps/web/src/components/TaskRow.tsx` (modify)
