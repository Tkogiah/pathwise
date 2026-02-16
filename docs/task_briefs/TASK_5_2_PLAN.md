# Task 5.2 Plan — Update E2E Tests for Canonical Template

## Background

The canonical 7‑stage Housing Template (Task 5.1) replaced the old 5‑stage seed. E2E smoke tests must reference the new stage/task titles via slugified data‑testids.

## Target Client for Tests: Marcus Rivera

Marcus has 1 roadmap instance with only Stage 1 ("Intake & Initial Engagement") activated. Two tasks have predictable states:
- `Review referral packet` → IN_PROGRESS
- `Complete participant orientation` → NOT_STARTED

These are deterministic and safe for test updates.

## Slugified Test IDs

Using `slugify()` from `apps/web/src/lib/utils.ts`:
- Stage: `Intake & Initial Engagement` → `intake-initial-engagement`
- Task: `Review referral packet` → `review-referral-packet`
- Task: `Complete participant orientation` → `complete-participant-orientation`

## Steps

1. Update header comment in `e2e/smoke.spec.ts` to reflect canonical titles and Marcus’s new task states.
2. Test 1 (Client list navigation): no selector changes needed (template‑agnostic).
3. Test 2 (Task drawer interaction):
   - Click stage via `[data-testid="stage-node-intake-initial-engagement"]`
   - Task row: `[data-testid="task-row-review-referral-packet"]`
   - Drawer title: `Review referral packet`
4. Test 3 (Status update + stage recalculation):
   - Click stage via `[data-testid="stage-node-intake-initial-engagement"]`
   - Stage progress: `[data-testid="stage-progress-intake-initial-engagement"]`
   - Task to toggle: `[data-testid="task-row-complete-participant-orientation"]`
   - Status label: `[data-testid="task-status-label-complete-participant-orientation"]`
   - Cleanup: reset status back to NOT_STARTED
5. Verify: `npm run typecheck && npm run lint && npm run test && npm run format`.

## Test Stability Concerns

- Use explicit stage selectors (not positional) for resilience.
- Use a NOT_STARTED task for mutation and reset to avoid polluting future runs.

## Files to Modify

- `e2e/smoke.spec.ts`

## Note

This work was already performed as part of Task 5.1; this plan documents the expected state for review.

