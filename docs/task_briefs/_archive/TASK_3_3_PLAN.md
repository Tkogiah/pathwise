# Task 3.3 Plan — Accessibility Pass

## Audit Summary

Component: StageNode

- Issue: Status dot is color-only (no text label). Missing aria-label on button. Missing aria-current for selected state. Red badge has no aria-label.

Component: TaskRow

- Issue: Status dot is color-only. Row is a clickable div (not a button) — no keyboard focus/role. Missing aria-label. Blocker badge, lock icon, N/A check use title but no aria-label.

Component: TaskFilterToggle

- Issue: Missing aria-pressed on toggle buttons. Container missing role="group" + aria-label.

Component: RoadmapTabs

- Issue: Missing role="tablist" / role="tab" / aria-selected / aria-controls.

Component: TaskDrawer

- Issue: Already good — has role="dialog", aria-modal, aria-labelledby, aria-label on close button.
- Status <select> missing aria-label.

Component: HandoffSummary

- Issue: Already good — has aria-label on textarea and buttons.

## Steps

1. StageNode

- Add aria-label to the button: "{title} — {status label}, {completed} of {total} complete".
- Add aria-current="true" when selected.
- Add aria-label to the red badge: "{count} overdue or blocked tasks".
- Add focus-visible ring styles.

2. TaskRow

- Change the outer element to `<button type="button">` for keyboard accessibility.
- Add aria-label: "{title} — {status label}".
- Add aria-labels to blocker badge, lock icon, and N/A icon (replace title-only).
- Add focus-visible ring styles.

3. Status label logic (StageNode + TaskRow)

- Add a visually-hidden label next to each status dot so status is never conveyed by color alone.
- Ensure labels follow precedence: locked → blocked → overdue → complete/N/A → in progress → not started.

4. TaskFilterToggle

- Add role="group" + aria-label="Task filter" to container.
- Add aria-pressed to each button.

5. RoadmapTabs

- Add role="tablist" to container.
- Render each tab as `<button role="tab">` with `id`, `aria-selected`, and `aria-controls`.
- Add `role="tabpanel"` + `aria-labelledby` to the panel container (RoadmapView wrapper).
- Add focus-visible ring styles.

6. TaskDrawer

- Add aria-label="Task status" to the status `<select>`.

7. Verify

- npm run build && npm run lint && npm run format && npm run test

## Notes

- No visual changes beyond focus rings and sr-only text.
- No API changes.
- Tailwind `sr-only` class is built-in.
