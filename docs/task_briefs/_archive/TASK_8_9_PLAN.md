# Task 8.9 Plan — Email Delivery for Daily Digest

## Goal

Send the existing daily digest summary via email once the pipeline is stable, gated by a feature flag.

## Plan

1. **Provider**
   - Use Resend (`resend` SDK)

2. **Schema**
   - Add `emailedAt DateTime?` to `UserDigest`
   - Only mark `emailedAt` on successful send (retryable)

3. **Email service**
   - New `EmailService` wrapper for Resend
   - If API key missing, log once and skip

4. **Digest sending**
   - In `DigestService.handleCron()`:
     - After `generateAll()`, send digests only if:
       - `DIGEST_EMAIL_ENABLED === 'true'` **and**
       - `RESEND_API_KEY` is set
   - Fetch digests in one query:
     - `findMany({ where: { dateKey, emailedAt: null }, include: { user: { select: { email, name } } } })`
   - For each digest:
     - Send plain‑text email using digest summary
     - On success, set `emailedAt = now()`

5. **Endpoints**
   - No new public endpoints required
   - Email sending is internal to cron job

6. **Docs**
   - Update `apps/api/.env.example` and `docs/DEPLOYMENT.md` with:
     - `DIGEST_EMAIL_ENABLED`
     - `RESEND_API_KEY`
     - `DIGEST_FROM_EMAIL`
   - Do not edit `apps/api/.env`

## Files

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/...`
- `apps/api/src/digest/email.service.ts` (new)
- `apps/api/src/digest/digest.service.ts`
- `apps/api/src/digest/digest.module.ts`
- `apps/api/package.json`
- `apps/api/.env.example`
- `docs/DEPLOYMENT.md`

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- Manual: set `DIGEST_EMAIL_ENABLED=true`, run cron or manual trigger, verify `emailedAt` set
