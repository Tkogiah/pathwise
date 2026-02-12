# Claude Task Briefs (Master)

## Claude Instructions (Read First)

Read these files in order before reviewing tasks:

1. `CONTEXT.md`
2. `docs/DEV_CYCLE.md`
3. `docs/BRIEF.md`
4. `docs/ARCHITECTURE.md`
5. `docs/OUTLINE.md`
6. `docs/ENGINE_RULES.md`
7. `docs/PROJECT_INTENT.md`
8. `docs/CHATGPT_BRIEF.md`
9. `docs/CLAUDE_TASKS.md`

Your task:

- Review this task plan for completeness and engineering realism.
- Suggest missing tasks, sequencing issues, or acceptance criteria improvements.
- Do not add features beyond MVP constraints.
- If you recommend moving tasks across phases, explain why.

Deliverable:

- Suggested edits (if any) to tasks or acceptance criteria
- Sequencing changes (if any)
- Risks or gaps you see

## Status in Dev Cycle

We are between Step 2 (Architecture + Risk Plan) and Step 3 (Foundation Setup). The brief, architecture notes, and context are documented. Next is repo/tooling setup, then schema + seed data.

## Phase 0 — Foundation

### Task 0.1 — Monorepo Scaffolding

Scope

- Create monorepo structure with `apps/` and `packages/`.
- Add base `package.json` and workspace config.

Acceptance Criteria

- `apps/web`, `apps/api`, `packages/engine`, `packages/types`, `infra/compose` exist.
- Root `package.json` uses workspaces and scripts for lint, typecheck, test, build.
- Cross-package imports resolve correctly. `packages/engine` can be imported from both `apps/api` and `apps/web`.

### Task 0.2 — Tooling Baseline

Scope

- Add eslint, prettier, tsconfig base.
- Add scripts for lint and typecheck.

Acceptance Criteria

- `npm run lint` and `npm run typecheck` run at root.
- TypeScript strict enabled.

### Task 0.2b — Shared Types Package

Scope

- Create `packages/types` with shared DTOs and Zod schemas.

Acceptance Criteria

- `packages/types` exports core enums (TaskStatus, StageStatus, BlockerType), base entity interfaces, and Zod schemas for PATCH payloads.

### Task 0.3 — CI Skeleton

Scope

- Add GitHub Actions workflow for lint, typecheck, unit tests (placeholder if no tests yet).

Acceptance Criteria

- Workflow runs on push and PR.
- Failing lint or typecheck fails the build.

### Task 0.4 — Docker Compose + Postgres

Scope

- Add Docker Compose for local Postgres.
- Optional pgAdmin service.

Acceptance Criteria

- `docker compose up` brings up Postgres.
- Connection details documented.

### Task 0.7 — App Bootstrap (API + Web)

Scope

- Scaffold `apps/api` (NestJS) and `apps/web` (Next.js + Tailwind).
- Configure Prisma module in API.

Acceptance Criteria

- API starts locally and connects to Postgres.
- Web app runs locally and can call API base URL.

### Task 0.5 — Prisma Setup + Schema

Scope

- Add Prisma to `apps/api`.
- Define schema for MVP tables.

Acceptance Criteria

- Prisma client generates successfully.
- Migration creates all MVP tables: users, clients, program_templates, template_stages, template_tasks, client_program_instances, stage_instances, task_instances.
- `stage_instances` includes `handoff_summary`.
- `task_instances` includes `is_na` and `na_reason` (optional).

### Task 0.6 — Seed Data

Scope

- Add seed script for demo data.

Acceptance Criteria

- Seeds 1 org, 2–3 users, 3 clients, 1 housing template, 2–3 program instances.
- Each program instance has fully instantiated stage_instances and task_instances cloned from the template.
- At least one client has an overdue task, one blocked task, one N/A task, one locked task, one green stage, and one red stage for visual testing.
- Seed can be run with `npm run db:seed`.

## Phase 1 — Core Engine + UI Shell

### Task 1.1 — Engine Package

Scope

- Implement pure functions for task status, overdue, locked, stage status.

Acceptance Criteria

