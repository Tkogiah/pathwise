# Task 1.2 Plan — Read API for Roadmaps

## Endpoints

- GET `/clients` → list of clients (no pagination for MVP)
- GET `/clients/:id` → client detail + roadmap summaries
- GET `/clients/:id/roadmaps` → alias of `/clients/:id`
- GET `/roadmaps/:id` → full roadmap view model

## Response Shapes

GET /clients

- `{ id, firstName, lastName }[]`

GET /clients/:id

- `{ id, firstName, lastName, roadmaps: [{ roadmapId, templateName, startDate, isActive }] }`

GET /roadmaps/:id

- `{ id, templateName, clientName, startDate, isActive, stages: [...] }`
- Stage fields include derived status, progress, redTaskCount
- Task fields include derived color, isLocked, isOverdue

## Derived Status Strategy

- Map Prisma records → engine inputs (TaskInput/StageInput)
- Use engine functions: getStageStatus, getStageProgress, getRedTaskCount, getTaskColor, isTaskLocked, isTaskOverdue
- Pass **all tasks in roadmap** to isTaskLocked for cross‑stage dependency support

## DB Query Strategy

- Single Prisma query for `/roadmaps/:id` with nested includes
- `taskInstances` ordered by `templateTask.orderIndex`
- `stageInstances` ordered by `templateStage.orderIndex`

## Steps

1. Create ClientsModule (controller + service)
2. Implement GET `/clients` and `/clients/:id`
3. Add alias GET `/clients/:id/roadmaps`
4. Create RoadmapsModule (controller + service)
5. Implement GET `/roadmaps/:id` using nested Prisma include
6. Map DB results to view model + compute derived status via engine
7. Use NotFoundException for missing client/roadmap

## Notes

- Keep endpoints simple (no pagination yet)
- Include `roadmapId` in client detail response
