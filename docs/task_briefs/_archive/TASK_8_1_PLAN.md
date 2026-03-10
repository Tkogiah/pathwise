# Task 8.1 Plan — Auth Schema + Seed Hashing (Completed)

## Goal

Add password storage to users and seed demo credentials with hashed passwords.

## Changes Implemented

- Added `passwordHash` to `User` model
- Added migration `20260218161000_pathwise`
- Seed now hashes `password123` for all demo users
- Added `bcryptjs` + `@types/bcryptjs` to API deps

## Files Touched

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260218161000_pathwise/migration.sql`
- `apps/api/prisma/seed.ts`
- `apps/api/package.json`

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm run db:seed`
