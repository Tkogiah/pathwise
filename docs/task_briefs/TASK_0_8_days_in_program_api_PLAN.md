# Task 0.8 Plan — daysInProgram in RoadmapVM

## Goal

Move `daysInProgram` derivation from UI to API so program day is computed once in the backend and consistently rendered.

## Changes

1. **Engine** — `packages/engine/src/program.ts`
   - Add pure helper:
     ```ts
     export function daysInProgram(startDate: Date, now: Date): number {
       return Math.max(
         0,
         Math.floor((now.getTime() - startDate.getTime()) / 86_400_000),
       );
     }
     ```
   - Export from `packages/engine/src/index.ts`.

2. **API** — `apps/api/src/roadmaps/roadmaps.service.ts`
   - In `toViewModel`, set:
     ```ts
     daysInProgram: instance.startDate
       ? daysInProgram(instance.startDate, now)
       : null,
     ```

3. **Types** — `apps/web/src/lib/types.ts`
   - Add `daysInProgram: number | null` to `RoadmapVM`.

4. **UI** — `apps/web/src/components/RoadmapView.tsx`
   - Replace inline `Math.floor` calculation with `currentRoadmap.daysInProgram`.
   - Guard rendering if `daysInProgram` is null.

## Tests

**Engine unit tests** — `packages/engine/src/__tests__/program.test.ts`

- Day 0: same-day start → 0
- Day 1: exactly 24h later → 1
- Fractional day floors correctly (< 24h → 0)
- Month boundary: Jan 28 → Feb 4 = 7
- Future start date clamps to 0

**API integration test** — `apps/api/test/integrations/roadmaps.spec.ts`

- Day 0 assertion: `daysInProgram === 0` for freshly created roadmap
- Explicit offset: update startDate to 7 days ago, assert `daysInProgram === 7`

## Notes

- No schema change or migration.
- `program.ts` will also house `getProgramSnapshot` in Task 0.9.

## Testing Commands

```
npm run typecheck
npm run test
npm run test:api
```
