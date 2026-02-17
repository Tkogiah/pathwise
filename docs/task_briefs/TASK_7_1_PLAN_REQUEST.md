# Task 7.1 Plan Request — Notes Data Model + API

## Goal

Add a task‑scoped notes model with API endpoints for create, list, and author‑only edit.

## Requirements

- Notes are attached to `TaskInstance`.
- Notes are visible to all users.
- Notes are editable only by the author.
- No delete.
- Non‑PHI: text only.

## Data Model

- `TaskNote`: id, taskInstanceId, authorId, label, summary, body, createdAt, updatedAt
- `NoteLabel` enum (starter set in brief)

## API

- `GET /tasks/:id/notes`
- `POST /tasks/:id/notes`
- `PATCH /notes/:id` (author only)

## Files Likely Touched

- Prisma schema + migration
- NestJS notes module (controller/service)
- `apps/web/src/lib/types.ts`
- seed data (small demo notes)

## Execution Notes (Token Hygiene)

- Run `typecheck` early; defer `lint`, `test`, and `format` until the end.
- Avoid re-running full test suites after each small change.
- Only update E2E tests if selectors or behavior change.
