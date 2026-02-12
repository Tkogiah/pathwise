# Engine Rules (Canonical)

## Task Status

Enum: NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETE + is_na flag.

## Task State Rules

A task is RED if:

- status != COMPLETE and due_date < today, or
- status == BLOCKED

A task is LOCKED if:

- depends_on_task_id exists, and
- required task is not COMPLETE

Locked tasks:

- Display gray
- Cannot change status

## Stage Status (Derived Only)

- GREEN: all required tasks COMPLETE or is_na = true
- RED: any required task BLOCKED or overdue
- YELLOW: required tasks incomplete, no blockers, no overdue
- GRAY: not activated yet

## Stage Activation Rule

- A stage activates when the previous stage first has activity.

## Parallel Stage Behavior

- Stages are ordered but can overlap.
- Completion of one stage does not require previous stage completion.
- Multiple stages may be yellow at the same time.
