# Task 6.4 Plan — Client List Gauges

## Context

- Client list (`/clients`) currently fetches only `{ id, firstName, lastName }` — no roadmap or progress data.
- `ProgressArc` component already exists and accepts `{ completed, total, size, strokeWidth, color }`.
- Progress logic lives in `@pathwise/engine` (`getStageProgress`): counts required tasks where `status === COMPLETE || isNa`.
- `ClientProgramInstance` has `startDate`, `programLengthDays`, `isActive`, and a `template` relation with `name`.
- The requirement asks for per-active-roadmap gauges: days in program + task progress, labeled by program name. Max 4–5 per row.

## Approach

Compute aggregated progress on the API side (avoid shipping all tasks to the client list page). Return a lightweight summary per active roadmap alongside the client list data.

## Steps

### Step 1 — API: Enhance `findAll()` response

Update `ClientsService.findAll()` to include active program instances with aggregated progress.

**Include chain**:

```
programInstances (where: { isActive: true })
  → template (select: { name })
  → stageInstances
    → taskInstances
      → templateTask (select: { isRequired })
```

**Compute per instance**:

- `templateName`: from `template.name`
- `startDate`: from instance
- `programLengthDays`: from instance
- `daysInProgram`: `Math.floor((Date.now() - startDate) / 86400000)`
- `progress: { completed, total }`: iterate all task instances across all stages, count required tasks where `status === COMPLETE || isNa === true`

**Return shape** (per client):

```ts
{
  id: string;
  firstName: string;
  lastName: string;
  roadmaps: {
    templateName: string;
    daysInProgram: number;
    programLengthDays: number | null;
    progress: {
      completed: number;
      total: number;
    }
  }
  [];
}
```

### Step 2 — UI: Update `ClientSummary` interface in `/clients/page.tsx`

Add the `roadmaps` array to the interface to match the new API response.

### Step 3 — UI: Create `ClientGauges` component

New file: `apps/web/src/components/ClientGauges.tsx` (server component — no interactivity needed).

**Props**: `roadmaps` array from the enhanced `ClientSummary`.

**Renders per roadmap** (max 4–5, slice if needed):

- Short label (map template names to compact labels, e.g., "Housing Program" → "Housing", "Benefits Access" → "Benefits")
- A `ProgressArc` (small: `size={32}`, `strokeWidth={3}`) showing `completed/total`
- A text line: "Day N / M" (daysInProgram / programLengthDays), or "Day N" if no length set.

**Layout**: horizontal flex with small gaps, fitting naturally in each client row.

### Step 4 — UI: Render `ClientGauges` in client list rows

In `apps/web/src/app/clients/page.tsx`:

- Import `ClientGauges`.
- Add it inside each `<li>` row between the client name and the chevron.
- Only render if `client.roadmaps.length > 0`.

### Step 5 — Verify

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm run test` (54 unit tests)

## Files Changed / Created

| File                                       | Change                                        |
| ------------------------------------------ | --------------------------------------------- |
| `apps/api/src/clients/clients.service.ts`  | Enhance `findAll()` with roadmap aggregation  |
| `apps/web/src/app/clients/page.tsx`        | Update `ClientSummary`, render `ClientGauges` |
| `apps/web/src/components/ClientGauges.tsx` | **New** — compact gauge row                   |

## No Changes Needed

- **Schema**: no new fields
- **Engine**: progress logic replicated inline in the service (simple count, avoids importing engine into clients module)
- **ProgressArc**: already supports small sizes
- **E2E tests**: client list structure unchanged (links still work)
