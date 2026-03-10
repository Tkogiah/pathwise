# Task 4.2 Plan Request — Theme Tokens (CSS Vars + Tailwind Mapping)

Please produce a concrete plan for **Task 4.2** only. This should be a step‑by‑step proposal **without implementing yet**.

## Context Docs

- `docs/PROJECT_INTENT.md`
- `docs/BRIEF.md`
- `docs/UI_CLEANUP.md`
- `docs/DESIGN_TOKENS_BRIEF.md`

## Scope

- Create a **single source of truth** for theme tokens using **CSS custom properties**.
- Map tokens into Tailwind so components use class names tied to the variables.
- Support **light and dark** themes with a toggle‑ready structure (even if toggle is stubbed).
- No hard‑coded hex in component files.

## Naming Convention (Required)

Use semantic, readable @theme names (avoid double prefixes):

- `--color-surface-primary` → `bg-surface-primary`
- `--color-surface-card` → `bg-surface-card`
- `--color-surface-elevated` → `bg-surface-elevated`
- `--color-content-primary` → `text-content-primary`
- `--color-content-secondary` → `text-content-secondary`
- `--color-content-muted` → `text-content-muted`
- `--color-edge` → `border-edge`
- `--color-accent` → `bg-accent`, `text-accent`
- `--color-accent-hover` → `bg-accent-hover`
- `--color-status-success` → `bg-status-success`, `text-status-success`
- `--color-status-success-bg` → `bg-status-success-bg`
- `--color-status-success-border` → `border-status-success-border`
- (same pattern for warning, error, inactive)

## Deliverable

- A short plan (5–10 steps max).
- Where tokens live (e.g., `apps/web/src/styles/tokens.css`).
- How dark mode is applied (class on `html` or `body`, e.g., `.theme-dark`).
- Tailwind @theme mapping using the naming convention above.
- Any risks/edge cases (contrast, existing colors in use).
