# Task 0.9 Plan — getProgramSnapshot Engine Function

## Goal

Create a program-level snapshot function that composes existing derivations (no new business rules) for reuse in API/reporting.

## Output Shape

```ts
export interface ProgramSnapshot {
  daysInProgram: number | null;
  progress: { completed: number; total: number };
  totalRedTasks: number;
  behindStageCount: number;
}
```

## Function Signature

```ts
export function getProgramSnapshot(
  startDate: Date | null,
  stages: StageInput[],
  now: Date = new Date(),
): ProgramSnapshot;
```

## Implementation Notes

- Compute per-stage progress with `getStageProgress` and pass to `getRoadmapProgress`.
- Use existing functions only: `daysInProgram`, `getStageProgress`, `getRoadmapProgress`, `getRedTaskCount`, `isStageBehind`.
- No new business logic.

## Changes

1. **Engine** — `packages/engine/src/program.ts`
   - Add `ProgramSnapshot` type.
   - Add `getProgramSnapshot` function.

2. **Exports** — `packages/engine/src/index.ts`
   - Export `getProgramSnapshot` and `ProgramSnapshot` type.

3. **Tests** — `packages/engine/src/__tests__/program.test.ts`
   - Add `describe('getProgramSnapshot', ...)` with tests:
     - All-complete stages → `totalRedTasks=0`, `behindStageCount=0`
     - One non-green stage with later stage activated → `behindStageCount=1`
     - One overdue task → `totalRedTasks=1`
     - Multi-stage progress aggregation

4. **API** — no changes required in this task.

## Testing

```bash
npm run test
```

## Notes

- This function is composition-only and intended for future reporting endpoints.
