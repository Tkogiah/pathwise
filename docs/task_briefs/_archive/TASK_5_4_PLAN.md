# Task 5.4 Plan — Client Archiving

## Background

Clients who have completed their program need to be archived — removed from the active list but still viewable in a separate archived view. Unarchiving restores them to the active list.

## Step 1: Add isArchived to Schema + Migrate

- Add `isArchived Boolean @default(false)` to the `Client` model in `schema.prisma`
- Create migration via `npx prisma migrate dev`

## Step 2: Update Client API — Filtering + Archive/Unarchive Endpoints

**clients.service.ts**

- `findAll()` → filter `where: { isArchived: false }`
- `findAllArchived()` → `where: { isArchived: true }`
- `archive(id: string)` → set `isArchived: true`
- `unarchive(id: string)` → set `isArchived: false`

**clients.controller.ts**

- `GET /clients` → active only
- `GET /clients/archived` → archived
- `PATCH /clients/:id/archive` → archive
- `PATCH /clients/:id/unarchive` → unarchive

**Route ordering:** declare `/clients/archived` before `/clients/:id`.

## Step 3: Ensure isArchived is returned on GET /clients/:id

- Include `isArchived` in the client detail response (service + DTO/type).

## Step 4: Update Client List Page

`apps/web/src/app/clients/page.tsx`

- Add a link/tab to “Archived Clients”.
- Active list remains unchanged (API already filters).

## Step 5: Create Archived Clients Page

`apps/web/src/app/clients/archived/page.tsx`

- Fetch `GET /clients/archived`.
- Render same list layout as active page.
- Each row shows **Unarchive** button (no navigation link).
- After unarchive → refresh list.

## Step 6: Add Archive Action to Client Detail Page

`apps/web/src/app/clients/[id]/page.tsx`

- Add **Archive** button next to client name.
- On click: `PATCH /clients/:id/archive`, then redirect to `/clients`.
- When archived: show “Archived” badge and **Unarchive** button instead.

## Step 7: Read-Only Mode for Archived Clients

- Disable **TaskDrawer** status select when `isArchived`.
- Disable **HandoffSummary** edits when `isArchived`.
- Pass `isArchived` down through Client detail → RoadmapView → TaskDrawer/HandoffSummary.

## Step 8: Seed (Optional)

Optionally seed one archived client for demo/testing. Not required.

## Step 9: Verify

Run:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

## Files to Create

- `apps/web/src/app/clients/archived/page.tsx`
- `apps/web/src/components/ArchiveButton.tsx`
- `apps/web/src/components/UnarchiveButton.tsx`

## Files to Modify

- `apps/api/prisma/schema.prisma` — add `isArchived`
- `apps/api/src/clients/clients.service.ts` — filtering + archive/unarchive methods
- `apps/api/src/clients/clients.controller.ts` — new endpoints
- `apps/web/src/app/clients/page.tsx` — link to archived view
- `apps/web/src/app/clients/[id]/page.tsx` — archive/unarchive UI + badge
- `apps/web/src/components/ClientRoadmapShell.tsx` — pass `isArchived`
- `apps/web/src/components/RoadmapView.tsx` — pass `isArchived`
- `apps/web/src/components/TaskDrawer.tsx` — disable status select
- `apps/web/src/components/HandoffSummary.tsx` — disable edits
- `apps/web/src/lib/types.ts` — add `isArchived` to client type

## Risks / Edge Cases

- Route collision: `/clients/archived` vs `/clients/:id` — must order archived route first.
- Archived clients should still render in read‑only mode.
- E2E tests use active clients only; no changes needed unless a test client is archived.
