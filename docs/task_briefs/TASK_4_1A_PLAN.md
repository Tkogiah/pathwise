# Task 4.1a Plan — Roadmap-First Behavior + Layout

## Steps

1. Change initial stage selection to null

- In `RoadmapView.tsx`, change `selectedStageId` initial state from `getDefaultStageId(initialRoadmap)` to `null`.
- Update type from `string` to `string | null`.
- This makes the roadmap bar the primary element on first load — no tasks shown until a stage is clicked.

2. Add stage toggle (select / deselect)

- In `RoadmapView.tsx`, clicking the already-selected stage should set it back to `null` (overview).
- Update handler:
  ```ts
  const handleSelectStage = (id: string) => {
    setSelectedStageId((prev) => (prev === id ? null : id));
    if (selectedStageId === id) setSelectedTask(null);
  };
  ```
- Pass `handleSelectStage` through `RoadmapBar` → `StageNode` as before.

3. Add overview prompt

- When `selectedStageId` is null, render a prompt below the roadmap bar:
  "Select a stage to view tasks"
- Style as centered muted text (e.g., `text-content-muted text-sm`) with a dashed border container.

4. Add "Back to overview" control in zoom-in state

- When a stage is selected, render a small link/button above the stage detail section:
  "← Overview"
- Clicking it sets `selectedStageId` to null and clears `selectedTask`.
- Style as subtle text (`text-content-muted`, hover to `text-content-secondary`).

5. Update E2E smoke tests

- In `e2e/smoke.spec.ts`, add a stage-click step at the start of tests 2 and 3 (before interacting with tasks), since tasks are hidden by default.

6. Verification

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

## Risks / Edge Cases

- E2E tests are the biggest risk (tasks hidden by default).
- Clearing the stage should also clear any open task drawer.
- Handoff edit state will be lost when switching back to overview — acceptable.
