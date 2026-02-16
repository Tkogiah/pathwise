# Task 5.5 Plan Request — N/A in Status Dropdown (UI Mapping)

## Goal
Allow users to select **Not Applicable** from the task status dropdown. This should map to the existing `isNa` / `naReason` fields (no new enum value).

## Requirements
- Add "Not Applicable" to the status dropdown in `TaskDrawer`.
- Selecting it should set `isNa: true` (and optionally clear or preserve `status` per plan).
- When a user switches back to a normal status, `isNa` should be reset to `false` (and `naReason` cleared if needed).
- Preserve existing status enum values in DB/engine (no schema change).
- Ensure UI displays "Not Applicable" consistently wherever status is shown.

## Notes
- This is a UI mapping only (Option 2).
- If needed, use `naReason` for a short reason when N/A is selected.

## Deliverable
- A short plan (5–10 steps) covering UI, API patch payload, and test updates if needed.

