# Task 1.3 Plan — Web Shell + Client Page

## Routes

- `/` → redirect to `/clients`
- `/clients` → stub list page (Task 1.3b will implement)
- `/clients/[id]` → client detail page

## Layout

- Root layout with header + main
- Header label: "Program Roadmap" (neutral, not a product name)
- Mobile-first, single column, max-width container

## Typography

- Use `next/font/google` with **IBM Plex Sans** (non-default font)

## API Integration

- Server-side `fetch` in App Router
- `src/lib/api.ts` helper with `NEXT_PUBLIC_API_URL` (default http://localhost:3001)

## Steps

1. Update `layout.tsx` with header + font
2. Add `src/lib/api.ts` helper
3. Redirect `/` to `/clients`
4. Stub `/clients` page
5. Create `/clients/[id]` page fetching client detail
6. Add `.env.local.example` with `NEXT_PUBLIC_API_URL`

## Files

- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/clients/page.tsx`
- `apps/web/src/app/clients/[id]/page.tsx`
- `apps/web/src/lib/api.ts`
- `apps/web/.env.local.example`
