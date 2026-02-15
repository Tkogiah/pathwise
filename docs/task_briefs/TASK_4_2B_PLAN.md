# Task 4.2b Plan — Overlay Token

## Steps

1. Add overlay token to tokens.css
- Light: `--overlay: #2c2a27`
- Dark: `--overlay: #0a0c14`

2. Map token into Tailwind
- In `globals.css` @theme block, add:
  - `--color-overlay: var(--overlay)`
- This enables `bg-overlay` utilities.

3. Use overlay token in drawer
- TaskDrawer backdrop uses `bg-overlay/40` with a subtle blur (implementation in Task 4.1b).

4. Verify
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

