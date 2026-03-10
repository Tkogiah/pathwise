# Task 7.2 Plan — Task Drawer Notes UI

## Context

Task 7.1 added the `TaskNote` model and API endpoints. The TaskDrawer is already ~420 lines with status, due date, appointment, and blocker sections. Notes UI should be extracted into a dedicated component to keep the drawer manageable.

The drawer currently receives `task`, `onClose`, `onTaskUpdated`, and `readOnly`. It does NOT receive `currentDemoUserId` — this needs to be threaded through from `RoadmapView`.

## Approach

Create a `TaskNotes` component rendered at the bottom of the TaskDrawer. Collapsed by default (shows note count), expands to show the list + composer.

## Steps

### Step 1 — Create `TaskNotes.tsx` component

**Props:**

- `taskId: string`
- `currentDemoUserId: string | null`
- `readOnly: boolean`

**State:**

- `notes: TaskNoteVM[]` — fetched from `GET /task-instances/:taskId/notes`
- `expanded: boolean` — default `false` (collapsed)
- `composerOpen: boolean` — default `false`
- `editingNoteId: string | null` — which note is being edited

**Layout (collapsed):**

```
[Notes (3)]  ← clickable header, toggles expanded
```

**Layout (expanded):**

```
[Notes (3)]                    [+ Add Note]
─────────────────────────────────────────
[Composer form — if composerOpen]
─────────────────────────────────────────
[Note card 1]
[Note card 2]
[Note card 3]
```

**Note card:**

- Label badge (small colored pill)
- Author name (map `authorId` → demo user name via `DEMO_USERS`) + relative time (e.g., "2 days ago")
- Summary line (if present, slightly bolder)
- Body text (text-sm, muted)
- Edit button — only shown if `note.authorId === currentDemoUserId` and not `readOnly`

**Composer form:**

- Label `<select>` (all NoteLabel values, default OTHER)
- Body `<textarea>` (required, placeholder: "Write a note...")
- Summary `<input>` — hidden by default, shown via "Add summary" link or automatically when body length > 200 chars
- Save / Cancel buttons
- On save: `POST /task-instances/:taskId/notes` with `{ authorId: currentDemoUserId, label, body, summary }`
- After save: prepend new note to list, close composer
- Non‑PHI reminder under composer: “Avoid entering PHI/SSN/ID numbers.”
- If `currentDemoUserId` is null: disable add/edit UI and show helper (“Select a demo user to add notes.”)

**Edit mode (inline per note):**

- Replaces the note card with an edit form (same fields as composer, pre-filled)
- Save: `PATCH /notes/:id` with `{ authorId: currentDemoUserId, label, body, summary }`
- Cancel: restore original note display

**Label display map:**

```ts
const NOTE_LABELS: Record<NoteLabel, string> = {
  APPOINTMENT: 'Appointment',
  DOCUMENTS: 'Documents',
  HOUSING_SEARCH: 'Housing Search',
  VOUCHER: 'Voucher',
  BENEFITS: 'Benefits',
  OUTREACH: 'Outreach',
  ID_VERIFICATION: 'ID Verification',
  BARRIER: 'Barrier',
  TASK_UPDATE: 'Task Update',
  OTHER: 'Other',
};
```

**Label icon hook (for Phase 7.5):**
Add a placeholder `NOTE_ICONS` map or `getLabelIcon()` helper so icons can be added later without refactor.

### Step 2 — Thread `currentDemoUserId` into TaskDrawer

Currently: `RoadmapView` → `TaskDrawer` (no demo user prop).

Add `currentDemoUserId` prop to `TaskDrawer`. `RoadmapView` already has it from its own props — just pass it through.

### Step 3 — Render `TaskNotes` inside TaskDrawer

Add `<TaskNotes>` at the bottom of the drawer's scrollable content area, after the blocker section. Wrapped in a `border-t border-edge pt-4` divider matching existing sections.

### Step 4 — Add `apiFetch` helper for notes list

`apiFetch` already exists. For creating notes, `apiPost` exists. For editing, `apiPatch` exists. No new API helpers needed — just use the existing ones with the notes endpoints.

### Step 5 — Relative time helper

Add a small `timeAgo(dateString)` helper inside `TaskNotes.tsx` (no need for a library):

- < 1 min: "just now"
- < 60 min: "Xm ago"
- < 24 hr: "Xh ago"
- < 7 days: "Xd ago"
- else: formatted date

## Files Changed

| File                                          | Change                                                          |
| --------------------------------------------- | --------------------------------------------------------------- |
| `apps/web/src/components/TaskNotes.tsx` (new) | Notes list, composer, edit mode, label map, timeAgo helper      |
| `apps/web/src/components/TaskDrawer.tsx`      | Accept `currentDemoUserId` prop, render `<TaskNotes>` at bottom |
| `apps/web/src/components/RoadmapView.tsx`     | Pass `currentDemoUserId` to `<TaskDrawer>`                      |

## No Changes Needed

- **API**: Endpoints already exist from Task 7.1
- **Types**: `TaskNoteVM` and `NoteLabel` already in `types.ts`
- **E2E**: No selector or behavior changes to existing tests
- **Schema**: No migrations

## Design Decisions

1. **Separate component** — TaskDrawer is already large. `TaskNotes` encapsulates all notes state and API calls.
2. **Collapsed by default** — Keeps the drawer focused on task details. Note count in header provides at-a-glance info.
3. **Summary toggle** — Optional field appears when body > 100 chars or via link. Avoids cluttering the composer for quick notes.
4. **No refetch on drawer open** — Fetch notes once when `TaskNotes` mounts (taskId changes). The notes list is local state — new/edited notes update in place without a full refetch.
5. **Author matching** — Compare `note.authorId` with `currentDemoUserId` directly (both are strings like `"user-1"`).
