# Task 6.5 Plan — Appointments + Editable Due Dates

## Goal
Add per‑task appointment scheduling (date/time + notes) and make due dates editable. Appointments must be visible on task rows and at roadmap overview (stage + global counts).

## Data Model
Add to `TaskInstance`:
- `appointmentAt DateTime?`
- `appointmentNote String?`
- `dueNote String?` (optional note tied to due date)

## Step 1 — Schema + Migration
- Update `apps/api/prisma/schema.prisma` with the new fields on `TaskInstance`.
- Run `npx prisma migrate dev --name add_task_appointment_fields`.

## Step 2 — API: Task update support
- Extend task update DTO to accept:
  - `dueDate` (ISO datetime or null)
  - `dueNote` (string or null)
  - `appointmentAt` (ISO datetime or null)
  - `appointmentNote` (string or null)
- Update task‑instances service to persist these fields.

## Step 3 — Roadmap VM exposure
- Include `appointmentAt`, `appointmentNote`, `dueNote` in task serialization for the UI.

## Step 4 — UI: TaskDrawer edits
- Add editable **Due Date** (date input) + optional note in TaskDrawer with Save/Cancel.
- Add editable **Appointment** section with date/time input + notes + Save/Cancel.
- Keep fields hidden in read‑only mode.

## Step 5 — UI: TaskRow display
- Show a small appointment indicator on task row when `appointmentAt` exists (icon + date).

## Step 6 — Roadmap overview indicators
- StageNode: show a small appointment badge/count for tasks with upcoming appointments in that stage.
- Roadmap header: show total upcoming appointments across all stages.

## Step 7 — Seed (optional)
- Add 1–2 appointment examples to seed data for demo.

## Step 8 — Verify
- `npm run typecheck && npm run lint && npm run test && npm run format`

