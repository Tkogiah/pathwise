# Task 7.9 Plan — Roadmap Overview Card + Current Focus

## Context

The roadmap overview state should feel visually identical to the stage detail card to avoid jarring transitions. We also need a roadmap-level “current focus” summary that captures the main working goal (e.g., “currently working on getting ID”).

## Steps

### Step 1 — Add overview summary field

- Add `overviewSummary String?` to `ClientProgramInstance` in schema
- Add migration
- Seed example summaries for demo roadmaps

### Step 2 — API support

- Extend `PATCH /roadmaps/:id` to accept `overviewSummary`
- Include `overviewSummary` in the roadmap view model

### Step 3 — Overview card layout

- Replace the overview placeholder with a card matching the stage detail layout:
  - Progress arc
  - Program name
  - Overall completion + day/length + start date
  - Overview summary component

### Step 4 — Overview summary UI

- New `OverviewSummary` component:
  - Read-only summary + edit toggle
  - Edit form with Save/Cancel
  - Disabled when archived

### Step 5 — Appointments list under card

- Move appointment indicators out of the card into a list below it
- Render appointments using the task list style (same as stage detail)

### Step 6 — Remove compact program metadata row

- Remove the “Day X / N · Started …” text from the hero header row

### Step 7 — Verify

- Run typecheck, lint, tests, format

## Notes

- The overview card should mirror the stage detail card for continuity.
- “Current focus” summary is a high-level, editable snapshot of what matters now.
