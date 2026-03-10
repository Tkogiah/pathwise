# Pathwise — Case Management Roadmap Engine (Demo)

A visual program‑state engine for case managers. Pathwise replaces wall‑of‑text logs with structured roadmaps, task status, appointments, and digest summaries to improve handoffs, onboarding, and daily clarity.

**Live demo:** https://pathwise-web.vercel.app  
**Demo credentials:** `maria@pathwise.dev` / `password123`

> **Important:** This demo is **not approved for PHI/PII or HMIS data**. It is a UX and workflow prototype.

---

## What It Does

- **Visual roadmaps** with stages and tasks (housing + benefits templates)
- **Task drawer** for status, due dates, blockers, and appointments
- **Notes + activity feed** scoped to tasks and client context
- **Daily digest** of upcoming appointments (pipeline + email delivery, gated)
- **User auth** (JWT) with public read endpoints and protected writes
- **Client overview** gauges for progress and time in program

---

## Why This Exists

Most case management tools bury context in long notes. Pathwise makes state visible at a glance: what’s done, what’s blocked, and what needs attention now — without asking staff to read a wall of text.

---

## Tech Stack (Current)

- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS
  - Fast iteration, server‑rendered UX, componentized UI
- **Backend:** NestJS (TypeScript)
  - Strong module boundaries, DI, clean controller/service separation
- **Database:** PostgreSQL (Neon)
  - Durable, relational model for program/state tracking
- **ORM:** Prisma
  - Type‑safe queries, migrations, clear schema ownership
- **Validation:** Zod
  - Shared DTO validation and safe request handling
- **Testing:** Vitest + Playwright
  - Engine logic tests + E2E smoke coverage
- **Hosting:** Vercel (web) + Railway (API) + Neon (DB)

---

## Architecture Highlights

- **Engine rules are pure functions** (task/stage status computed, not stored)
- **Derived state** (progress, red/behind flags, days in program, upcoming appointments) is calculated server‑side
- **Notes + digest pipeline** are additive and non‑destructive
- **Read endpoints are public**; writes are JWT‑protected

---

## Case Study: Moving Workflow Logic from the UI into the Engine

**Problem**  
Early iterations handled workflow logic too close to the UI layer. As views expanded (manager, worker, trainee), it became harder to reason about behavior and test changes without UI coupling.

**Decision**  
Refactor business rules into a dedicated engine of pure functions, and compute derived state in the API. The UI renders only what the engine produces.

**Outcome**

- UI components became simpler and more presentation‑focused
- Core workflow behavior became testable in isolation (Vitest)
- Derived state stayed consistent across views

This refactor created a reliable foundation for future reporting, digests, and AI‑assisted ingestion.

---

## Testing / CI

Standard suite:

```bash
npm run typecheck
npm run lint
npm run format
npm run test:all
```

Targeted:

```bash
npm run test
npx vitest run apps/api/src/digest/digest.service.spec.ts
```

Data setup (only when seed changes are involved):

```bash
npm run db:seed
```

---

## Production‑Grade Path (If a Nonprofit Adopts)

If this were adopted beyond demo use, the core stack can remain — but key infrastructure would harden:

**Would stay:**

- Next.js + NestJS + Postgres
- Prisma + Zod
- Current data model (client → program → stage → task)

**Would add/upgrade:**

- **Redis cache** for read‑heavy endpoints (clients list, roadmap view)
- **Queue + worker** (BullMQ or similar) for digest emails, exports, audit jobs
- **Structured logging** with request IDs and user IDs
- **Rate limiting** on auth and expensive routes
- **Observability** (Sentry, health/readiness checks)
- **Role/permission model** (case manager, supervisor, admin)
- **Multi‑org tenancy** (orgId scoped data access)
- **File storage** (S3 + encrypted object storage)
- **Audit trails** for sensitive changes

---

## MVP Scope (What’s Done)

- Roadmap engine with stages and tasks
- Appointment scheduling on tasks
- Task‑scoped notes + client activity feed
- Client overview gauges
- Digest pipeline + email delivery (gated by env vars)
- Auth + deployment docs

See `docs/MVP_CHECKLIST.md` for the full completion checklist.

---

## Next Phase (Business‑Ready / HMIS‑Adjacent)

### Legal / Compliance

- Define data classification (PHI/PII)
- Implement audit logging + access history
- Add retention policies + deletion workflows

### HMIS / Credentialing

- Obtain HMIS vendor access + API credentials
- Implement strict data mapping (HMIS ↔ Pathwise)
- Build opt‑in integration (no PHI in Pathwise unless approved)

### Document Handling

- Secure document upload (S3 + encryption at rest)
- Document metadata + access controls
- Optional OCR and document tagging

### Operational Maturity

- Redis cache + background workers
- Backups + restore playbook
- Monitoring + alerting
- Incident playbooks for auth/db failures

---

## AI Ingestion (Planned)

Pathwise is expanding into a **Slack‑first ingestion workflow** so case managers don’t need to change their daily habits. The AI system extracts structured facts from Slack threads, captures evidence links, and feeds Pathwise snapshots for management visibility and reporting.

**Current direction**

- Manual trigger in Slack (emoji or `/case extract`) with human approval
- Evidence‑per‑field and confidence scoring
- No PHI/PII storage; strict redaction rules
- Exports for reporting (CSV/JSON)

**Spec**

- `docs/AI_INGESTION_SPEC.md`

---

## Development Notes

See:

- `docs/DEPLOYMENT.md`
- `docs/LOCAL_ENV.md`
- `docs/CI_CHECKLIST.md`
- `docs/CONTEXT.md`

---

## License

Currently unlicensed / demo use only.
