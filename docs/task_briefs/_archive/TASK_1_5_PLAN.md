# Task 1.5 Plan — Stage Detail List

## Scope

- Render task list for selected stage
- Pure visual rendering from API TaskVM data

## Components

- `StageDetailList` (renders list or empty state)
- `TaskRow` (single task row)

## Key Rules

- Status indicator uses `task.color`
- Blocker badge when `task.status === 'BLOCKED'`
- Overdue styling when `task.isOverdue`
- Locked styling + lock icon when `task.isLocked`
- N/A styling + subtle check when `task.isNa`
- Assignee from `task.assignedUser?.name`, fallback "Unassigned"

## Steps

1. Create `StageDetailList` component (props: `tasks: TaskVM[]`)
2. Create `TaskRow` component (props: `task: TaskVM`)
3. Implement status dot from `task.color`
4. Add conditional visuals for overdue/locked/N/A/blocker
5. Update `RoadmapView` to pass selected stage tasks into StageDetailList
6. Add empty state when no tasks

## Files

- `apps/web/src/components/StageDetailList.tsx`
- `apps/web/src/components/TaskRow.tsx`
- `apps/web/src/components/RoadmapView.tsx`

## Notes

- Keep components visual-only (no business logic).
- Ensure long text truncates to preserve mobile layout.
