# Task 8.0 Plan Request — Phase 8 Demo Auth + Hosting Overview

## Goal

Ship a demo‑only auth + hosting setup so multiple users can log in and use the app across devices. Keep scope minimal and non‑PHI. JWT auth with public signup.

## Scope Guardrails

- Demo‑only (no PHI, no HMIS data)
- Public signup allowed
- No password reset, no email verification, no SSO
- Single role (case manager)
- JWT stored in localStorage (demo)

## Platforms

- Web: Vercel (Hobby)
- API: Railway (free/trial)
- DB: Neon (free)

## Deliverables

- 8.1 Auth schema + hashing
- 8.2 Auth API (register/login)
- 8.3 Frontend auth UI + route guard
- 8.4 Hosting checklist + env wiring

## Token Hygiene

Reminder: For implementation, skip running tests unless user explicitly asks. Note any lint/test failures as pre‑existing.
