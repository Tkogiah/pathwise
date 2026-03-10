# Task 7.5 Plan — Note Labels + Icons

## Goal

Add icon mappings for note labels and ensure consistent label rendering across TaskNotes and NotesRail.

## Steps

### Step 1 — Define label icon map

Update `apps/web/src/lib/note-utils.ts` to return icons for each label:

- APPOINTMENT → 📅
- DOCUMENTS → 📄
- HOUSING_SEARCH → 🏠
- VOUCHER → 🧾
- BENEFITS → 💳
- OUTREACH → 📞
- ID_VERIFICATION → 🪪
- BARRIER → ⚠️
- TASK_UPDATE → ✅
- OTHER → 📝

### Step 2 — Ensure icon display in UI

`TaskNotes` and `NotesRail` already call `getLabelIcon()` and render the icon when present. No UI changes needed beyond the icon mapping.

### Step 3 — Verify

Run `typecheck`, then run full test suite only once at the end.

## Files Changed

- `apps/web/src/lib/note-utils.ts`

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
