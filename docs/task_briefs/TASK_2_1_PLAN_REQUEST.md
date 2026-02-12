# Task 2.1 Plan Request — Task Updates

Please produce a concrete plan for **Task 2.1 (Task Updates)** only.
This should be a step-by-step proposal for PATCHing task instances **without implementing yet**.

## Context Docs

- `docs/CLAUDE_TASKS.md`
- `docs/ENGINE_RULES.md`
- `docs/ARCHITECTURE.md`

## Requirements

- PATCH `/task-instances/:id`
- Update status, blocker, due date, assignee, is_na
- Zod validation (400 on invalid)
- Locked task returns 422
- After PATCH: re-fetch from API (API as source of truth)

## Deliverable

- A short plan (5–10 steps max)
- Endpoint contract + validation
- Any risks/edge cases
