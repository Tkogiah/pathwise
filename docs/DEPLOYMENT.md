# Deployment Guide — Pathwise Demo

Platforms: **Vercel** (web) + **Railway** (API) + **Neon** (Postgres)

## 1. Neon (Database)

1. Create a free-tier project at [neon.tech](https://neon.tech)
2. Copy the **pooled** connection string (looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)
3. This becomes the `DATABASE_URL` for Railway

## 2. Railway (API)

1. Connect the GitHub repo
2. Set **root directory**: `apps/api`
3. Set **build command**:
   ```
   npm install && npx prisma generate --schema prisma/schema.prisma && npm run build
   ```
4. Set **start command**:
   ```
   node dist/main.js
   ```
5. Set **environment variables**:
   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled connection string |
   | `JWT_SECRET` | Generate with `openssl rand -base64 32` |
   | `CORS_ORIGIN` | Your Vercel URL (e.g. `https://pathwise.vercel.app`) |
   | `PORT` | Railway sets this automatically |

6. After first deploy, run one-time setup via Railway CLI or shell:
   ```bash
   npx prisma migrate deploy --schema prisma/schema.prisma
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

## 5. Seed User Credentials

All seed users share the same demo password: `password123`

| Name | Email |
|---|---|
| Maria Santos | maria@pathwise.dev |
| James Chen | james@pathwise.dev |
| Aisha Johnson | aisha@pathwise.dev |

## Free-Tier Caveats

- **Neon**: DB may sleep after inactivity; first request takes ~1s cold start
- **Railway**: Free trial has limited hours; upgrade to Hobby ($5/mo) for always-on
- **Vercel Hobby**: Serverless functions have cold starts; fine for demo use
