# Task 4.1b Plan — Token Migration + Visual Tweaks

## Steps

1. Migrate StageNode.tsx

- Status dot map: use `bg-status-success`, `bg-status-warning`, `bg-status-error`, `bg-status-inactive`.
- Selected state: `border-edge bg-surface-elevated ring-2 ring-accent`.
- Default state: `border-edge bg-surface-elevated hover:border-accent`.
- Focus ring: `focus-visible:ring-accent`.
- Title text: `text-content-secondary`.
- Progress text: `text-content-muted`.
- Badge: `bg-status-error text-white`.
- Visual tweaks: widen nodes (`w-24 md:w-28`), `line-clamp-2`.
- When `stage.status === 'GREEN'`, fill entire node with `bg-status-success-bg`.

2. Migrate TaskRow.tsx

- Status dot map: `bg-status-inactive`, `bg-status-success`, `bg-status-warning`, `bg-status-error`.
- Default row: `border-edge bg-surface-elevated`.
- Overdue row: `border-status-error-border bg-status-error-bg`.
- Hover: `hover:bg-surface-card`.
- Focus ring: `focus-visible:ring-accent`.
- Muted text: `text-content-muted`.
- Normal text: `text-content-primary`.
- Due date: `text-content-muted`.
- Avatar: `bg-surface-card text-content-secondary`.
- Blocked badge: `bg-status-error text-white`.
- Lock/N/A icons: `text-content-muted`.

3. Migrate TaskDrawer.tsx

- Overlay: use tokenized overlay class from Task 4.2b (e.g., `bg-overlay/40`).
- Drawer bg: `bg-surface-elevated`.
- Title: `text-content-primary`.
- Close button: `text-content-muted hover:text-content-secondary`.
- Locked banner: `border-status-inactive-border bg-status-inactive-bg text-content-muted`.
- Description: `text-content-secondary`.
- Labels: `text-content-muted`.
- Values: `text-content-primary` / `text-content-secondary`.
- Locked status: `text-content-muted`.
- Select: `border-edge bg-surface-elevated text-content-primary`.

4. Migrate RoadmapView.tsx

- Overview prompt: `border-edge` + `text-content-muted`.
- Back button: `text-content-muted hover:text-content-secondary`.
- Stage detail section: `border-edge bg-surface-elevated`.
- Stage title: `text-content-primary`.
- Progress text: `text-content-muted`.

5. Migrate remaining components

- TaskFilterToggle.tsx: borders/backgrounds to tokens; active uses `bg-accent text-white`, hover uses tokenized surfaces; focus ring `ring-accent`.
- HandoffSummary.tsx: labels and text to token colors; buttons use accent tokens.
- RoadmapTabs.tsx: border to `border-edge`; active tab uses `border-accent` + `text-content-primary`; inactive text uses `text-content-muted`.
- DemoUserSelector.tsx: border/bg use tokens; active uses `bg-accent`; inactive uses `bg-surface-card`.
- ClientRoadmapShell.tsx: loading text to `text-content-muted`.
- RoadmapSkeleton.tsx: skeleton blocks `bg-surface-card`; borders `border-edge`; surfaces `bg-surface-elevated`.
- EmptyState.tsx: `border-edge bg-surface-elevated text-content-muted`.
- StageDetailList.tsx: empty state `border-edge bg-surface-elevated text-content-muted`.

6. Migrate page files

- clients/page.tsx: heading `text-content-primary`, empty text `text-content-muted`, list `divide-edge border-edge bg-surface-elevated`, hover `hover:bg-surface-card`, chevron `text-content-muted`.
- clients/[id]/page.tsx: back link `text-content-muted hover:text-content-secondary`, heading `text-content-primary`.

7. Verification

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

## Risks / Edge Cases

- Ensure data-testid and ARIA attributes are unchanged.
- Drawer overlay must use the new overlay token from Task 4.2b.
- `line-clamp-2` requires Tailwind line‑clamp support (fallback to `max-h` if unavailable).