- All rules from `docs/ENGINE_RULES.md` implemented.
- Stage activation rule and parallel stage behavior are implemented and tested.
- Unit tests cover main rules.

### Task 1.2 — Read API for Roadmaps

Scope

- Implement API to return clients and roadmap view model.

Acceptance Criteria

- `GET /clients` returns list.
- `GET /clients/:id` returns client detail.
- `GET /clients/:id/roadmaps` returns stages, tasks, derived status.
- `GET /roadmaps/:id` returns stages, tasks, derived status.

### Task 1.3 — Web Shell + Client Page

Scope

- Create core layout and route for client detail.

Acceptance Criteria

- Client page loads with demo data.
- Layout matches mobile-first constraints.

### Task 1.3b — Client List Page

Scope

- Provide a simple client list and navigation.

Acceptance Criteria

- Renders list of clients.
- Clicking a client navigates to their detail page.
- Future: add loading/error states if this page becomes client-side or uses suspense.

### Task 1.4 — Roadmap Bar

Scope

- Build horizontal roadmap bar with stage nodes.

Acceptance Criteria

- Stage node shows icon, title, status color, task progress tooltip.
- Max 7 stages visible.
- Red task badge count shown on stage node.

### Task 1.5 — Stage Detail List

Scope

- Build task list for selected stage.

Acceptance Criteria

- Shows status indicator, title, assignee, due date, blocker badge, lock icon.
- Overdue tasks display red.
- Locked tasks display gray + lock icon.
- N/A tasks display with a subtle gray check.

### Task 1.6 — Task Drawer Skeleton

Scope

- Drawer shows task fields read-only.

Acceptance Criteria

- Opens from task click.
- No navigation away from page.
- Displays title, description, status, assigned user, due date, blocker type/note, N/A status.

### Task 1.7 — Demo User Context

Scope

- Provide a demo “current user” selector or hardcoded user context.

Acceptance Criteria

- UI can determine current user for assignee display and My Tasks filter.

## Phase 2 — Interactivity + State

### Task 2.1 — Task Updates

Scope

- Update task status, blocker, due date, assignee, is_na.

Acceptance Criteria

- `PATCH /task-instances/:id` works.
- Invalid PATCH bodies return 400 with Zod error details.
- PATCH on locked task returns 422.
- After PATCH, stage status bar recalculates. If a required task completes, dependent locked tasks unlock.
- Strategy: API is source of truth; web re-fetches after PATCH.

### Task 2.2 — Handoff Summary

Scope

- Stage-level required handoff field.

Acceptance Criteria

- `PATCH /stage-instances/:id/handoff` works.
- UI shows and updates summary.

### Task 2.3 — My Tasks Filter

Scope

- Filter tasks by current user.

Acceptance Criteria

- Toggle between All and My Tasks.
- Demo mode uses the user selector (or hardcoded user) to determine current user context.

### Task 2.4 — Locked Task Enforcement

Scope

- Disable changes for locked tasks.

Acceptance Criteria

- Locked tasks are read-only with lock icon.

## Phase 3 — Multi-Roadmap + Polish

### Task 3.1 — Multi-Roadmap Tabs

Scope

- Support multiple active roadmaps per client.

Acceptance Criteria

- Tabs switch between roadmaps.

### Task 3.2 — Responsive Improvements

Scope

- Tablet and laptop layout refinements.

Acceptance Criteria

- Mobile-first still primary, desktop view readable.

### Task 3.3 — Accessibility Pass

Scope

- Ensure color + icon accessibility.

Acceptance Criteria

- WCAG AA contrast met.
- Aria labels on status indicators.
- Status never conveyed by color alone.

### Task 3.4 — UX Refinements

Scope

- Empty states, subtle loaders, micro-clarity.

Acceptance Criteria

- Empty states for: no roadmaps, no tasks in stage.
- Loading skeletons for API fetches.
- Error state for failed requests.

### Task 3.5 — E2E Smoke Tests

Scope

- Add Playwright E2E smoke tests for critical flows.

Acceptance Criteria

- E2E covers: open client page, view roadmap, open task drawer, update task status and verify stage color changes.
