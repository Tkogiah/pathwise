# Task 5.6 Plan — Remove Ongoing Case Management Stage

## Goal

Remove the "Ongoing Case Management" stage entirely so the roadmap has **6 milestones**.

## Step 1: Update Canonical Template Docs

- `docs/templates/Housing_Canonical.md`: remove Stage 5 (Ongoing Case Management) and renumber stages.
- `docs/templates/Housing_Canonical.json`: remove the Ongoing Case Management stage and update the template description to “Canonical 6-stage housing workflow”.

## Step 2: Update Seed Template

- Remove Stage 5 creation and its tasks from `apps/api/prisma/seed.ts`.
- Update stage orderIndex for remaining stages (Housing Match & Move-In Preparation → 4, Exit Planning & Transition → 5).
- Update template description and seed summary counts to **6 stages, 43 tasks**.
- Ensure demo instances still reference valid stages (comments updated to 5–6 where needed).

## Step 3: Verify

- `npm run db:seed`
- `npm run typecheck && npm run lint && npm run test && npm run format`
