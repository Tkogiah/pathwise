# Task 6.4 Plan Request — Client List Gauges

## Goal
Show a compact gauge summary per client on `/clients`:
- Days in program (`N / programLengthDays`)
- Progress per **active** roadmap (completed/total tasks)

## Requirements
- Only **active roadmaps** are shown.
- Max 4–5 gauges per client row.
- Gauges labeled by program name (short label: Housing, Benefits, Medical, etc.).
- Uses program instance start date + length (from Task 6.3).
- Progress uses completed/total across **all stages** (including inactive).

## Deliverable
- A plan (5–10 steps) covering API aggregation + UI rendering.

