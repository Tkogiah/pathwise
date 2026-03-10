# Task 5.4 Plan Request — Client Archiving

## Goal

Add the ability to archive clients who have completed the program, provide a dedicated place to view archived clients, and allow unarchiving.

## Requirements

- Add an **archive action** on a client (e.g., in client detail or client list).
- Archived clients must be **removed from the active clients list**.
- Provide an **Archived Clients view** (separate page or tab) to list archived clients.
- Archive status must be persisted in the database (not just UI state).
- Archived clients should still be viewable in read-only mode (no edits) unless explicitly requested.
- Provide an **unarchive action** in the archived view to restore a client to active.

## Notes

- This is for end-of-program archival, not deletion.
- We will likely need a boolean field on Client (e.g., `isArchived`) and filtering on list endpoints.

## Deliverable

- A clear plan (5–10 steps) covering DB migration, API changes, UI changes, and tests.
