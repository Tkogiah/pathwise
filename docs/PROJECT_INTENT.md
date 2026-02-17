# Project Intent

## Why This Project Exists

This project is portfolio‑grade software to demonstrate full‑stack engineering competence. It is meant to showcase clean architecture, backend design, testing, CI/CD, and product thinking. The app is also real‑world: it targets case managers and reduces friction in client roadmap workflows by providing clear visual state.

## Canonical Scope vs. Legacy Brief

- The original ChatGPT brief (`docs/CHATGPT_BRIEF.md`) is background context.
- The canonical scope is defined by:
  - `CONTEXT.md`
  - `docs/BRIEF.md`
  - `docs/ARCHITECTURE.md`
  - `docs/OUTLINE.md`
  - `docs/ENGINE_RULES.md`
  - `docs/CLAUDE_TASKS.md`

## Stack (Locked)

- Frontend: Next.js (App Router), TypeScript, TailwindCSS
- Backend: NestJS (TypeScript)
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Testing: Vitest, Supertest, Playwright
- CI/CD: GitHub Actions
- Local dev: Docker Compose

## MVP Scope Decisions

- Demo‑only MVP with seeded data, no auth.
- Phase 2 adds magic‑link auth.
- Single org initially, architecture ready for multi‑org scaling.
- Mobile‑first UI with laptop‑friendly layout.
- Non‑PHI only (no SSN, documents, or HMIS‑protected data).

## Core Product Goal

Reduce visual noise and enable rapid client status assessment using clear structure, color, iconography, and progress indicators. The app should feel like a visual state engine, not extra documentation.

## Current Product Direction

- Two canonical templates: Housing (6 stages) + Benefits (5 stages).
- Task scheduling (due dates + appointments) with visual indicators.
- Program metadata (start date + program length) editable.
- Client archiving and multi‑roadmap activation.
- Phase 7 in progress: task‑scoped notes and a client‑only activity feed in a muted notes rail.
