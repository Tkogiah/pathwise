# Task 3.4 Plan — UX Refinements (Revised)

## Revised Plan Steps (App Router aligned)

1. Implement Loading State (`loading.tsx`)

- Create `RoadmapSkeleton.tsx` (apps/web/src/components/): a skeleton layout that mirrors RoadmapView (user selector, roadmap bar, stage header, task rows). Use pulsing gray blocks.
- Create `loading.tsx` (apps/web/src/app/clients/[id]/loading.tsx): render `<RoadmapSkeleton />` so Next.js shows it automatically during server data fetches.

2. Implement API Error State (`error.tsx`)

- Create `error.tsx` (apps/web/src/app/clients/[id]/error.tsx), marked `use client`.
- Display a friendly error message and a “Try Again” button calling `reset()`.

3. Implement “No Roadmaps” Empty State (Server-side in `page.tsx`)

- (Optional) Create `EmptyState.tsx` (apps/web/src/components/) to keep `page.tsx` clean and reuse later.
- In `apps/web/src/app/clients/[id]/page.tsx`, after fetching client data, check `roadmaps.length === 0`.
- If empty, return the empty state UI early. Otherwise render the roadmap view as normal.

4. Skip micro-clarity refinements

- No extra hover/focus pass; Task 3.3 already covered accessibility/focus states.

## Resulting File Changes

- Create: `apps/web/src/components/RoadmapSkeleton.tsx`
- Create: `apps/web/src/app/clients/[id]/loading.tsx`
- Create: `apps/web/src/app/clients/[id]/error.tsx`
- (Optional) Create: `apps/web/src/components/EmptyState.tsx`
- Modify: `apps/web/src/app/clients/[id]/page.tsx` (empty state logic)

## Notes

- Use `loading.tsx` rather than Suspense in `page.tsx` to ensure server fetches show skeletons reliably in App Router.
- Error boundary should be route-level `error.tsx`.
- If `EmptyState.tsx` is not used, inline markup is acceptable.
