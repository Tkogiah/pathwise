# Task 6.2 Plan Request — Roadmap Activation (Client Detail)

## Goal
Allow users to activate a roadmap from the client detail page with a simple, low‑friction UI. Prevent duplicate roadmaps per client.

## Requirements
- Add an **Add Roadmap** button in the client header (only if eligible templates exist).
- Clicking opens a simple modal or selector list of available roadmaps.
- For now, only **Housing** is available. If already active, it should be hidden or disabled.
- POST `/clients/:id/roadmaps` to create a new program instance.
- After activation, refresh the client detail view with the new roadmap tab.

## Constraints
- No duplicate roadmaps per client (only one active per template).
- All action happens in the client detail view (not on `/clients`).

## Deliverable
- A plan (5–10 steps) covering API + UI + validations.

