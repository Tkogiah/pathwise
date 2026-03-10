# Task 0.5 Plan — N/A Status Color (Green → Blue)

## Goal

Separate N/A task color from COMPLETE by introducing a distinct blue semantic token and mapping N/A tasks to blue.

## Scope

- Add N/A semantic tokens (light + dark).
- Update engine task color logic to return `blue` for `isNa` tasks.
- Update web types and UI status styles to accept/render `blue`.
- Update design tokens brief to document the new semantic token.

## Changes

1. `tokens.css`
   - Add `--semantic-na` tokens for light + dark palettes (dot, bg, border).

2. `globals.css`
   - Register `--color-status-na` in `@theme`.

3. `packages/engine/src/task.ts`
   - Add `'blue'` to `TaskColor` union.
   - Split N/A from COMPLETE so `isNa` returns `blue`, COMPLETE remains `green`.

4. `packages/engine/src/__tests__/task.test.ts`
   - Update N/A test to expect `blue`.

5. `apps/web/src/lib/types.ts`
   - Add `'blue'` to `TaskVM.color` union.

6. `apps/web/src/components/TaskRow.tsx`
   - Add `blue: 'bg-status-na'` to `statusStyles`.

7. `docs/DESIGN_TOKENS_BRIEF.md`
   - Document N/A semantic token values (light + dark).

## Testing

- Run engine tests: `npm run test` (or `npm exec -w @pathwise/engine -- vitest run`).
- Spot-check UI: ensure N/A task rows render blue.

## Notes

- API response shape does not change, only color value for N/A tasks.
- No schema migration required.
