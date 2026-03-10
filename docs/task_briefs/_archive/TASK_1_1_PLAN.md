# Task 1.1 Plan — Engine Package

## Scope

- Implement pure engine rules from `docs/ENGINE_RULES.md`
- Add minimal shared types in `packages/types`
- Add unit tests in `packages/engine` only

## Proposed Types (packages/types)

- Enums: `TaskStatus`, `StageStatus`
- Interfaces:
  - `TaskInput`
  - `StageInput`

## File Structure

packages/engine/src/

- `index.ts`
- `task.ts`
- `stage.ts`
- `__tests__/task.test.ts`
- `__tests__/stage.test.ts`

## Pure Functions

### task.ts

- `isTaskOverdue(task, now?)`
- `isTaskLocked(task, allTasks)`
- `isTaskRed(task, now?)`
- `getTaskColor(task, allTasks, now?)`

### stage.ts

- `getStageStatus(stage, now?)`
- `shouldActivateStage(stage, previousStage?)`
- `getStageProgress(stage)`
- `getRedTaskCount(stage, now?)`

## Design Notes

- Accept `now?: Date` for deterministic tests.
- Engine is pure, no Prisma dependency.
- N/A counts as COMPLETE for lock and stage logic.

## Testing

- Add Vitest (root dev dependency) but run tests only for `packages/engine`.
- Update root `test` script to run engine tests (workspace command).

## Steps

1. Install Vitest at root
2. Add enums + input interfaces to `packages/types`
3. Implement task functions
4. Implement stage functions
5. Add tests for all rules + edge cases
6. Export public API from `index.ts`
7. Verify: lint, build, test

## Notes

- Stage activation: any task in previous stage with status !== NOT_STARTED counts as activity.
- Cross-stage dependencies should still work (flat task list).
