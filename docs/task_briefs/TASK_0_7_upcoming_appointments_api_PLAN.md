# Task 0.7 Plan — Upcoming Appointments in API

## Goal

Move upcoming appointments derivation from UI to API so derived state is centralized and consistent.

## Changes

1. **Types** — `apps/web/src/lib/types.ts`
   - Add `AppointmentVM`:
     ```ts
     export interface AppointmentVM {
       stageId: string;
       taskId: string;
       appointmentAt: string; // ISO
     }
     ```
   - Extend `RoadmapVM`:
     ```ts
     upcomingAppointments: AppointmentVM[];
     ```

2. **API** — `apps/api/src/roadmaps/roadmaps.service.ts`
   - After building `stages`, compute:
     ```ts
     const upcomingAppointments = instance.stageInstances
       .flatMap((si) =>
         si.taskInstances
           .filter((ti) => ti.appointmentAt !== null && ti.appointmentAt > now)
           .map((ti) => ({
             stageId: si.id,
             taskId: ti.id,
             appointmentAt: ti.appointmentAt!.toISOString(),
           })),
       )
       .sort(
         (a, b) =>
           new Date(a.appointmentAt).getTime() -
           new Date(b.appointmentAt).getTime(),
       );
     ```
   - Add `upcomingAppointments` to the returned view model.

3. **RoadmapView** — `apps/web/src/components/RoadmapView.tsx`
   - Remove inline filter/sort logic.
   - Use `currentRoadmap.upcomingAppointments`.

4. **StageNode** — `apps/web/src/components/StageNode.tsx`
   - Remove inline appointment count logic.
   - Add `appointmentCount` prop from parent:
     ```ts
     upcomingAppointments.filter((a) => a.stageId === stage.id).length;
     ```

5. **Integration Test** — `apps/api/test/integrations/roadmaps.spec.ts`
   - Create task instances with `appointmentAt` tomorrow and yesterday.
   - Call `findOne`/service and assert:
     - only future appointment included
     - sorted ascending by date

## Deployment Notes

- Redeploy Railway first (API), then Vercel (web).
- Watch paths should include `apps/api/**` and `packages/**`.

## Testing

- `npm run typecheck`
- `npm run lint`
- `npm run test:api`

## Success Criteria

- UI no longer derives upcoming appointments.
- API returns `upcomingAppointments` with ISO timestamps.
- Stage appointment count is derived from API data, not UI logic.
