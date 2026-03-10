# Task 4.2 Plan — Theme Tokens (CSS Vars + Tailwind Mapping)

## Steps

1. Create tokens file

- Add `apps/web/src/styles/tokens.css`.
- Define all light mode tokens under `:root`.
- Define all dark mode tokens under `.theme-dark`.
- Explicitly define dark semantic bg/border variants (no derived placeholders).

2. Import tokens

- In `apps/web/src/app/globals.css`, import tokens after Tailwind:
  - `@import "tailwindcss";`
  - `@import "../styles/tokens.css";`

3. Map tokens into Tailwind (v4)

- Add a `@theme` block in `globals.css` mapping CSS vars to semantic utility names:
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

4. Apply base tokens in layout shell

- Update `apps/web/src/app/layout.tsx` and/or `globals.css` to set:
  - `bg-surface-primary` on the body/container
  - `text-content-primary` for default text
  - Replace header borders and backgrounds with tokenized utilities

5. Dark mode structure

- Keep light mode as default (`:root`).
- Dark mode is toggled by adding `.theme-dark` on `html` or `body` (no toggle UI required in this task).

6. Verification

- `npm run typecheck`
- `npm run lint`
- `npm run format`
- `npm run test`

## Notes

- No component‑level color migration in this task (handled in Task 4.1).
- Avoid hard‑coded hex in components; tokens are the only source of truth.
- Ensure contrast meets WCAG AA for primary/secondary text.
