# Task 8.3 Plan — Auth UI + Client Integration (Completed)

## Goal

Replace demo-user selection with real auth context, add login/register UI, and attach JWTs for writes.

## Changes Implemented

- Added `AuthProvider` and `AuthGuard`
- Added `/login` and `/register` pages
- Updated header controls to show user + logout
- Theme preference keyed per user ID
- Updated roadmap/notes components to use current user ID
- `apiFetch` attaches `Authorization` header for write requests

## Files Touched

- `apps/web/src/components/AuthProvider.tsx`
- `apps/web/src/components/AuthGuard.tsx`
- `apps/web/src/app/login/page.tsx`
- `apps/web/src/app/register/page.tsx`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/HeaderControls.tsx`
- `apps/web/src/components/ThemeToggle.tsx`
- `apps/web/src/components/ClientRoadmapShell.tsx`
- `apps/web/src/components/RoadmapView.tsx`
- `apps/web/src/components/TaskDrawer.tsx`
- `apps/web/src/components/TaskNotes.tsx`
- `apps/web/src/components/NotesRail.tsx`
- `apps/web/src/lib/api.ts`
- `apps/web/src/lib/note-utils.ts`

## Verification

- `npm run typecheck`
- `npm run lint`
- `npx playwright test`
