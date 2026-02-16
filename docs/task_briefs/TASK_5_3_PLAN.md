# Task 5.3 Plan — UI Copy + Timeline Cues

## Background

The canonical 7‑stage Housing Template is now in use. The UI is already template‑agnostic, but we need:
- Product naming alignment ("Pathwise")
- Timeline targets visible in stage detail
- A clear “behind schedule” cue that persists until completion
- **Behind schedule badge visible in both RoadmapBar (StageNode) and stage detail header**

## Decisions Locked

- App title + header should use **“Pathwise.”**
- Timeline should be shown in stage detail with **both**:
  - a target range label (e.g., “Target: Day 0–3”)
  - a “Behind schedule” badge when overdue
- Behind schedule badge should appear **in RoadmapBar and in the stage detail header**
- Use a shared helper: `isStageBehind(stage: StageVM): boolean`
- StageNode placement: keep `redTaskCount` badge top‑right; render “Behind schedule” **below progress text** to avoid collisions

## Step 1: Update App Title

In `apps/web/src/app/layout.tsx`, update:
- metadata title to **Pathwise**
- header text from “Program Roadmap” → **Pathwise**

## Step 2: Add timelineLabel to schema + seed

To avoid brittle duration→label mapping in UI, add a `timelineLabel` field:
- Update Prisma schema: `TemplateStage.timelineLabel String?`
- Migrate DB
- Update seed to set `timelineLabel` for all 7 stages using the canonical strings (e.g., "Day 0–3")

## Step 3: Surface Timeline in API + Types

- Add `timelineLabel` and `recommendedDurationDays` to StageVM in `apps/web/src/lib/types.ts`
- Update the roadmap API serializer (where StageVM is built) to include both fields

## Step 4: Compute “Behind Schedule” via helper

Create a helper in `apps/web/src/lib/utils.ts`:

- `isStageBehind(stage: StageVM): boolean`
- Logic:
  - `activatedAt` exists
  - `recommendedDurationDays` exists
  - `now > activatedAt + recommendedDurationDays`
  - stage status is **not** GREEN
- If any required input is null, return false

## Step 5: Render Timeline + Badge

**Stage detail header (zoom‑in):**
- Show label: `Target: {timelineLabel}`
- If behind: show badge “Behind schedule” (tokenized error badge)

**RoadmapBar StageNode:**
- If behind: show a small “Behind schedule” label **below** the progress text (e.g., `text-[9px] text-status-error`)
- `redTaskCount` badge stays top‑right (unchanged)

## Step 6: Verify 7‑Stage Rendering

Quick visual check:
- Roadmap bar scrolls for 7 stages
- Long titles wrap (line‑clamp‑2)
- Timeline label and badge don’t crowd layout

## Step 7: Verify

Run:
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

## Notes / Risks

- Timeline display relies on `activatedAt`. Inactive stages should not show timing.
- Behind schedule is UI‑computed; acceptable for MVP. If needed later, can be moved to API/engine.

