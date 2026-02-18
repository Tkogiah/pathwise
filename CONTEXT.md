# Pathwise Context

## Rehydration Order

1. `CONTEXT.md` (this file)
2. `docs/PROJECT_INTENT.md`
3. `docs/BRIEF.md`
4. `docs/ARCHITECTURE.md`
5. `docs/ENGINE_RULES.md`
6. `docs/UI_CLEANUP.md`
7. `docs/DESIGN_TOKENS_BRIEF.md`
8. `docs/templates/Housing_Canonical.md`
9. `docs/templates/Benefits_Canonical.md`
10. `docs/task_briefs/` (latest plan request + plan)
11. `docs/TODO.md`
12. `docs/LOCAL_ENV.md`

## Purpose

Pathwise is a visual program state engine for case managers. It reduces friction in client roadmap workflows by replacing wall‑of‑text logs with a clean, visual, and structured roadmap + task execution layer. The goal is rapid, low‑reading effort assessment of a client’s status using simple structure, color, iconography, and progress indicators. It should help with handoffs, training, and clarity.

## Product Positioning

- This is NOT a CRM, task manager, or note system.
- It IS a visual roadmap/state engine layered on existing case management workflows.

## Primary Users (MVP)

- Case Managers only (no supervisors/directors/admins in MVP UI).
- An admin dashboard is in scope for future logic/state/naming conventions, but not built in MVP.

## Core UX Principles

- Mobile‑first, laptop‑friendly.
- White space, minimal color, low visual noise.
- Clear progress snapshot with minimal reading.
- No drag‑and‑drop, no template editor in MVP.

## MVP Scope Decisions

- Demo‑only MVP: seeded data, no auth.
- Phase 2: magic‑link auth.
- Single org use case for the company, but keep architecture ready for multi‑org scaling later.
- General naming conventions (ProgramTemplate, Stage, Task, etc.).

## Tech Stack (Locked)

- Frontend: Next.js (App Router), TypeScript, TailwindCSS
- Backend: NestJS (TypeScript)
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Testing: Vitest, Supertest, Playwright
- CI/CD: GitHub Actions (lint, typecheck, test, e2e)
- Local dev: Docker Compose or Postgres.app
- Hosting: Vercel (web), Render/Fly.io (api), Neon (db)

## Core Data Model (MVP)

- users (case managers)
- clients
- program_templates
- template_stages
- template_tasks
- client_program_instances
- stage_instances
- task_instances
- task_notes

### Key Field Extensions

- client_program_instances: `programLengthDays`
- client_program_instances: `overviewSummary`
- template_stages: `timelineLabel`, `recommendedDurationDays`
- clients: `isArchived`
- task_instances: `appointmentAt`, `appointmentNote`, `dueNote`
- task_notes: `label`, `summary`, `body`, `authorId`

## Engine Rules (Critical)

- Task status enum: NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETE + is_na flag.
- Locked task if dependent task is required and not COMPLETE.
- Overdue if due_date < today and not COMPLETE.
- Stage status is derived only:
  - GREEN: all required tasks COMPLETE or is_na
  - RED: any required task BLOCKED or overdue
  - YELLOW: required tasks incomplete, no blockers, no overdue
  - GRAY: stage not activated
- Derived status is never stored; computed via pure functions.

## UI Structure (Current)

- Client page: name + controls, roadmap tabs shown when 1+ roadmaps, horizontal stage roadmap bar.
- Overview state: no stage selected; shows overall roadmap card (progress arc + program summary + timeline + editable current focus).
- Zoom-in state: stage header with progress arc + timeline label + “behind schedule” badge, task list below.
- Stage detail: vertical task list, filters (All/My Tasks), handoff summary.
- Task drawer: right panel for status, due date, blocker, appointment scheduling; assignee removed; notes expanded by default.
- Notes rail: client‑only activity feed, collapsible muted sidebar, click-to-navigate.

## Canonical Templates

- Housing template is canonical source of truth for production (6 stages; “Ongoing Case Management” removed from roadmap).
  - docs/templates/Housing_Canonical.md
  - docs/templates/Housing_Canonical.json
- Benefits template (Oregon SNAP‑focused) is available as second roadmap (5 stages).
  - docs/templates/Benefits_Canonical.md

## Theme / Visual Direction (Implemented)

- Warm gray background (not pure white).
- Thick gauge arcs for overall progress + per‑stage progress.
- Two palettes: Light and Dark.
- Tokens implemented via CSS vars + Tailwind mapping (see docs/DESIGN_TOKENS_BRIEF.md).
- Theme toggle in global header; per‑demo‑user preference stored in localStorage.

## Local vs Production Env

- Local dev uses `apps/api/.env` and `apps/web/.env.local` pointing to localhost.
- Production/demo uses host-managed env vars (Railway/Vercel/Neon).
- See `docs/LOCAL_ENV.md` for exact keys and templates.

## Out of Scope (MVP)

- Template editor
- Drag‑and‑drop
- Supervisor dashboards
- Analytics/billing/AI/file uploads

## Roadmap Phases

- Phase 0: repo structure, tooling, DB schema, seed data
- Phase 1: engine + roadmap UI + stage list + read‑only task drawer
- Phase 2: task updates + blockers + handoff field + filters
- Phase 3: multi‑roadmap tabs + responsive polish + accessibility + E2E tests
- Phase 4: UI overhaul (roadmap‑first, zoom‑in view, progress arcs, visual system)
- Phase 5: replace template with canonical housing plan + add benefits template
- Phase 6: client metadata edit, add roadmap activation, client gauges, scheduling/appointments
- Phase 7: task‑scoped notes + client‑only activity feed + notes rail layout

## Recent Additions (Current State)

- Client archiving (archive/unarchive, archived list view).
- Program metadata edit (start date + program length) with API PATCH /roadmaps/:id.
- Roadmap overview summary (editable "current focus") stored on ClientProgramInstance.
- Behind‑schedule logic surfaced in roadmap bar + stage header.
- Add Roadmap flow (GET /templates, POST /clients/:id/roadmaps).
- Client list gauges showing days in program + progress per active roadmap.
- Appointments and due date editing in task drawer; appointment indicators in roadmap overview.
- Task‑scoped notes (TaskNotes) + NotesRail client activity feed.
- Notes API: GET/POST /task-instances/:id/notes, PATCH /notes/:id, GET /clients/:id/notes?since=.
- Appointment auto‑notes (appointment changes create APPOINTMENT notes).

## Collaboration Roles

- User: product vision + review
- Codex (this agent): architecture, wiring, task briefs, reviews
- Claude: module/API implementation per task briefs
- Gemini: backup implementation support; must follow task briefs and rehydration order
