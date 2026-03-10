# Task 0.5 Plan — Prisma Setup + Schema (Updated)

## Scope

- Add Prisma to apps/api
- Define schema for all 8 MVP tables
- Prisma client generates successfully
- Migration creates all tables
- `handoffSummary`, `isNa`, `naReason` included

## Key Decisions

- Do NOT run `prisma init` (avoid creating `.env` in repo)
- BlockerType enum: INTERNAL, EXTERNAL, UNKNOWN
- Keep Prisma default table/field names (no `@@map/@map` for now)

## Steps

1. Install Prisma
   - Add `prisma` (dev) and `@prisma/client` (runtime) in `apps/api`
2. Create schema manually
   - `apps/api/prisma/schema.prisma`
   - Datasource uses `DATABASE_URL`
3. Define enums
   - TaskStatus: NOT_STARTED, IN_PROGRESS, BLOCKED, COMPLETE
   - BlockerType: INTERNAL, EXTERNAL, UNKNOWN
   - UserRole: CASE_MANAGER
4. Define template tables
   - User, Client, ProgramTemplate, TemplateStage, TemplateTask
   - Include createdAt/updatedAt where relevant
   - TemplateTask has nullable self-relation dependsOnTaskId
5. Define instance tables
   - ClientProgramInstance, StageInstance, TaskInstance
   - Include `handoffSummary`, `isNa`, `naReason`
6. Activate Prisma module
   - Uncomment PrismaService and PrismaModule
   - Import PrismaModule in AppModule
7. Generate client + migration
   - `npx prisma generate`
   - `npx prisma migrate dev --name init` (requires Postgres running)
8. Verify
   - `npm run build` passes
   - `npm run lint` passes
   - (Optional) `npx prisma studio` to inspect tables

## Notes

- Task 0.6 will handle seed data.
- Docker/Postgres required for migrations; can be run when available.
