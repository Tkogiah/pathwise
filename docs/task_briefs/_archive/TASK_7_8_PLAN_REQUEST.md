# Task 7.8 Plan Request — Auto-Note for Appointments

## Goal

Whenever a task appointment is created or updated, automatically create a task note so the activity feed reflects the appointment change.

## Requirements

- On appointment save (date/time and/or note), create a TaskNote
- Note label: `APPOINTMENT`
- Note body should include the appointment date/time and any appointment note text
- Author should be the current demo user ID (same as manual note author)
- Should not create duplicate notes if the appointment is unchanged

## Scope

- API-only if possible (best): appointment update endpoint also writes a note
- UI should not need to manually create notes

## Files Likely Touched

- `apps/api/src/task-instances/task-instances.service.ts`
- `apps/api/src/notes` (maybe reuse service or direct create)
- `apps/web/src/components/TaskDrawer.tsx` (if client-side fallback needed)
- `apps/web/src/lib/types.ts`

## Open Questions

- Do we add a note when appointment is removed? (e.g., set to null)
- Should appointment note edits also generate a note?
