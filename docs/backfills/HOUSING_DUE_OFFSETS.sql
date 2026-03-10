-- Backfill: Housing template task dueOffsetDays (Task 0.10)
--
-- Rule A: tasks without an explicit due day get the stage timeline end day as offset.
-- Only touches rows where dueOffsetDays IS NULL for the Housing template.
--
-- Run via Railway shell or psql:
--   DATABASE_URL="..." npx prisma db execute \
--     --schema apps/api/prisma/schema.prisma \
--     --stdin < docs/backfills/HOUSING_DUE_OFFSETS.sql

UPDATE "TemplateTask" tt
SET "dueOffsetDays" = CASE tt.title
  -- Stage 1: Intake & Initial Engagement (Day 0–3, end = 3)
  WHEN 'Review referral packet'           THEN 1
  WHEN 'Complete participant orientation' THEN 1
  WHEN 'Explain program expectations'     THEN 1
  WHEN 'Obtain signed ROI'                THEN 3
  WHEN 'Verify identification status'     THEN 3
  WHEN 'Assess housing barriers'          THEN 3
  WHEN 'Assess immediate needs'           THEN 3
  WHEN 'Enter into HMIS'                  THEN 3
  WHEN 'Schedule housing planning meeting' THEN 3
  -- Stage 2: Housing Assessment & Planning (Day 4–14, end = 14)
  WHEN 'Identify PSH options'             THEN 14
  WHEN 'Identify RRH options'             THEN 14
  WHEN 'Identify subsidized housing'      THEN 14
  WHEN 'Identify market-rate housing'     THEN 14
  WHEN 'Develop Housing Action Plan'      THEN 10
  WHEN 'Set housing timeline & milestones' THEN 10
  WHEN 'Review income & benefits'         THEN 14
  WHEN 'Refer to benefits support'        THEN 14
  -- Stage 3: Documentation & Housing Readiness (Day 7–30, end = 30)
  WHEN 'Obtain missing documents'         THEN 30
  WHEN 'Create housing packet'            THEN 30
  WHEN 'Support with rental history'      THEN 30
  WHEN 'Prepare accommodation requests'   THEN 30
  WHEN 'Address credit issues'            THEN 30
  WHEN 'Coach on tenant rights'           THEN 30
  -- Stage 4: Housing Search & Applications (Day 14–75, end = 75)
  WHEN 'Identify housing leads'           THEN 75
  WHEN 'Review eligibility requirements'  THEN 75
  WHEN 'Assist with applications'         THEN 75
  WHEN 'Track applications & waitlists'   THEN 75
  WHEN 'Communicate with landlords'       THEN 75
  WHEN 'Prepare for interviews & viewings' THEN 75
  WHEN 'Document search activity'         THEN 75
  -- Stage 5: Housing Match & Move-In Preparation (Day 45–90, end = 90)
  WHEN 'Confirm housing approval'         THEN 90
  WHEN 'Review lease terms'               THEN 90
  WHEN 'Coordinate inspections & deposits' THEN 90
  WHEN 'Arrange move-in logistics'        THEN 90
  WHEN 'Connect to move-in resources'     THEN 90
  WHEN 'Ensure lease compliance understanding' THEN 90
  -- Stage 6: Exit Planning & Transition (Day 60–90, end = 90)
  WHEN 'Review remaining program time'    THEN 90
  WHEN 'Complete exit planning checklist' THEN 90
  WHEN 'Coordinate warm handoff'          THEN 90
  WHEN 'Provide key contacts & resources' THEN 90
  WHEN 'Update HMIS with exit destination' THEN 90
  WHEN 'Document final outcomes'          THEN 90
  WHEN 'Schedule post-exit follow-up'     THEN 90
END
FROM "TemplateStage" ts
JOIN "ProgramTemplate" pt ON pt.id = ts."templateId"
WHERE tt."stageId" = ts.id
  AND pt.slug = 'housing'
  AND tt."dueOffsetDays" IS NULL;
