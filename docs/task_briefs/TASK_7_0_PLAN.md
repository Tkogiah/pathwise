# Task 7.0 Plan — Client Layout Restructure + Notes Rail Scaffold

## Context

The client detail page currently uses a vertical single-column layout:

1. **Root layout header** — "Pathwise" brand + DemoUserSelector + ThemeToggle (`max-w-3xl lg:max-w-5xl`)
2. **Client detail page** — back link row, then client name + actions row, then `<ClientRoadmapShell>` (tabs + roadmap view)

The plan request asks us to:

- Consolidate the two client-level header rows into one **hero header** row
- Introduce a **two-column desktop layout**: primary roadmap canvas + secondary notes rail
- The notes rail is collapsible, muted, with state persisted in localStorage per demo user
- Mobile stacks notes rail below roadmap
- No notes data yet — empty-state placeholder only

## Approach

### Step 1 — Consolidate the hero header in `page.tsx`

Merge the back link and client name + actions into a single row:

```
[← All clients] [Client Name + Archived Badge] [ArchiveButton] [AddRoadmapButton] [DemoUserSelector] [ThemeToggle] [ProgramMetadata summary]
```

- Back link on the left, client name next to it, actions pushed to the right via `ml-auto`
- Single `flex items-center gap-3` row replaces the current two rows
- ProgramMetadata is displayed here as a compact **read‑only** summary string

### Step 2 — Widen the root layout max-width

The current `max-w-3xl lg:max-w-5xl` is too narrow for a two-column layout. Widen to `max-w-3xl lg:max-w-6xl` (1152px) to accommodate the roadmap + notes rail side by side.

Apply the same change to both the `<header>` inner `<div>` and the `<main>` element.

### Step 3 — Create `NotesRail.tsx` component

A client component with:

**Props:**

- `clientId: string` — used for future data fetching and localStorage key scoping
- `currentDemoUserId: string | null` — for per-user collapse persistence

**State:**

- `collapsed: boolean` — initialized from `localStorage.getItem(`pathwise-notes-rail:${currentDemoUserId}`)` (default: **expanded** unless a stored value exists)

**Collapsed view:**

- A slim vertical handle/tab: ~40px wide, full height, showing "Notes" rotated 90° or horizontal
- Click toggles to expanded

**Expanded view:**

- ~280px wide panel with muted background (`bg-surface-card border-l border-edge`)
- Header row: "Notes" title + collapse button (×)
- Empty state: centered muted text "No notes yet."

**localStorage persistence:**

- Key: `pathwise-notes-rail:${demoUserId}`
- Written on every toggle

### Step 4 — Introduce two-column layout in `ClientRoadmapShell.tsx` (grid)

Wrap the roadmap content and NotesRail in a flex container:

Use a grid for predictable widths:

```tsx
<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
  <div className="min-w-0 space-y-4">{/* RoadmapTabs + RoadmapView */}</div>
  <NotesRail clientId={clientId} currentDemoUserId={currentDemoUserId} />
</div>
```

- Desktop: grid columns; rail is fixed 280px
- Collapsed rail switches to `md:grid-cols-[minmax(0,1fr)_40px]`
- Mobile: stack with `flex-col` behavior

### Step 5 — Update `ClientRoadmapShell.tsx`

Add the two-column layout here (since it's the client component boundary):

Add the two-column grid here (client component boundary). Pass `clientId` and `currentDemoUserId` to NotesRail. This requires passing `clientId` into `ClientRoadmapShell` from the page.

### Step 6 — Verify

- `npm run typecheck` passes
- `npm run lint` passes
- `npm run format:check` passes
- All existing E2E tests still pass (no behavior changes, only layout)

No new E2E tests needed — this is a layout/scaffold change with no interactive data.

## Files Changed

| File                                             | Change                                                                           |
| ------------------------------------------------ | -------------------------------------------------------------------------------- |
| `apps/web/src/app/clients/[id]/page.tsx`         | Consolidate hero header into single row, pass `clientId` to `ClientRoadmapShell` |
| `apps/web/src/app/layout.tsx`                    | Widen `max-w-3xl lg:max-w-5xl` → `max-w-3xl lg:max-w-6xl`                        |
| `apps/web/src/components/ClientRoadmapShell.tsx` | Accept `clientId` prop, add two-column flex layout wrapping roadmap + NotesRail  |
| `apps/web/src/components/NotesRail.tsx` (new)    | Collapsible notes rail with empty state, localStorage persistence                |

## No Changes Needed

- **API**: No new endpoints, no data fetching
- **Schema**: No migrations
- **RoadmapView / TaskDrawer**: Unchanged
- **E2E tests**: Existing tests unaffected (layout-only change)

## Open Decisions (Resolved)

- **Default state**: Expanded by default. Only collapsed if saved in localStorage.
- **Width ratio**: Fixed 280px rail; roadmap takes remaining width.
- **Root layout width**: `lg:max-w-6xl` (1152px).
