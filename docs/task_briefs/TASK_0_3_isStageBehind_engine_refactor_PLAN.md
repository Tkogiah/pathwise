# Task 0.3 Plan — isStageBehind Derivation Refactor

## Goal
- Move `isStageBehind` logic out of UI and into the engine, then surface it via the API for UI rendering.

## Definition (Agreed)
A stage is **behind** when:
- It is activated, and
- It is not complete (status not GREEN), and
- Any later stage has already been activated.

This is distinct from RED (blocked/overdue). A stage can be YELLOW and behind at the same time.

## Engine Function
Add to `packages/engine/src/stage.ts`:

```ts
export function isStageBehind(
  stage: StageInput,
  allStages: StageInput[],
  now: Date = new Date(),
): boolean
```

Logic:
1. If `stage.activatedAt === null` → false
2. If `getStageStatus(stage, now) === GREEN` → false
3. If any stage with `orderIndex > stage.orderIndex` has `activatedAt !== null` → true
4. Else → false

## API Wiring
- In roadmap view model building, compute `isBehind` per stage using the engine function.
- Include `isBehind` on each stage in the response payload.

## UI Updates
- Replace `isStageBehind` UI utility with `stage.isBehind` from API.

## Tests (Engine)
Add tests to `packages/engine/src/__tests__/stage.test.ts`:
- Stage not activated → false
- Stage GREEN → false
- Stage YELLOW, no later activated → false
- Stage YELLOW, later activated → true
- Stage RED, later activated → true
- Stage YELLOW, only GRAY after it → false
- Last stage → false

## Files
- `packages/engine/src/stage.ts`
- `packages/engine/src/index.ts`
- `packages/engine/src/__tests__/stage.test.ts`
- `apps/api/src/roadmaps/roadmaps.service.ts`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/lib/types.ts`
- `apps/web/src/lib/utils.ts` (remove isStageBehind)

## Success Criteria
- UI no longer computes “behind schedule.”
- Engine/API provide `isBehind` as derived state.
- Tests cover behind logic.
