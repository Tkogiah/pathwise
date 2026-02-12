# Task 1.3b Plan — Client List Page

## Scope

- Replace stub client list with real data
- Provide navigation to client detail

## API Response

GET `/clients` → `{ id, firstName, lastName }[]`

## Steps

1. Update `apps/web/src/app/clients/page.tsx` to fetch from API using `apiFetch`
2. Render list rows as full-width links to `/clients/[id]`
3. Use clean card style with dividers and a subtle chevron for affordance
4. Empty state when no clients
5. Verify build/lint/format

## Notes

- Mobile-first touch targets
- Future: add loading/error states if page becomes client-side or uses suspense
