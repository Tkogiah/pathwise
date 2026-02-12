# Pathwise Architecture

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, TailwindCSS
- Backend: NestJS (TypeScript)
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Testing: Vitest, Supertest, Playwright
- CI/CD: GitHub Actions (lint, typecheck, unit, e2e, migrate dry-run)
- Local dev: Docker Compose
- Hosting: Vercel (web), Render/Fly.io (api), Neon (db)

## Core Principles

- Core engine logic is pure functions in a shared package.
- UI does not contain business logic.
- Derived status is never stored; computed at read time.

## Data Model (MVP)

- users
- clients
- program_templates
- template_stages
- template_tasks
- client_program_instances
- stage_instances
- task_instances

## Engine Rules

### Task Status

Enum: NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETE + is_na flag.

### Locked Task

A task is locked if it depends on a required task that is not COMPLETE. Locked tasks are read-only.

### Overdue Logic

If due_date < today and not COMPLETE, task is red and can make stage red.

### Stage Status

Derived only:

- GREEN: all required tasks COMPLETE or is_na
- RED: any required task BLOCKED or overdue
- YELLOW: required tasks incomplete, no blockers, no overdue
- GRAY: stage not activated

## API Surface (v1 MVP)

- GET /clients
- GET /clients/:id
- GET /clients/:id/roadmaps
- GET /roadmaps/:id (stages, tasks, derived status)
- PATCH /task-instances/:id (status, blocker, due date, assigned, is_na)
- PATCH /stage-instances/:id/handoff

## Repo Structure (Monorepo)

- apps/web (Next.js)
- apps/api (NestJS)
- packages/engine (shared logic)
- packages/types (shared types/DTOs)
- packages/ui (optional shared UI components)
- infra/compose (docker)
- docs/

## CI/CD Plan

- lint: eslint + prettier
- typecheck: tsconfig strict
- test: vitest + supertest
- e2e: playwright (UI flows)
- migrations: prisma migrate deploy (staging)
- build: web + api build

## Monorepo Structure

- apps/web (Next.js)
- apps/api (NestJS)
- packages/engine (shared logic)
- packages/types (shared types/DTOs)
- packages/ui (optional shared UI components; deferred in Phase 0)
- infra/compose (docker)
- docs/

## Seed Data (MVP)

- 1 org
- 2–3 users (case managers)
- 3 clients
- 1 housing template
- 2–3 program instances

## Engine Mapping Note

- Engine dependency resolution uses **templateTask IDs** (not task instance IDs) so `dependsOnTaskId` matches correctly.
