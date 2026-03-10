# Task 0.6 Plan — Template Due Date Rules (dueOffsetDays)

## Goal

Auto-assign task due dates from template metadata (`dueOffsetDays`) while keeping user edits allowed for now.

## Scope

- Add `dueOffsetDays` to `TemplateTask`.
- Compute `TaskInstance.dueDate` on roadmap creation using `startDate + dueOffsetDays`.
- Keep manual edits allowed (no permission gating yet).
- Seed offsets for key tasks to make the feature visible.

## Changes

1. **Schema** — `apps/api/prisma/schema.prisma`
   - Add `dueOffsetDays Int?` to `TemplateTask`.
   - Migration required.

2. **Engine** — `packages/engine/src/task.ts`
   - Add pure helper:
     ```ts
     export function computeDueDate(
       startDate: Date,
       dueOffsetDays: number,
     ): Date;
     ```
   - Export from `packages/engine/src/index.ts`.

3. **API** — `apps/api/src/clients/clients.service.ts` (`activateRoadmap`)
   - When creating task instances, set `dueDate` if `dueOffsetDays` is not null and `startDate` is present:
     ```ts
     dueDate: task.dueOffsetDays !== null && instance.startDate
       ? computeDueDate(instance.startDate, task.dueOffsetDays)
       : null;
     ```

4. **Seed** — `apps/api/prisma/seed.ts`
   - Add `dueOffsetDays` for key template tasks (e.g., 7, 14, 30, 60) for meaningful visibility.
   - Add a short comment clarifying: “offset = days from program start date.”

5. **Unit Test** — `packages/engine/src/__tests__/task.test.ts`
   - Verify offset → correct date (including month boundary).
   - Verify `dueOffsetDays = 0` returns same day.

6. **Integration Test** — `apps/api/test/*`
   - Create a roadmap from a template with offsets.
   - Verify task `dueDate` equals `startDate + dueOffsetDays`.
   - Verify `dueOffsetDays: null` results in `dueDate: null`.

## Migration Command

```
npm --workspace @pathwise/api run prisma migrate dev --name add-template-task-due-offset-days
```

## Notes

- No UI changes required; existing UI already displays due dates.
- No new permissions in this task.

## Testing

- `npm run typecheck`
- `npm run test`
- `npm run test:api`
