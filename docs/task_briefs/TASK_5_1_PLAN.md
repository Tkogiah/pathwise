# Task 5.1 Plan — Canonical Housing Template (Data Model + Seed)

## Current State

The seed currently creates 1 template with 5 stages / 17 tasks. The canonical template defines 7 stages / 48 tasks with different stage names, more granular tasks, and a different workflow structure.

## Step 1: Replace Template Definition in Seed

Replace the current 5‑stage template block with the 7 canonical stages from `docs/templates/Housing_Canonical.json`.

Each stage should include:
- `title` — from JSON
- `orderIndex` — 0–6
- `iconName` — per mapping below
- `recommendedDurationDays` — derived from timeline range (see Step 1b)

Stage → icon mapping:

- Intake & Initial Engagement → `clipboard`
- Housing Assessment & Planning → `folder`
- Documentation & Housing Readiness → `document`
- Housing Search & Applications → `search`
- Ongoing Case Management → `shield`
- Housing Match & Move-In Preparation → `home`
- Exit Planning & Transition → `flag`

### Step 1b: recommendedDurationDays Heuristic

Use these explicit values in seed (add brief inline comments):
- Day 0–3 → `3`
- Day 4–14 → `10`
- Day 7–30 → `23`
- Day 14–75 → `61`
- Day 1–90 → `90`
- Day 45–90 → `45`
- Day 60–90 → `30`

## Step 2: Create All 48 Template Tasks

For each task:
- `title` — short, slug‑friendly summary
- `description` — full canonical text including timeline (e.g., “Review referral packet and eligibility documentation (Day 0–1)”)
- `orderIndex` — sequential within stage
- `isRequired` — `true`
- `dependsOnTaskId` — `null` for all

## Step 3: Update cloneProgram Helper

Update `allStages` and `tasksByStage` to reference the new 7 stages and their tasks. Helper logic stays the same.

## Step 4: Rebuild Demo Instances

Create scenario‑appropriate demo state across the 4 program instances:

**David Thompson — Instance 1 (advanced, multi‑state demo)**
- Stages 1–2: all COMPLETE (GREEN)
- Stage 3: mixed, one BLOCKED → RED
- Stage 4: some IN_PROGRESS → YELLOW
- Stages 5–7: not activated (GRAY)
- Include one blocked task with blocker details and one overdue task

**David Thompson — Instance 2 (early, multi‑roadmap demo)**
- Stage 1: 1 IN_PROGRESS, rest NOT_STARTED → YELLOW
- Stages 2–7: not activated

**Sarah Mitchell (mixed + N/A demo)**
- Stage 1: all COMPLETE → GREEN
- Stage 2: mixed with one N/A task → YELLOW
- Stages 3–7: not activated

**Marcus Rivera (early stage)**
- Stage 1: 1 IN_PROGRESS, rest NOT_STARTED → YELLOW
- Stages 2–7: not activated

## Step 5: Update Seed Summary Log

Update the console output to say `7 stages, 48 tasks`.

## Step 6: Update E2E Smoke Tests

Update selectors in `e2e/smoke.spec.ts` to use the **short titles** chosen for Marcus Rivera’s tasks and the new stage title:
- Replace old task slugs (`collect-id-documents`, `complete-intake-form`) with the new short titles
- Update stage progress selector to `stage-progress-intake-initial-engagement`

## Step 7: Update ICON_MAP

In `StageNode.tsx`, add missing icon mappings:
- `document` → 📄
- `flag` → 🏁

## Step 8: Verify

Run:
- `npm run db:seed`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

## Risks / Edge Cases

1. **E2E selectors:** short titles keep slugs stable and readable.
2. **Long canonical text:** stored in `description`, not used for slug, avoids test brittleness.
3. **No dependencies:** canonical template omits them; keep `dependsOnTaskId: null`.
4. **Icon support:** missing icons fallback to 📌; added for completeness.
5. **Seed size:** 48×4 = 192 task instances; acceptable for demo.

