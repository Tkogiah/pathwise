# Task 8.2 Plan — Auth API (Completed)

## Goal

Introduce JWT-based auth endpoints and protect write routes.

## Changes Implemented

- Added AuthModule with JWT service
- Added `/auth/register`, `/auth/login`, `/auth/me`
- Added `JwtAuthGuard` with global `APP_GUARD`
- Added `@Public()` decorator for opt-out
- Marked GET routes as public where appropriate (health, clients, roadmaps, templates, notes)

## Files Touched

- `apps/api/src/auth/auth.module.ts`
- `apps/api/src/auth/auth.service.ts`
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/jwt-auth.guard.ts`
- `apps/api/src/auth/public.decorator.ts`
- `apps/api/src/app.module.ts`
- `apps/api/src/app.controller.ts`
- `apps/api/src/clients/clients.controller.ts`
- `apps/api/src/roadmaps/roadmaps.controller.ts`
- `apps/api/src/templates/templates.controller.ts`
- `apps/api/src/notes/notes.controller.ts`

## Verification

- `npm run typecheck`
- `npm run lint`
- API smoke: `POST /auth/register` and `POST /auth/login`
