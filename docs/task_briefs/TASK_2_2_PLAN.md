# Task 2.2 Plan — Handoff Summary

## Endpoint

PATCH `/stage-instances/:id/handoff`

### Request body

- `handoffSummary: string`

### Responses

- 200 updated stage instance
- 400 validation error
- 404 not found

## Validation (Zod)

- Required string (trimmed)
- Max 2000 chars
- Empty string allowed (clears summary)

## UI

- Inline in stage header card (RoadmapView)
- Read-only view + Edit button
- Edit mode: textarea + Save/Cancel
- Save → PATCH → refreshRoadmap

## Tweaks

- Disable Save while request in flight
- Add aria-labels for textarea/buttons

## Files

- apps/api/src/stage-instances/dto/update-handoff.dto.ts
- apps/api/src/stage-instances/stage-instances.service.ts
- apps/api/src/stage-instances/stage-instances.controller.ts
- apps/api/src/stage-instances/stage-instances.module.ts
- apps/api/src/app.module.ts
- apps/web/src/components/HandoffSummary.tsx
- apps/web/src/components/RoadmapView.tsx
