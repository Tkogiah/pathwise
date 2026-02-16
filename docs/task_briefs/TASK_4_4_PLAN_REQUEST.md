# Task 4.4 Plan Request — Dark Theme Toggle

## Goal

Add a user-facing dark theme toggle that switches between light and dark tokens via the existing `.theme-dark` class. The toggle should be placed in the top-right of the client header, persist to `localStorage`, and default to system preference (`prefers-color-scheme`) on first load.

## Requirements

- Toggle location: top-right of the client header (same row as client name / tabs / demo user selector).
- Persistence: store preference in `localStorage` (e.g., key `theme` with values `light` | `dark`).
- Default behavior: if no saved preference, use `prefers-color-scheme: dark` to set initial theme.
- Apply theme by toggling the `theme-dark` class on the root element (preferably `<html>`).
- No visual regressions to existing layout; must be minimal and consistent with design tokens.

## UX Expectations

- Toggle should be obvious but not dominant (e.g., small pill switch or icon button).
- Label optional but recommended for clarity (e.g., “Dark mode”).
- Should work on initial render and remain consistent across route changes.

## Non-Goals

- No system-level theme sync beyond initial load.
- No additional theming beyond existing tokens.

## Verification

- Theme toggles correctly between light and dark.
- Refresh preserves last selected theme.
- When no stored preference, matches system preference.
- Run: `npm run typecheck && npm run lint && npm run test && npm run format`.
