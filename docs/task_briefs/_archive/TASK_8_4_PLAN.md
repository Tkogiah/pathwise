# Task 8.4 Plan — Deployment Notes + PORT (Completed)

## Goal

Capture deployment steps and ensure API uses the injected platform port.

## Changes Implemented

- Added `PORT` support in API startup (`process.env.PORT || 3001`)
- Added deployment checklist for Neon + Railway + Vercel
- Added local environment notes

## Files Touched

- `apps/api/src/main.ts`
- `docs/DEPLOYMENT.md`
- `docs/LOCAL_ENV.md`
- `apps/api/.env.example`
- `apps/web/.env.example`

## Verification

- `GET /health` works in Railway
- Vercel points to Railway API URL
