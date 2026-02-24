# Task 8.0 Plan — Phase 8 Demo Auth + Hosting Overview

## Context

Pathwise currently has zero authentication. All API routes are public, all web routes are unguarded. A `User` model exists in Prisma (`email @unique`, `name`, `role`) but has no password field. The frontend uses a `DemoUserProvider` backed by localStorage to simulate user switching — this will be replaced by real JWT auth.

Phase 8 adds demo-only JWT auth with public signup, single role (case manager), and deployment to Vercel + Railway + Neon. No PHI, no password reset, no email verification, no SSO.

## Current State Summary

| Area | Status |
|---|---|
| `User` model | Exists — `id`, `name`, `email` (unique), `role` (CASE_MANAGER). **No `passwordHash`.** |
| Auth packages | **None installed** — no `@nestjs/jwt`, `bcryptjs`, `passport`, `@nestjs/config` |
| Auth endpoints | **None** — no `/auth/*` routes |
| API guards | **None** — no global or route-level guards |
| Auth UI | **None** — no `/login`, `/register` pages; no `middleware.ts` |
| Token in requests | **None** — `apiFetch`/`apiPatch`/`apiPost` send no `Authorization` header |
| Env vars | Only `DATABASE_URL` (API) and `NEXT_PUBLIC_API_URL` (web). No `JWT_SECRET`. |
| CORS | Enabled globally via `process.env.CORS_ORIGIN`, default `http://localhost:3000` |
| Seed users | 3 users (`maria`, `james`, `aisha`) — no passwords, hardcoded IDs (`user-1` etc.) |
| DemoUserProvider | localStorage-based user switcher — will be replaced by auth context |

## Sub-Task Breakdown

### 8.1 — Auth Schema + Hashing

**Goal:** Add `passwordHash` to `User`, install `bcryptjs`, update seed with hashed passwords.

**Changes:**

1. **Prisma schema** (`apps/api/prisma/schema.prisma`):
   - Add `passwordHash String?` to `User` model (nullable for safe migration)
   - Run `npx prisma migrate dev --schema apps/api/prisma/schema.prisma`

2. **Install dependency** in `apps/api`:
   - `bcryptjs` (pure JS — no native build issues on Railway/Vercel)
   - `@types/bcryptjs` (dev)

3. **Seed update** (`apps/api/prisma/seed.ts`):
   - Import `bcryptjs` and hash a default demo password (e.g., `"password123"`) for all 3 seed users
   - Each user gets a `passwordHash` field in their `prisma.user.create()` call

4. **No API changes yet** — hashing utility exposed for 8.2

**Files:** `schema.prisma`, `seed.ts`, `apps/api/package.json`

---

### 8.2 — Auth API (Register + Login)

