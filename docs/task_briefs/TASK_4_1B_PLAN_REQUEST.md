# Task 4.1b Plan Request — Token Migration + Visual Tweaks

Please produce a concrete plan for **Task 4.1b** only. This should be a step‑by‑step proposal **without implementing yet**.

## Context Docs

- `docs/DESIGN_TOKENS_BRIEF.md`
- `docs/UI_CLEANUP.md`
- `docs/CONTEXT.md`

## Scope

- Replace all hard-coded Tailwind colors in UI components with token-based classes from Task 4.2.
- Stage nodes larger and more readable; stage titles mostly visible (2-line clamp or wider nodes).
- Stage nodes fill with status background when complete; status icons remain for color-blind clarity.
- Drawer overlay should dim but not block (reduce opacity).
- Do not alter data-testid or ARIA attributes.

## Deliverable

- A short plan (5–10 steps max).
- List of components to update and mappings.
- Any risks/edge cases (contrast, hover states, disabled states).
