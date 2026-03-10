# Task 1.7 Plan — Demo User Context

## Scope

- Add demo user selector
- Persist selected user in localStorage
- Keep server/client boundaries correct

## Steps

1. Add DemoUser type to `src/lib/types.ts`
2. Create `src/lib/demo-users.ts` with hardcoded demo users
3. Create `DemoUserSelector` (presentational)
4. Manage currentDemoUserId state in `RoadmapView` (client)
   - Read from localStorage on mount
   - Write to localStorage on change
5. Render selector inside RoadmapView
6. Keep `/clients/[id]/page.tsx` server-only (fetch + pass props)

## Files

- `apps/web/src/lib/types.ts`
- `apps/web/src/lib/demo-users.ts`
- `apps/web/src/components/DemoUserSelector.tsx`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/app/clients/[id]/page.tsx`