**Goal:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me` endpoints with JWT.

**Changes:**

1. **Install dependencies** in `apps/api`:
   - `@nestjs/jwt` (NestJS JWT module — wraps `jsonwebtoken`)

2. **Add `JWT_SECRET` env var:**
   - `apps/api/.env`: add `JWT_SECRET=dev-secret-change-me`
   - `apps/api/.env.example`: document it

3. **Create `AuthModule`** (`apps/api/src/auth/`):
   - `auth.module.ts` — imports `JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '7d' } })`, provides `AuthService`, `AuthController`
   - `auth.service.ts`:
     - `register(name, email, password)` — check email uniqueness, hash password, create user, sign JWT
     - `login(email, password)` — find user by email, verify hash, sign JWT
     - `validateToken(token)` — verify JWT, return user payload
   - `auth.controller.ts`:
     - `POST /auth/register` — Zod validate `{ name, email, password }`, call service
     - `POST /auth/login` — Zod validate `{ email, password }`, call service
     - `GET /auth/me` — extract JWT from `Authorization: Bearer <token>`, return user info
   - Zod schemas for request validation (consistent with existing pattern)

4. **Create `JwtAuthGuard`** (`apps/api/src/auth/jwt-auth.guard.ts`):
   - NestJS `CanActivate` guard — reads `Authorization` header, verifies JWT via `JwtService`, attaches user to `request.user`
   - Uses `@Public()` decorator + `SetMetadata` to skip guard on public routes

5. **Register guard globally** in `AppModule`:
   - `APP_GUARD` provider pointing to `JwtAuthGuard`
   - Mark auth endpoints + `GET /health` as `@Public()`

6. **Register `AuthModule`** in `AppModule` imports

**Files:** New `auth/` directory (module, service, controller, guard, decorators, zod schemas), `app.module.ts`, `.env`, `.env.example`

---

### 8.3 — Frontend Auth UI + Route Guard

**Goal:** Login/register pages, auth context, protected routes, logout.

**Changes:**

1. **Auth context** (`apps/web/src/components/AuthProvider.tsx`):
   - React context storing `{ token, user, login(), register(), logout() }`
   - `token` read from / written to `localStorage` key `'pathwise-auth-token'`
   - `user` decoded from JWT payload (or fetched via `GET /auth/me` on mount)
   - `login(email, password)` → `POST /auth/login` → store token
   - `register(name, email, password)` → `POST /auth/register` → store token
   - `logout()` → clear token + redirect to `/login`

2. **Update `apiFetch` / `apiPatch` / `apiPost`** (`apps/web/src/lib/api.ts`):
   - Add client-side variants that read token from localStorage and attach `Authorization: Bearer <token>` header
   - Server-side calls (in server components) remain unauthenticated for now
   - **Read routes remain `@Public()` for demo to avoid passing JWT through server components.**
   - **Write routes require JWT.**

3. **Login page** (`apps/web/src/app/login/page.tsx`):
   - Client component with email + password form
   - Calls `auth.login()` from context
   - On success → redirect to `/clients`
   - Link to `/register`

4. **Register page** (`apps/web/src/app/register/page.tsx`):
   - Client component with name + email + password form
   - Calls `auth.register()` from context
   - On success → redirect to `/clients`
   - Link to `/login`

5. **Route guard** (`apps/web/src/components/AuthGuard.tsx`):
   - Wrap protected content (inside layout or as a component)
   - If no token in localStorage → redirect to `/login`
   - Render children only when authenticated
   - Applied in `layout.tsx` wrapping `{children}` (except for `/login` and `/register` routes)

6. **Replace `DemoUserProvider`** with `AuthProvider`:
   - Logged-in user's `id` replaces the `currentDemoUserId` concept
   - `DemoUserSelector` component removed (or kept as admin-only feature)
   - `authorId` for notes uses the real JWT user ID

7. **Logout button:**
   - Add to the header row (where DemoUserSelector was) — shows user name + "Log out" link
   - Calls `auth.logout()`

8. **Theme preference persists per user:**
   - Store theme preference keyed by user (e.g., `theme:${userId}`) in localStorage
   - On login, load theme from the user-specific key

9. **Styling:**
   - Login/register pages use existing design tokens (`surface-card`, `content-primary`, `accent`, `edge`)
   - Centered card layout, consistent with app aesthetic

**Files:** New `AuthProvider.tsx`, `AuthGuard.tsx`, `login/page.tsx`, `register/page.tsx`. Modified: `layout.tsx`, `api.ts`, components that used `useDemoUser()`

---

### 8.4 — Hosting Checklist + Env Wiring

**Goal:** Document and configure deployment for Vercel (web) + Railway (API) + Neon (DB).

**Deliverable:** A `docs/DEPLOYMENT.md` checklist covering:

1. **Neon (Postgres):**
   - Create free-tier project
   - Copy `DATABASE_URL` (pooled connection string)

2. **Railway (API):**
   - Connect GitHub repo
   - Set root directory: `apps/api`
   - Set build command: `npm install && npx prisma generate --schema prisma/schema.prisma && npm run build`
   - Set start command: `node dist/main.js`
   - Env vars: `DATABASE_URL`, `JWT_SECRET` (generate secure random), `CORS_ORIGIN` (Vercel URL)
   - Run `npx prisma migrate deploy --schema apps/api/prisma/schema.prisma` and `npm run db:seed` once

3. **Vercel (Web):**
   - Connect GitHub repo
   - Root directory: repo root
   - Install command: `npm install --workspaces`
   - Build command: `npm run build:web`
   - Output directory: `apps/web/.next`
   - Env vars: `NEXT_PUBLIC_API_URL` (Railway URL)

4. **Code changes for production readiness:**
   - `apps/api/src/main.ts`: Use `process.env.PORT || 3001` (Railway sets `PORT`)

5. **Verification steps:**
   - `GET <railway-url>/health` returns 200
   - `POST <railway-url>/auth/register` creates user
   - Web app loads at Vercel URL and login flow works

**Files:** New `docs/DEPLOYMENT.md`, possibly minor changes to `main.ts` (PORT env var)

---

## Dependency Order

```
8.1 (schema + hashing)
 └─► 8.2 (auth API)
      └─► 8.3 (frontend auth UI)
           └─► 8.4 (hosting checklist)
```

Each task builds on the previous. 8.5 and 8.6 (from the plan requests) are independent UI tasks that can be done in parallel with Phase 8.

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Hashing library | `bcryptjs` (pure JS) | No native compilation — works on Railway, Vercel, and all CI without `node-gyp` |
| JWT library | `@nestjs/jwt` | Follows NestJS patterns, wraps `jsonwebtoken`, provides `JwtService` injectable |
| Token storage | `localStorage` | Demo-only. Cookie-based auth would be more secure but adds complexity (CSRF, HttpOnly) |
| Token expiry | 7 days | Long enough for demo use without refresh token complexity |
| Read route protection | `@Public()` — unprotected | Avoids needing to pass JWT through Next.js server components for initial page loads |
| Write route protection | JWT guard required | `POST /clients`, `PATCH /task-instances/:id`, notes endpoints, etc. |
| DemoUserProvider fate | Replaced by `AuthProvider` | JWT `sub` claim provides real user identity |
| `@nestjs/config` | Skip — use `process.env` directly | Consistent with existing pattern in `main.ts`. No need to add ConfigModule for 2 env vars |
| Password for seed users | `"password123"` | Documented in seed file and deployment guide for demo access |

## Verification

After all sub-tasks are complete:

```bash
npm run typecheck && npm run lint && npm run format:check
npm run db:seed && npx playwright test
```

E2E tests will need updates in 8.3 (login flow before test actions) or read routes stay public so existing tests continue to work.
