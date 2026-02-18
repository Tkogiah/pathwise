# Pathwise Project Brief

## Product Vision

Pathwise is a visual program state engine for human services case management. It is not a CRM or task manager. It provides a shared, structured roadmap with minimal visual noise so case managers can rapidly assess client progress without reading long logs.

## Goals

- Reduce wall-of-text logs and sticky-note workflows
- Make client state obvious at a glance
- Improve handoffs and training for new case managers
- Enable consistent program pathways

## Target User (MVP)

- Case managers only
- Not supervisors/directors/admins in MVP UI

## MVP Scope Decisions

- Demo-only MVP: seeded data, no auth
- Phase 2: magic-link auth
- Single org use case initially, architecture ready for multi-org scaling
- General naming conventions (ProgramTemplate, Stage, Task, etc.)
- CI/CD with GitHub Actions (lint, typecheck, unit, e2e, migrate dry-run)

## UX Principles

- Mobile-first, laptop-friendly
- White space, minimal color, low visual noise
- Clear progress snapshot with minimal reading
- No drag-and-drop, no template editor in MVP

## Core Features (MVP)

- Client page with roadmap tabs
- Horizontal stage roadmap bar with derived status
- Stage detail task list
- Task detail drawer
- Required stage handoff summary
- Program metadata (start date + length)
- Roadmap overview summary (editable “current focus”)
- Client archiving
- Task scheduling (due date + appointment)
- Task‑scoped notes + client activity feed (notes rail)

## Out of Scope (MVP)

- Template editor
- Drag-and-drop builder
- Supervisor dashboards
- Analytics/billing/AI/file uploads

## Roadmap Phases

- Phase 0: repo structure, tooling, DB schema, seed data
- Phase 1: engine + roadmap UI + stage list + read-only task drawer
- Phase 2: task updates + blockers + handoff field + filters
- Phase 3: multi-roadmap tabs + responsive polish + accessibility
- Phase 4: roadmap-first UI overhaul + tokens + progress arcs
- Phase 5: canonical housing template + benefits template
- Phase 6: client metadata edit + add roadmap + client gauges + scheduling
- Phase 7: task-scoped notes + client-only activity feed + notes rail + overview summary
