# Task 4.4 Plan — Dark Theme Toggle

## Step 1: Add Inline Theme Script to Prevent Flash

In `apps/web/src/app/layout.tsx`, add a small inline `<script>` in `<head>` that runs before paint. It reads `localStorage.getItem('theme')` — if `'dark'`, adds `theme-dark` to `<html>`. If no stored value, check `matchMedia('(prefers-color-scheme: dark)')` and apply `theme-dark` accordingly. This prevents flash‑of‑wrong‑theme on page load.

Remove any hard‑coded `className="theme-dark"` on `<html>`.

Add `suppressHydrationWarning` to `<html>` to avoid hydration warnings about class mismatch.

Example pattern:

```tsx
<html lang="en" suppressHydrationWarning>
  <head>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('theme-dark');
            }
          })();
        `,
      }}
    />
  </head>
  ...
```

## Step 2: Create ThemeToggle.tsx (Client Component)

Create a small, self‑contained toggle component that:

- Reads `localStorage` on mount (fallback to `matchMedia`)
- Sets local state (`'light' | 'dark'`)
- On click: toggles state, updates `document.documentElement.classList`, writes to `localStorage`

Visuals: small pill or icon button (sun/moon), tokenized classes (e.g., `text-content-muted hover:text-content-secondary bg-surface-card`). Keep it subtle.

## Step 3: Place Toggle in Client Header (Top‑Right)

Per requirement, place the toggle in the **client header** row (top‑right), alongside tabs and demo user selector. This should live in `apps/web/src/components/ClientRoadmapShell.tsx` header layout — not in the global layout header.

## Step 4: Verify

Run:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

## Risks / Edge Cases

1. **SSR hydration mismatch** — covered by inline script and `suppressHydrationWarning`.
2. **Flash prevention** — inline script runs synchronously before paint.
3. **System preference** — only used when no stored preference exists.
4. **Route changes** — theme class on `<html>` persists across navigation; toggle in client header stays consistent on client detail pages.
