# Derived State Audit — Task 0.4

## Scope

Scan UI components and API service layer for business-logic derivations that belong in the engine (`packages/engine`) or API layer rather than in the frontend.

---

## Derivations That Should Move

### 1. Upcoming Appointments Filter + Sort

**Location:** `apps/web/src/components/RoadmapView.tsx:99–117`

```ts
const upcomingAppointments = currentRoadmap.stages
  .flatMap((s) => s.tasks)
  .filter((t) => t.appointmentAt && new Date(t.appointmentAt).getTime() > Date.now())
  .sort((a, b) => new Date(a.appointmentAt!).getTime() - new Date(b.appointmentAt!).getTime());
```

**Also duplicated in:** `apps/web/src/components/StageNode.tsx:54–57` (per-stage count of upcoming appointments using the same predicate).

**Problem:** Cross-stage appointment aggregation is a business derivation that requires `now` as an input and returns structured data. The UI must not re-derive this each render across all stages.

**Proposed fix:** Task 0.7 — add `upcomingAppointments: AppointmentVM[]` to `RoadmapVM` in the API. `StageNode` appointment badge count follows automatically from filtering that list by stage.

---

### 2. Program Day Calculation

**Location:** `apps/web/src/components/RoadmapView.tsx:189–193`

```ts
const programDay = roadmap.startDate
  ? Math.floor((Date.now() - new Date(roadmap.startDate).getTime()) / 86_400_000) + 1
  : null;
```

**Also exists in:** `apps/api/src/clients/clients.service.ts:51–53` (same formula, called `daysInProgram`).

**Problem:** Duplicate formula across layers. The UI re-derives a value the API already knows how to compute.

**Proposed fix:** Task 0.8 — add `daysInProgram: number | null` to `RoadmapVM` in the API, remove the inline calculation from `RoadmapView.tsx`.

---

## Derivations Acceptable in UI

| Location | Derivation | Reason acceptable |
|---|---|---|
| `RoadmapView.tsx` | `stageArcColor` mapping (status → CSS color) | Pure presentation mapping, no business logic |
| `RoadmapView.tsx` | `filteredTasks` (by search/filter input) | Interaction state, not business state |
| `RoadmapView.tsx` | Date formatting (`toLocaleDateString`) | Display formatting only |
| `ClientGauges.tsx` | `shortLabel` for note labels | Display-only label truncation |

---

## Proposed Follow-Up Tasks

### Task 0.7 — Move `upcomingAppointments` to API

- Add `AppointmentVM` type (stageId, taskId, appointmentAt)
- Compute sorted upcoming appointments list in `roadmaps.service.ts` using `now`
- Add `upcomingAppointments: AppointmentVM[]` to `RoadmapVM`
- Update `apps/web/src/lib/types.ts` to include the field
- Remove inline filter+sort from `RoadmapView.tsx`
- Remove per-stage appointment count from `StageNode.tsx`, derive from `upcomingAppointments` filtered by stage

### Task 0.8 — Add `daysInProgram` to `RoadmapVM`

- Add `daysInProgram(startDate: Date, now: Date): number` to `packages/engine`
- Call it in `roadmaps.service.ts`, add `daysInProgram: number | null` to `RoadmapVM`
- Update `apps/web/src/lib/types.ts`
- Remove inline calculation from `RoadmapView.tsx`

### Task 0.9 — `getProgramSnapshot` Engine Function

- Signature: `getProgramSnapshot(stages: StageInput[], now: Date): ProgramSnapshot`
- Composes existing engine derivations: `getStageStatus`, `isStageBehind`, `getRedTaskCount`, `getRoadmapProgress`
- Returns a single object summarising what those functions already compute individually
- No new fields or product concepts — snapshot shape is determined by what 0.7 and 0.8 produce
- Blocked by: 0.7, 0.8
