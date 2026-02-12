# Pathwise Implementation Outline

## Tech Stack Spec

- Frontend: Next.js (App Router), TypeScript, TailwindCSS
- Backend: NestJS (TypeScript)
- DB: PostgreSQL
- ORM: Prisma (migrations + schema)
- Validation: Zod (shared types)
- Testing: Vitest (unit), Playwright (E2E), Supertest (API)
- CI/CD: GitHub Actions (lint, typecheck, unit, e2e, migrate dry-run)
- Local dev: Docker Compose (postgres + pgAdmin optional)
- Hosting: Vercel (frontend), Render/Fly.io (backend), Neon (Postgres)
- MVP auth: none (demo mode, seeded data)
- Phase 2 auth: magic-link (Auth.js or Lucia)

## Architecture Notes (High Level)

- Keep core engine logic as pure functions in a shared package.
- UI does not contain business logic.
- Derived status: never stored, always computed.
- Demo seed data: 1 org, 2–3 case managers, 3 clients, 1 housing template, 2–3 program instances.

## Core Modules

- engine: status calc, overdue logic, lock rules.
- templates: program template + stages + tasks (seeded).
- instances: client program instances, stage/task instances.
- handoff: required summary per stage.
- ui: roadmap bar, stage view, task drawer.

## API Surface (v1 MVP)

- GET /clients
- GET /clients/:id
- GET /clients/:id/roadmaps
- GET /roadmaps/:id (returns stages, tasks, derived status)
- PATCH /task-instances/:id (status, blocker, due date, assigned, is_na)
- PATCH /stage-instances/:id/handoff

## Repo Structure (Monorepo)

- apps/web (Next.js)
- apps/api (NestJS)
- packages/engine (shared logic)
- packages/types (shared types/DTOs)
- packages/ui (shared UI components if needed later)
- infra/compose (docker compose)
- docs/ (briefs, architecture notes)

## CI/CD Plan

- lint: eslint + prettier
- typecheck: tsconfig strict
- test: vitest + supertest
- e2e: playwright (UI flows)
- migrations: prisma migrate deploy (staging)
- build: web + api build

## Task Breakdown (Phased)

### Phase 0 — Foundation

1. Create monorepo structure + tooling
2. Add Docker Compose with Postgres
3. Add Prisma schema + initial migrations
4. Add seed script (demo data)

### Phase 1 — Core Engine + UI Shell

1. Implement engine functions in packages/engine
2. Build Roadmap Bar (mobile-first)
3. Build Stage Detail list
4. Build Task Drawer skeleton (read-only)
5. API GET /clients/:id/roadmaps to deliver precomputed model

### Phase 2 — Interactivity + State

1. Task updates (status, blocker, due date, is_na)
2. Stage handoff summary field
3. “My Tasks” filter (front-end)
4. Overdue + blocked visual logic
5. Locking rule enforcement

### Phase 3 — Multi-Roadmap + Polish

1. Multi-roadmap tabs per client
2. Responsive improvements (tablet/laptop)
3. Accessibility pass (color + icon)
4. UX refinements (empty states, subtle loaders)
