# Deployment Guide — Pathwise Demo

Platforms: **Vercel** (web) + **Railway** (API) + **Neon** (Postgres)

## 1. Neon (Database)

1. Create a free-tier project at [neon.tech](https://neon.tech)
2. Copy the **pooled** connection string (looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)
3. This becomes the `DATABASE_URL` for Railway

## 2. Railway (API)

1. Connect the GitHub repo
2. Set **root directory**: `.` (repo root — NOT `apps/api`, because workspace packages must be resolved)
3. Set **build command**:
   ```
   npm install --workspaces --include=dev &&
   npx prisma generate --schema apps/api/prisma/schema.prisma &&
   npm run build -w @pathwise/engine &&
   npm run build -w @pathwise/api
   ```
4. Set **start command**:
   ```
   node apps/api/dist/main.js
   ```
5. Set **environment variables**:
   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled connection string |
   | `JWT_SECRET` | Generate with `openssl rand -base64 32` |
   | `CORS_ORIGIN` | Your Vercel URL (e.g. `https://pathwise.vercel.app`) |
   | `DIGEST_EMAIL_ENABLED` | `true` to send daily digest emails (default: disabled) |
   | `RESEND_API_KEY` | Resend API key (required if email enabled) |
   | `DIGEST_FROM_EMAIL` | Sender address (must be verified in Resend) |

   Note: `PORT` is set automatically by Railway — do not set it manually.

6. After first deploy, run one-time setup via Railway CLI or shell:
   ```bash
   npx prisma db push --schema apps/api/prisma/schema.prisma
   npx prisma db seed
   ```

## 3. Vercel (Web)

1. Connect the GitHub repo
2. Set **root directory**: repo root (not `apps/web`)
3. Set **install command**: `npm install --workspaces`
4. Set **build command**: `npm run build:web`
5. Set **output directory**: `apps/web/.next`
6. Set **environment variables**:
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | Railway API URL (e.g. `https://pathwise-api.up.railway.app`) |

## 4. Verification

1. `GET <railway-url>/health` returns `{ "status": "ok" }`
2. `POST <railway-url>/auth/register` with `{ "name": "Test", "email": "test@example.com", "password": "test123" }` returns token
3. Open Vercel URL — login page appears
4. Log in with seed credentials: `maria@pathwise.dev` / `password123`
5. Verify roadmap data loads

## 4A. 502 Triage (API Not Responding)

If `/health` returns 502 or times out:

1. Check Railway **runtime logs** (not build logs). You should see:
   - `Nest application successfully started`
   - `API running on 0.0.0.0:<PORT>`
2. If there are no runtime logs, the container is not starting. Recheck:
   - Root directory = `.`
   - Build command and start command are correct
   - `DATABASE_URL` and `JWT_SECRET` exist
3. If logs show the app started but `/health` still 502:
   - Confirm Railway is injecting `PORT`
   - Ensure `main.ts` listens on `process.env.PORT || 3001` and `0.0.0.0`

## 4B. 500 on Register/Login (Schema Mismatch)

If `/auth/register` returns 500 and logs mention missing columns:

1. Run database schema update once:
   ```
   npx prisma db push --schema apps/api/prisma/schema.prisma
   ```
2. Then reseed (optional):
   ```
   npx prisma db seed
   ```

## 4C. Housing Task Due Dates Missing (Data Backfill Needed)

If Housing roadmaps created before Task 0.10 show no due dates on tasks, run the one-off backfill to populate `dueOffsetDays` on existing template rows:

```bash
DATABASE_URL="YOUR_RAILWAY_DB_URL" npx prisma db execute \
  --schema apps/api/prisma/schema.prisma \
  --stdin < docs/backfills/HOUSING_DUE_OFFSETS.sql
```

This only updates rows where `dueOffsetDays IS NULL` — safe to run multiple times.

## 4E. 500 on Add Roadmap (Data Backfill Needed)

If `/clients/:id/roadmaps` returns 500 and logs mention `ProgramTemplate.slug` being `null`:

1. Backfill slugs for existing templates (production DB):
   ```
   DATABASE_URL="YOUR_RAILWAY_DB_URL" npx prisma db execute \
     --schema apps/api/prisma/schema.prisma \
     --stdin <<< $'UPDATE "ProgramTemplate" SET slug = \'housing\' WHERE slug IS NULL AND name ILIKE \'%housing%\';\nUPDATE "ProgramTemplate" SET slug = \'benefits\' WHERE slug IS NULL AND name ILIKE \'%benefit%\';'
   ```
2. Retry “Add Roadmap”.

## 5. Seed User Credentials

All seed users share the same demo password: `password123`

| Name          | Email              |
| ------------- | ------------------ |
| Maria Santos  | maria@pathwise.dev |
| James Chen    | james@pathwise.dev |
| Aisha Johnson | aisha@pathwise.dev |

## Free-Tier Caveats

- **Neon**: DB may sleep after inactivity; first request takes ~1s cold start
- **Railway**: Free trial has limited hours; upgrade to Hobby ($5/mo) for always-on
- **Vercel Hobby**: Serverless functions have cold starts; fine for demo use
