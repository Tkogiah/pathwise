# Local Database Options

Docker is preferred for parity with production, but local development can also use Postgres.app.

## Option A — Docker (preferred when available)

- Start Postgres: `npm run db:up`
- Stop Postgres: `npm run db:down`

## Option B — Postgres.app (no Docker required)

1. Install Postgres.app and start it (runs on port 5432 by default)
2. Run migrations and seed:
   - `cd /Users/tkogiah/ai-workspace/pathwise/apps/api`
   - `npx prisma migrate dev --name init`
   - `cd ../..`
   - `npm run db:seed`

## DATABASE_URL

- `DATABASE_URL=postgresql://pathwise:pathwise@localhost:5432/pathwise_dev`
- If you use a different port, update `DATABASE_URL` accordingly.

## Prisma Seed Config

Prisma seed configuration is defined in `apps/api/prisma.config.ts` (recommended over deprecated `package.json#prisma`).
