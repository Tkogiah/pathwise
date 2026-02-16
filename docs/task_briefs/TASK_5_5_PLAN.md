# Task 5.5 Plan — N/A in Status Dropdown (UI Mapping)

## Context

The backend already fully supports `isNa` / `naReason`:

- **Schema**: `TaskInstance` has `isNa Boolean @default(false)` and `naReason String?`
- **DTO**: `UpdateTaskInstanceSchema` accepts `isNa` (boolean) and `naReason` (string | null)
- **Engine**: treats `isNa` as equivalent to `COMPLETE` for progress, locking, color, and stage status
- **TaskRow**: already shows "Not Applicable" label and checkmark when `isNa === true`
- **TaskDrawer**: already shows the N/A reason section when `isNa === true`

The only gap: the TaskDrawer status `<select>` only offers `NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE`. There is no way for a user to set a task to N/A.

## Approach

Treat "Not Applicable" as a **virtual status option** in the dropdown. When selected, the API call sends `{ isNa: true }` (status field left unchanged). When the user switches back to any real status, the API call sends `{ status: newStatus, isNa: false, naReason: null }`.

## Steps

### Step 1 — Extend the dropdown options in `TaskDrawer.tsx`

- Add `'NOT_APPLICABLE'` to the end of the `STATUSES` array (as a UI-only sentinel value).
- Add `NOT_APPLICABLE: 'Not Applicable'` to `STATUS_LABELS`.
- Derive the `<select>` value: if `task.isNa` is true, show `'NOT_APPLICABLE'`; otherwise show `task.status`.

### Step 2 — Update `handleStatusChange` in `TaskDrawer.tsx`

Replace the current handler with branching logic:

```
if newValue === 'NOT_APPLICABLE':
  → apiPatch({ isNa: true })
else:
  → apiPatch({ status: newValue, isNa: false, naReason: null })
```

This ensures:

- Selecting N/A sets the flag without touching status enum.
- Switching back clears `isNa` and `naReason`.

### Step 3 — Handle the locked / readOnly display for N/A

In the read-only / locked branch of the Status display, show "Not Applicable" when `task.isNa` is true instead of the raw `task.status` label.

### Step 4 — Remove the standalone N/A display section

Lines 171-180 currently show a separate "Not Applicable" section with `naReason` below the grid. Since N/A is now a first-class status option visible in the dropdown, this section is redundant. Remove it.

**Decision needed**: Should we keep the `naReason` display somewhere (e.g., inline below the select when N/A is active), or remove it entirely since the plan request says `naReason` is optional?

### Step 5 — Update TaskRow display ordering (minor)

In `getTaskStatusLabel()`, the `isNa` check currently falls below `COMPLETE`. This means a task that is both `isNa: true` and `status: COMPLETE` shows "Complete" rather than "Not Applicable". Move the `isNa` check above the `COMPLETE` check so N/A always takes priority:

```ts
if (task.isLocked) return 'Locked';
if (task.status === 'BLOCKED') return 'Blocked';
if (task.isOverdue) return 'Overdue';
if (task.isNa) return 'Not Applicable'; // moved up
if (task.status === 'COMPLETE') return 'Complete';
if (task.status === 'IN_PROGRESS') return 'In Progress';
return 'Not Started';
```

### Step 6 — E2E test update (`smoke.spec.ts`)

Add a **Test 4** that exercises the N/A flow:

1. Navigate to Marcus Rivera → click Intake stage.
2. Open "Complete participant orientation" task (NOT_STARTED).
3. Change status to `NOT_APPLICABLE`.
4. Assert the status select shows "Not Applicable".
5. Close drawer, assert TaskRow status label = "Not Applicable".
6. Reopen drawer, change status back to `NOT_STARTED`.
7. Assert select shows "Not Started", close drawer.
8. Assert TaskRow label restored to "Not Started".

### Step 7 — Verify

- `npm run typecheck` passes
- `npm run lint` passes
- `npm run format:check` passes
- All E2E tests pass (54 existing + new Test 4)

## Files Changed

| File                                     | Change                                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| `apps/web/src/components/TaskDrawer.tsx` | Add N/A option, update handler, update read-only display, remove standalone N/A section |
| `apps/web/src/components/TaskRow.tsx`    | Reorder `isNa` check in `getTaskStatusLabel()`                                          |
| `e2e/smoke.spec.ts`                      | Add Test 4 for N/A status flow                                                          |

## No Changes Needed

- **Schema / migrations**: `isNa` and `naReason` already exist
- **API DTO**: already accepts `isNa` and `naReason`
- **API service**: already handles `isNa`/`naReason` updates
- **Engine**: already treats `isNa` as complete
- **Types**: `TaskVM` already has `isNa` and `naReason`

## Open Decision

**naReason UX**: The plan request says `naReason` is optional. Options:

1. **Keep it simple** — No reason input; just set `isNa: true`. The existing `naReason` field goes unused from the UI (could be set via API directly). Simplest approach.
2. **Optional text input** — Show a small text input below the select when N/A is selected. User can optionally type a reason before it's saved.

Recommend **Option 1** for now (matches "UI mapping only" intent). Can always add a reason input later.
