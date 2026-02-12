# Task 0.6 Plan — Seed Data

## Scope

- Seed 1 org, 2–3 users, 3 clients, 1 housing template, 2–3 program instances
- Each instance fully clones stages and tasks
- Include overdue, blocked, N/A, locked, green, red, yellow, gray states
- Provide `npm run db:seed`

## Seed Entities

### Users (3)

- Maria Santos — maria@pathwise.dev
- James Chen — james@pathwise.dev
- Aisha Johnson — aisha@pathwise.dev

### Clients (3)

- David Thompson (multi‑roadmap demo)
- Sarah Mitchell (N/A demo)
- Marcus Rivera (early‑stage demo)

### Template (1) — Housing

5 stages, 17 tasks total:

1. Intake & Assessment (4 tasks)
2. Document Collection (4 tasks)
3. Housing Search (3 tasks)
4. Lease & Move‑In (3 tasks)
5. Stabilization (3 tasks)

Dependencies (within stage):

- Document Collection: “Background check” depends on “Income verification”
- Housing Search: “Landlord contact” depends on “Application submission”

## Instance Seeding

- Clone template → stage_instances → task_instances
- Activate stages per scenario

### State Diversity

David Thompson (2 program instances)

- Instance 1 (advanced):
  - Stage 1 GREEN (all complete)
  - Stage 2 RED (one BLOCKED with blocker_type EXTERNAL, one locked)
  - Stage 3 RED (overdue task)
  - Stage 4–5 GRAY (not activated)
- Instance 2 (early): mostly NOT_STARTED

Sarah Mitchell (1 instance)

- Stage 1 GREEN
- Stage 2 YELLOW (one N/A with naReason, one IN_PROGRESS)
- Stage 3–5 GRAY

Marcus Rivera (1 instance)

- Stage 1 YELLOW (one IN_PROGRESS)
- Stage 2–5 GRAY

## Implementation Steps

1. Create `apps/api/prisma/seed.ts`
   - Uses PrismaClient directly
   - Wrap in transaction
   - Clears data in reverse FK order
2. Insert users, clients, template, stages, tasks
3. Clone into instances and apply state diversity
4. Configure seed commands
   - `apps/api/package.json`: `prisma.seed = "npx tsx prisma/seed.ts"`
   - root `package.json`: `db:seed = "npm --workspace @pathwise/api run seed"`
5. Verify (requires Postgres)
   - `npm run db:seed`
   - Check counts and states in Prisma Studio

## Notes

- Overdue task uses relative date (e.g., today - 7 days)
- Self‑relation dependencies inserted with a second pass
