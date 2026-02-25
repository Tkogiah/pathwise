# MVP Completion Checklist

Use this before declaring “demo‑ready.”

## 1) Product Walkthrough (manual)

- Login works (seed + new user).
- Client list loads with gauges and progress.
- Client detail loads, roadmap tabs visible.
- Stage selection + task drawer opens reliably.
- Task status updates persist.
- Appointments set + visible on tasks.
- Notes: add + view + activity feed links.
- Digest card shows “No appointments today” when empty.

## 2) Digest + Email (optional)

- `/digest/generate` returns `{ generated: N }`.
- `/digest/me?date=YYYY-MM-DD` returns digest rows.
- `emailedAt` set on successful sends.
- `DIGEST_EMAIL_ENABLED=false` in prod by default.

## 3) CI / Tests

Run standard suite:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run db:seed
npx playwright test
```

Targeted:

```bash
npm run test
npx vitest run apps/api/src/digest/digest.service.spec.ts
```

## 4) Deployment Health

- API `/health` returns `{ "status": "ok" }`.
- Web loads without 4xx/5xx.
- Railway env vars verified:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CORS_ORIGIN`
  - `DIGEST_EMAIL_ENABLED`
  - `RESEND_API_KEY` (only if email enabled)
  - `DIGEST_FROM_EMAIL`

## 5) Documentation

- `docs/DEPLOYMENT.md` updated
- `CONTEXT.md` up to date
- `docs/CI_CHECKLIST.md` present
