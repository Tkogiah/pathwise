# Task 7.3 Plan — Client Activity Feed (Notes Rail)

## Context

The NotesRail (Task 7.0) is currently a placeholder showing "No notes yet." Task 7.1 added the `TaskNote` model and task-scoped API. Task 7.2 added the TaskDrawer notes UI. Now we need to populate the rail with a **client-scoped** activity feed that aggregates notes across all tasks/roadmaps for a given client.

The main challenge is the "click to navigate" flow: clicking a note entry in the rail should switch to the correct roadmap, select the stage, and open the task drawer. This crosses component boundaries (NotesRail → ClientRoadmapShell → RoadmapView).

## Steps

### Step 1 — New API endpoint: `GET /clients/:id/notes`

Add a `findNotesByClient(clientId, since?)` method to `ClientsService` (or NotesService — but ClientsService already has the client-scoped queries).

**Query**: Join `TaskNote` → `TaskInstance` → `StageInstance` → `ClientProgramInstance` (filter by `clientId`) + `TemplateTask` (for task title) + `TemplateStage` (for stage title).

**Query param**: `?since=24h` or `?since=7d` — maps to a `createdAt >= Date.now() - duration` filter. Default: `7d`.
If `since` is provided but not `24h` or `7d`, return `400` with a clear message.

**Response shape**:

```ts
interface ClientNoteEntry {
  id: string;
  taskInstanceId: string; // used as taskId for navigation
  authorId: string;
  label: string; // NoteLabel enum value
  summary: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  // Breadcrumb context
  taskTitle: string;
  stageTitle: string;
  roadmapId: string; // ClientProgramInstance.id
  stageId: string; // StageInstance.id
}
```

**Route**: `GET /clients/:id/notes?since=24h|7d` — added to `ClientsController`.

### Step 2 — Add `ClientNoteEntry` type to frontend types

Add to `types.ts`:

```ts
export interface ClientNoteEntry {
  id: string;
  taskInstanceId: string;
  authorId: string;
  label: NoteLabel;
  summary: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  taskTitle: string;
  stageTitle: string;
  roadmapId: string;
  stageId: string;
}
```

### Step 3 — Populate NotesRail with activity feed

Replace the "No notes yet." placeholder with:

**Header row**: "Notes" title + time filter toggle (24h / 7d buttons) + collapse button

**Feed list**: Scrollable list of note entries, each showing:

- Label badge (reuse `NOTE_LABELS` map from TaskNotes)
- First line: summary (if present) or first ~80 chars of body
- Second line: breadcrumb — "Stage > Task" in muted text
- Author + relative time (reuse `timeAgo` or similar)
- Click handler → triggers navigation

**Ordering**: Ensure entries are ordered by `createdAt DESC` (API enforces this).

**Empty state**: "No notes in the last 24 hours." / "No notes in the last 7 days."

**Props added to NotesRail**:

- `clientId` (already accepted but unused — now used for the API call)
- `onNavigateToTask(roadmapId: string, stageId: string, taskId: string)` — callback to trigger navigation

### Step 4 — Wire "click to navigate" through ClientRoadmapShell

Add state to `ClientRoadmapShell`:

```ts
const [pendingNav, setPendingNav] = useState<{
  stageId: string;
  taskId: string;
} | null>(null);
```

When NotesRail calls `onNavigateToTask(roadmapId, stageId, taskId)`:

1. If `roadmapId !== selectedRoadmapId` → switch roadmap (fetch data), then set `pendingNav`
2. If same roadmap → set `pendingNav` directly

Pass `pendingNav` to `RoadmapView` and a `clearPendingNav` callback.

### Step 5 — Handle pending navigation in RoadmapView

Add optional props:

```ts
pendingNav?: { stageId: string; taskId: string } | null;
onPendingNavHandled?: () => void;
```

In a `useEffect`, when `pendingNav` changes and is non-null:

1. Set `selectedStageId` to `pendingNav.stageId`
2. Find the task in `currentRoadmap.stages` and set `selectedTask`
3. If task not found, clear pending state without opening drawer
4. Call `onPendingNavHandled()` to clear the pending state

### Step 6 — Extract shared label utilities

Both `TaskNotes.tsx` and `NotesRail.tsx` need `NOTE_LABELS`, `getLabelIcon()`, `timeAgo()`, and `getAuthorName()`. Extract these into a shared file `apps/web/src/lib/note-utils.ts` to avoid duplication.

## Files Changed

| File                                             | Change                                                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `apps/api/src/clients/clients.service.ts`        | Add `findNotesByClient(clientId, since)` method                                                |
| `apps/api/src/clients/clients.controller.ts`     | Add `GET :id/notes` route with `?since` query param                                            |
| `apps/web/src/lib/types.ts`                      | Add `ClientNoteEntry` interface                                                                |
| `apps/web/src/lib/note-utils.ts` (new)           | Extract `NOTE_LABELS`, `getLabelIcon()`, `timeAgo()`, `getAuthorName()`                        |
| `apps/web/src/components/NotesRail.tsx`          | Populate with activity feed, time filter, click-to-navigate                                    |
| `apps/web/src/components/TaskNotes.tsx`          | Import shared utils from `note-utils.ts` instead of local definitions                          |
| `apps/web/src/components/ClientRoadmapShell.tsx` | Add `pendingNav` state, pass `onNavigateToTask` to NotesRail, pass `pendingNav` to RoadmapView |
| `apps/web/src/components/RoadmapView.tsx`        | Accept `pendingNav` + `onPendingNavHandled` props, auto-navigate in useEffect                  |

## No Changes Needed

- **Schema / migrations**: No new models
- **TaskDrawer**: Unchanged
- **E2E tests**: No selector changes (notes rail is new UI, existing tests don't interact with it)

## Design Decisions

1. **API on clients controller** — Client-scoped notes is a client concern. Adding to the existing `ClientsController` avoids a new module. The Prisma query joins through the program instance chain.
2. **`since` query param** — Simple string (`24h` or `7d`) parsed server-side into a date filter. Avoids client-side filtering of large datasets.
3. **Pending navigation pattern** — Avoids lifting all of RoadmapView's state into ClientRoadmapShell. The shell only sets a "go here" intent; RoadmapView handles the actual state changes.
4. **Shared note-utils** — Prevents duplicating label maps and helpers between TaskNotes and NotesRail.
