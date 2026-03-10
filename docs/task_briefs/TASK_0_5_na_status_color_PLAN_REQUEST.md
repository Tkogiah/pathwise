# Task 0.5 Plan Request — N/A Status Color (Green → Blue)

## Goal

- Change the UI color mapping for N/A task status from green to blue, while keeping semantic distinction from COMPLETE.

## Context

- Current UI visually groups COMPLETE and N/A as green.
- Product decision: N/A should be blue (distinct from completion).

## Scope

- In scope:
  - Update status color mapping and any related tokens/classes.
  - Ensure N/A remains semantically distinct in labels.
- Out of scope:
  - Changes to task status rules or engine logic.

## Constraints

- Maintain accessibility contrast and consistency with existing palette.

## Tests

- Not applicable (UI mapping change only).

## Files (anticipated)

- `apps/web/src/components/TaskDrawer.tsx`
- `apps/web/src/components/StageNode.tsx` (if stage display uses task colors)
- `apps/web/src/lib/*` (status label/color mapping)
- `apps/web/src/styles` (if tokens are updated)

## Success Criteria

- N/A tasks render blue everywhere they appear.
- COMPLETE remains green.
