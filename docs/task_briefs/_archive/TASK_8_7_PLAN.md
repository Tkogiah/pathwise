# Task 8.7 Plan — Appointment Digest Pipeline

## Goal

Generate a daily appointment digest per user (UTC day), stored in the database and ready for future email delivery.

## Scope

- Add a `UserDigest` table with idempotent `userId + dateKey`
- Scheduled job (cron) builds digests daily
- Manual trigger endpoints for testing (JWT‑protected)
- No email delivery yet

## Plan

1. **Schema**
   - Add `UserDigest` model:
     - `id` (cuid)
     - `userId`
     - `dateKey` (string, `YYYY-MM-DD`, UTC)
     - `summary`
     - `createdAt`
   - Add `UserDigest[]` relation on `User`
   - Add `@@unique([userId, dateKey])` for idempotent upsert

2. **Scheduler**
   - Add `ScheduleModule.forRoot()` **once** in `AppModule`
   - `DigestModule` provides service/controller

3. **Digest generation (UTC day window)**
   - Window: `today 00:00 UTC` → `tomorrow 00:00 UTC`
   - Query appointments where:
     - `appointmentAt` within window
     - `status != COMPLETE`
     - `assignedUserId = user.id OR assignedUserId IS NULL`
   - Skip if no upcoming appointments
   - Upsert by `userId + dateKey`

4. **Endpoints (protected)**
   - `POST /digest/generate` → manual trigger for testing
   - `GET /digest/:userId?date=YYYY-MM-DD` → fetch digest
   - Both require JWT (no `@Public()`)

5. **Testing**
   - Integration test: call generate twice for same day and verify one digest per user

## Files

- `apps/api/prisma/schema.prisma`
- `apps/api/src/digest/digest.module.ts` (new)
- `apps/api/src/digest/digest.service.ts` (new)
- `apps/api/src/digest/digest.controller.ts` (new)
- `apps/api/src/app.module.ts`
- `apps/api/package.json`

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- Manual: `POST /digest/generate`, verify `UserDigest` rows
