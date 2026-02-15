# Task 4.1 Plan Request — UI Overhaul (Roadmap-First)

Please produce a concrete plan for **Task 4.1** only. This should be a step‑by‑step proposal **without implementing yet**.

## Context Docs

- `docs/BRIEF.md`
- `docs/CONTEXT.md`
- `docs/UI_CLEANUP.md`
- `docs/PROJECT_INTENT.md`
- `docs/DESIGN_TOKENS_BRIEF.md`

## Core Goals

- Roadmap-first UI: the roadmap is the primary element at client overview.
- Keep roadmap visible at all times for context (even in zoom‑in state).
- Clicking a stage should enter a clear “zoom‑in” view with tasks below.
- Task rows open a right-side drawer.
- Drawer should **dim** background but not fully block it (keep roadmap visible behind overlay).
- Warm gray app background (not pure white).
- Stage status palette (green/yellow/red/gray) with icons for color‑blind clarity.
- **Use theme tokens from Task 4.2 only** (no hard‑coded Tailwind grays).

## Interaction Requirements

- Zoom‑in emphasis should feel familiar for non‑technical users (subtle scale + outline/glow on selected stage).
- Stage tasks are stacked rows in zoom‑in view (no tasks shown in overview-only state).
- Client header remains visible when zoomed in.
- Stage progress indicator appears near the header in zoom‑in mode (mirrors overview logic).

## Deliverable

- A short plan (5–10 steps max).
- Proposed layout structure (header/overview/zoom‑in sections).
- Component changes (what to edit vs create).
- Color system usage via token classes (from Task 4.2).
- Any risks or edge cases.
