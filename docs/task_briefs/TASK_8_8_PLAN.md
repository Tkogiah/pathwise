# Task 8.8 Plan — Digest UI Surface

## Goal

Display the current user’s daily appointment digest in a compact panel within the Notes rail.

## Plan

1. **API endpoint**
   - Add `GET /digest/me?date=YYYY-MM-DD` (JWT‑protected)
   - Use `req.user.sub` for user id
   - Optionally accept `date` query param (UTC `YYYY-MM-DD`)

2. **DigestCard component**
   - New client component: `apps/web/src/components/DigestCard.tsx`
   - Fetch digest client‑side with auth headers
   - Use UTC dateKey (`new Date().toISOString().slice(0,10)`)
   - Render lines via `summary.split('\n')`
   - Show subtle “No appointments today” empty state if no digest
   - Include “Last updated” timestamp (from `createdAt`)

3. **NotesRail integration**
   - Render `<DigestCard />` above the notes list
   - Only show when rail is expanded

## Files

- `apps/api/src/digest/digest.controller.ts`
- `apps/api/src/digest/digest.service.ts`
- `apps/web/src/components/DigestCard.tsx` (new)
- `apps/web/src/components/NotesRail.tsx`

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- Manual: call `/digest/generate`, confirm DigestCard shows summary
