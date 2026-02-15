# Pathwise Context

## Purpose

Pathwise is a visual program state engine for case managers. It reduces friction in client roadmap workflows by replacing wall-of-text logs with a clean, visual, and structured roadmap + task execution layer. The goal is rapid, low-reading effort assessment of a client’s status using simple structure, color, iconography, and progress indicators. It should help with handoffs, training, and clarity.

## Product Positioning

- This is NOT a CRM, task manager, or note system.
- It IS a visual roadmap/state engine layered on existing case management workflows.

## Primary Users (MVP)

- Case Managers only (no supervisors/directors/admins in MVP UI).
- An admin dashboard is in scope for future logic/state/naming conventions, but not built in MVP.

## Core UX Principles

- Mobile-first, laptop-friendly.
- White space, minimal color, low visual noise.
- Clear progress snapshot with minimal reading.
- No drag-and-drop, no template editor in MVP.

## MVP Scope Decisions

- Demo-only MVP: seeded data, no auth.
- Phase 2: magic-link auth.
- Single org use case for the company, but keep architecture ready for multi-org scaling later.
- General naming conventions (ProgramTemplate, Stage, Task, etc.).

## Tech Stack (Locked)

- Frontend: Next.js (App Router), TypeScript, TailwindCSS
- Backend: NestJS (TypeScript)
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Testing: Vitest, Supertest, Playwright
- CI/CD: GitHub Actions (lint, typecheck, test, e2e)
- Local dev: Docker Compose
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

## UI Structure

- Client page: name, roadmap tabs, horizontal stage roadmap bar, stage detail panel.
- Stage detail: vertical task list, filters (All/My Tasks).
- Task drawer: right panel for status, due date, blocker, assignee, N/A toggle.

## Out of Scope (MVP)

- Template editor
- Drag-and-drop
- Supervisor dashboards
- Analytics/billing/AI/file uploads

## Roadmap Phases

- Phase 0: repo structure, tooling, DB schema, seed data
- Phase 1: engine + roadmap UI + stage list + read-only task drawer
- Phase 2: task updates + blockers + handoff field + filters
- Phase 3: multi-roadmap tabs + responsive polish + accessibility

## Collaboration Roles

- User: product vision + review
- Codex (this agent): architecture, wiring, task briefs, reviews
- Claude: module/API implementation per task briefs
