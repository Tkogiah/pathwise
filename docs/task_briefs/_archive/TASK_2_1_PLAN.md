# Task 2.1 Plan — Task Updates

## Endpoint

PATCH `/task-instances/:id`

### Request body (all optional)

- `status?: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETE`
- `assignedUserId?: string | null`
- `dueDate?: string | null` (ISO)
- `blockerType?: INTERNAL | EXTERNAL | UNKNOWN | null`
- `blockerNote?: string | null`
- `isNa?: boolean`
- `naReason?: string | null`

### Responses

- 200 updated task instance
- 400 validation error
- 404 not found
- 422 locked task

## Validation (Zod)

- Enforce enums and types
- Require at least one field

## Lock Enforcement

- Load task + templateTask + all tasks in same program instance
- Map TaskInput IDs to **templateTask.id** for dependency resolution
- If locked, return 422

## Side Effects

- If status → COMPLETE, set completedAt
- If status leaves COMPLETE, clear completedAt
- If status leaves BLOCKED, clear blockerType + blockerNote
- If blockerType null → clear blockerNote

## Web Strategy (MVP)

- API is source of truth (re-fetch roadmap after PATCH)
- Minimal UI: status dropdown only in TaskDrawer

## Steps

1. Add `zod` to apps/api
2. Create Zod schema for PATCH body
3. Create TaskInstancesModule (controller + service)
4. Implement update() with lock check + side effects
5. Add PATCH route with validation + error handling
6. Add minimal status dropdown in TaskDrawer
7. Re-fetch roadmap after PATCH

## Notes

- Keep UI minimal (status only) to reduce scope.
- Lock check must use templateTask IDs.
