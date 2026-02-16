import { PrismaClient, TaskStatus, BlockerType } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  // --- Clear existing data (reverse FK order) ---
  await prisma.taskInstance.deleteMany();
  await prisma.stageInstance.deleteMany();
  await prisma.clientProgramInstance.deleteMany();
  await prisma.templateTask.deleteMany();
  await prisma.templateStage.deleteMany();
  await prisma.programTemplate.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // --- Users (3) ---
  const maria = await prisma.user.create({
    data: { name: 'Maria Santos', email: 'maria@pathwise.dev' },
  });
  const james = await prisma.user.create({
    data: { name: 'James Chen', email: 'james@pathwise.dev' },
  });
  const aisha = await prisma.user.create({
    data: { name: 'Aisha Johnson', email: 'aisha@pathwise.dev' },
  });

  // --- Clients (3) ---
  const david = await prisma.client.create({
    data: { firstName: 'David', lastName: 'Thompson' },
  });
  const sarah = await prisma.client.create({
    data: { firstName: 'Sarah', lastName: 'Mitchell' },
  });
  const marcus = await prisma.client.create({
    data: { firstName: 'Marcus', lastName: 'Rivera' },
  });

  // =============================================================
  // Canonical Housing Template (6 stages, 43 tasks)
  // Source: docs/templates/Housing_Canonical.md
  // =============================================================
  const housing = await prisma.programTemplate.create({
    data: {
      name: 'Housing Program',
      description: 'Canonical 6-stage housing workflow',
    },
  });

  // --- Stage 1: Intake & Initial Engagement (Day 0–3, 9 tasks) ---
  const stage1 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Intake & Initial Engagement',
      orderIndex: 0,
      iconName: 'clipboard',
      recommendedDurationDays: 3,
      timelineLabel: 'Day 0–3',
    },
  });

  const s1t1 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Review referral packet',
      description:
        'Review referral packet and eligibility documentation (Day 0–1)',
      orderIndex: 0,
    },
  });
  const s1t2 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Complete participant orientation',
      description:
        'Complete participant orientation to CSC housing services (Day 0–1)',
      orderIndex: 1,
    },
  });
  const s1t3 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Explain program expectations',
      description:
        'Explain program expectations, timelines, and housing goals, including 90-day maximum stay (Day 0–1)',
      orderIndex: 2,
    },
  });
  const s1t4 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Obtain signed ROI',
      description:
        'Obtain signed releases of information (ROI) as needed (Day 0–3)',
      orderIndex: 3,
    },
  });
  const s1t5 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Verify identification status',
      description:
        'Verify identification status (ID, SSN card, birth certificate) (Day 0–3)',
      orderIndex: 4,
    },
  });
  const s1t6 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Assess housing barriers',
      description:
        'Assess housing barriers (criminal history, eviction history, credit, income) (Day 0–3)',
      orderIndex: 5,
    },
  });
  const s1t7 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Assess immediate needs',
      description:
        'Assess immediate needs impacting housing (medical, behavioral health, mobility) (Day 0–3)',
      orderIndex: 6,
    },
  });
  const s1t8 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Enter into HMIS',
      description:
        'Enter participant into HMIS and/or required tracking systems (Day 0–3)',
      orderIndex: 7,
    },
  });
  const s1t9 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Schedule housing planning meeting',
      description: 'Schedule initial housing planning meeting (By Day 3)',
      orderIndex: 8,
    },
  });

  // --- Stage 2: Housing Assessment & Planning (Day 4–14, 8 tasks) ---
  const stage2 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Housing Assessment & Planning',
      orderIndex: 1,
      iconName: 'folder',
      recommendedDurationDays: 10,
      timelineLabel: 'Day 4–14',
    },
  });

  const s2t1 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Identify PSH options',
      description:
        'Identify housing type(s) to pursue by priority: Permanent Supportive Housing (PSH)',
      orderIndex: 0,
    },
  });
  const s2t2 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Identify RRH options',
      description:
        'Identify housing type(s) to pursue by priority: Rapid Rehousing (RRH)',
      orderIndex: 1,
    },
  });
  const s2t3 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Identify subsidized housing',
      description:
        'Identify housing type(s) to pursue by priority: Subsidized/Affordable Housing',
      orderIndex: 2,
    },
  });
  const s2t4 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Identify market-rate housing',
      description:
        'Identify housing type(s) to pursue by priority: Market-rate housing',
      orderIndex: 3,
    },
  });
  const s2t5 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Develop Housing Action Plan',
      description: 'Develop individualized Housing Action Plan (By Day 10)',
      orderIndex: 4,
    },
  });
  const s2t6 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Set housing timeline & milestones',
      description:
        'Set realistic housing timeline and milestones aligned with 90-day limit (By Day 10)',
      orderIndex: 5,
    },
  });
  const s2t7 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Review income & benefits',
      description: 'Review income sources and benefits status (By Day 14)',
      orderIndex: 6,
    },
  });
  const s2t8 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Refer to benefits support',
      description:
        'Refer to benefits support if needed (SSI/SSDI, SNAP, GA, VA) (By Day 14)',
      orderIndex: 7,
    },
  });

  // --- Stage 3: Documentation & Housing Readiness (Day 7–30, 6 tasks) ---
  const stage3 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Documentation & Housing Readiness',
      orderIndex: 2,
      iconName: 'document',
      recommendedDurationDays: 23,
      timelineLabel: 'Day 7–30',
    },
  });

  const s3t1 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Obtain missing documents',
      description:
        'Assist participant in obtaining missing documents (Initiate by Day 7; ongoing)',
      orderIndex: 0,
    },
  });
  const s3t2 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Create housing packet',
      description:
        'Create or update housing packet (copies of ID, income verification, references) (By Day 21)',
      orderIndex: 1,
    },
  });
  const s3t3 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Support with rental history',
      description:
        'Support participant with resume or rental history summary if applicable (By Day 21)',
      orderIndex: 2,
    },
  });
  const s3t4 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Prepare accommodation requests',
      description:
        'Prepare reasonable accommodation requests (if needed) (By Day 21)',
      orderIndex: 3,
    },
  });
  const s3t5 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Address credit issues',
      description:
        'Review and address credit issues (referrals, explanations, payment plans) (By Day 30)',
      orderIndex: 4,
    },
  });
  const s3t6 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Coach on tenant rights',
      description:
        'Coach participant on tenant rights and responsibilities (By Day 30)',
      orderIndex: 5,
    },
  });

  // --- Stage 4: Housing Search & Applications (Day 14–75, 7 tasks) ---
  const stage4 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Housing Search & Applications',
      orderIndex: 3,
      iconName: 'search',
      recommendedDurationDays: 61,
      timelineLabel: 'Day 14–75',
    },
  });

  const s4t1 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Identify housing leads',
      description:
        'Identify appropriate housing leads (Begin by Day 14; ongoing)',
      orderIndex: 0,
    },
  });
  const s4t2 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Review eligibility requirements',
      description: 'Review eligibility requirements with participant (Ongoing)',
      orderIndex: 1,
    },
  });
  const s4t3 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Assist with applications',
      description:
        'Assist with housing applications (online and paper) (Begin by Day 21)',
      orderIndex: 2,
    },
  });
  const s4t4 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Track applications & waitlists',
      description: 'Track submitted applications and waitlists (Weekly)',
      orderIndex: 3,
    },
  });
  const s4t5 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Communicate with landlords',
      description:
        'Communicate with landlords/property managers as appropriate (Ongoing)',
      orderIndex: 4,
    },
  });
  const s4t6 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Prepare for interviews & viewings',
      description:
        'Schedule and prepare participant for housing interviews or viewings (Ongoing)',
      orderIndex: 5,
    },
  });
  const s4t7 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Document search activity',
      description:
        'Document all housing search activity in participant record (Weekly)',
      orderIndex: 6,
    },
  });

  // --- Stage 5: Housing Match & Move-In Preparation (Day 45–90, 6 tasks) ---
  const stage6 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Housing Match & Move-In Preparation',
      orderIndex: 4,
      iconName: 'home',
      recommendedDurationDays: 45,
      timelineLabel: 'Day 45–90',
    },
  });

  const s6t1 = await prisma.templateTask.create({
    data: {
      stageId: stage6.id,
      title: 'Confirm housing approval',
      description:
        'Confirm housing approval and anticipated move-in date (As soon as available)',
      orderIndex: 0,
    },
  });
  const s6t2 = await prisma.templateTask.create({
    data: {
      stageId: stage6.id,
      title: 'Review lease terms',
      description: 'Review lease terms with participant (Prior to signing)',
      orderIndex: 1,
    },
  });
  const s6t3 = await prisma.templateTask.create({
    data: {
      stageId: stage6.id,
      title: 'Coordinate inspections & deposits',
      description:
        'Coordinate inspections, deposits, and utility setup if applicable (As required)',
      orderIndex: 2,
    },
  });
  const s6t4 = await prisma.templateTask.create({
    data: {
      stageId: stage6.id,
      title: 'Arrange move-in logistics',
      description:
        'Arrange move-in logistics (transportation, belongings) (1–7 days prior to move-in)',
      orderIndex: 3,
    },
  });
  const s6t5 = await prisma.templateTask.create({
    data: {
      stageId: stage6.id,
      title: 'Connect to move-in resources',
      description:
        'Connect participant to move-in assistance or community resources (Prior to move-in)',
      orderIndex: 4,
    },
  });
  const s6t6 = await prisma.templateTask.create({
    data: {
      stageId: stage6.id,
      title: 'Ensure lease compliance understanding',
      description:
        'Ensure participant understands lease compliance and house rules (Prior to exit)',
      orderIndex: 5,
    },
  });

  // --- Stage 6: Exit Planning & Transition (Day 60–90, 7 tasks) ---
  const stage7 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Exit Planning & Transition',
      orderIndex: 5,
      iconName: 'flag',
      recommendedDurationDays: 30,
      timelineLabel: 'Day 60–90',
    },
  });

  const s7t1 = await prisma.templateTask.create({
    data: {
      stageId: stage7.id,
      title: 'Review remaining program time',
      description:
        'Review remaining time in program with participant (By Day 60)',
      orderIndex: 0,
    },
  });
  const s7t2 = await prisma.templateTask.create({
    data: {
      stageId: stage7.id,
      title: 'Complete exit planning checklist',
      description: 'Complete CSC exit planning checklist (By Day 75)',
      orderIndex: 1,
    },
  });
  const s7t3 = await prisma.templateTask.create({
    data: {
      stageId: stage7.id,
      title: 'Coordinate warm handoff',
      description:
        'Coordinate warm handoff to ongoing case management or housing support (By Day 85)',
      orderIndex: 2,
    },
  });
  const s7t4 = await prisma.templateTask.create({
    data: {
      stageId: stage7.id,
      title: 'Provide key contacts & resources',
      description:
        'Provide participant with key contacts and resources (At exit)',
      orderIndex: 3,
    },
  });
  const s7t5 = await prisma.templateTask.create({
    data: {
      stageId: stage7.id,
      title: 'Update HMIS with exit destination',
      description:
        'Update HMIS and internal systems with exit destination (Within 3 business days of exit)',
      orderIndex: 4,
    },
  });
  const s7t6 = await prisma.templateTask.create({
    data: {
      stageId: stage7.id,
      title: 'Document final outcomes',
      description:
        'Document final outcomes and housing placement details (Within 3 business days of exit)',
      orderIndex: 5,
    },
  });
  const s7t7 = await prisma.templateTask.create({
    data: {
      stageId: stage7.id,
      title: 'Schedule post-exit follow-up',
      description: 'Schedule follow-up if program requires post-exit check-ins',
      orderIndex: 6,
    },
  });

  // =============================================================
  // Canonical Benefits Template (5 stages, 33 tasks)
  // Source: docs/templates/Benefits_Canonical.md
  // =============================================================
  const benefits = await prisma.programTemplate.create({
    data: {
      name: 'Benefits Access',
      description: 'Canonical 5-stage benefits access workflow (SNAP-focused)',
    },
  });

  // --- Stage 1: Eligibility & Screening (Day 0–3, 7 tasks) ---
  const bStage1 = await prisma.templateStage.create({
    data: {
      templateId: benefits.id,
      title: 'Eligibility & Screening',
      orderIndex: 0,
      iconName: 'clipboard',
      recommendedDurationDays: 3,
      timelineLabel: 'Day 0–3',
    },
  });

  await prisma.templateTask.create({
    data: {
      stageId: bStage1.id,
      title: 'Confirm Oregon residency',
      description: 'Confirm Oregon residency (Day 0–1)',
      orderIndex: 0,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage1.id,
      title: 'Confirm identity documentation',
      description: 'Confirm identity documentation status (Day 0–1)',
      orderIndex: 1,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage1.id,
      title: 'Identify household composition',
      description: 'Identify household composition (Day 0–2)',
      orderIndex: 2,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage1.id,
      title: 'Review basic income sources',
      description: 'Review basic income sources (Day 0–2)',
      orderIndex: 3,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage1.id,
      title: 'Assess housing status',
      description: 'Assess housing status (Day 0–2)',
      orderIndex: 4,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage1.id,
      title: 'Identify expedited eligibility',
      description: 'Identify potential expedited SNAP eligibility (Day 0–3)',
      orderIndex: 5,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage1.id,
      title: 'Determine other benefits screening',
      description: 'Determine if other benefits screening is needed (Day 0–3)',
      orderIndex: 6,
    },
  });

  // --- Stage 2: Documentation Preparation (Day 2–10, 7 tasks) ---
  const bStage2 = await prisma.templateStage.create({
    data: {
      templateId: benefits.id,
      title: 'Documentation Preparation',
      orderIndex: 1,
      iconName: 'folder',
      recommendedDurationDays: 8,
      timelineLabel: 'Day 2–10',
    },
  });

  await prisma.templateTask.create({
    data: {
      stageId: bStage2.id,
      title: 'Identify required docs list',
      description: 'Identify required documentation list (Day 2–3)',
      orderIndex: 0,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage2.id,
      title: 'Confirm ID availability',
      description: 'Confirm ID availability or initiate replacement (Day 2–5)',
      orderIndex: 1,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage2.id,
      title: 'Confirm proof of residence',
      description: 'Confirm proof of residence strategy (Day 2–5)',
      orderIndex: 2,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage2.id,
      title: 'Confirm income verification',
      description: 'Confirm income verification plan (Day 2–7)',
      orderIndex: 3,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage2.id,
      title: 'Confirm citizenship documentation',
      description:
        'Confirm citizenship/eligible noncitizen documentation (Day 2–7)',
      orderIndex: 4,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage2.id,
      title: 'Identify verification barriers',
      description: 'Identify verification barriers (Day 2–10)',
      orderIndex: 5,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage2.id,
      title: 'Create document follow-up plan',
      description: 'Create document follow-up plan (Day 2–10)',
      orderIndex: 6,
    },
  });

  // --- Stage 3: Application Submission (Day 5–14, 6 tasks) ---
  const bStage3 = await prisma.templateStage.create({
    data: {
      templateId: benefits.id,
      title: 'Application Submission',
      orderIndex: 2,
      iconName: 'document',
      recommendedDurationDays: 9,
      timelineLabel: 'Day 5–14',
    },
  });

  await prisma.templateTask.create({
    data: {
      stageId: bStage3.id,
      title: 'Choose application method',
      description: 'Choose application method (Day 5–7)',
      orderIndex: 0,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage3.id,
      title: 'Complete SNAP application',
      description: 'Complete SNAP application (Day 5–10)',
      orderIndex: 1,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage3.id,
      title: 'Confirm application submitted',
      description: 'Confirm application submitted (Day 5–10)',
      orderIndex: 2,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage3.id,
      title: 'Record application date',
      description: 'Record application date (Day 5–10)',
      orderIndex: 3,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage3.id,
      title: 'Confirm expedited request',
      description: 'Confirm expedited request if applicable (Day 5–10)',
      orderIndex: 4,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage3.id,
      title: 'Provide confirmation number',
      description: 'Provide confirmation/reference number (Day 5–14)',
      orderIndex: 5,
    },
  });

  // --- Stage 4: Interview & Verification (Day 7–21, 6 tasks) ---
  const bStage4 = await prisma.templateStage.create({
    data: {
      templateId: benefits.id,
      title: 'Interview & Verification',
      orderIndex: 3,
      iconName: 'search',
      recommendedDurationDays: 14,
      timelineLabel: 'Day 7–21',
    },
  });

  await prisma.templateTask.create({
    data: {
      stageId: bStage4.id,
      title: 'Confirm interview scheduled',
      description: 'Confirm interview scheduled (Day 7–14)',
      orderIndex: 0,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage4.id,
      title: 'Prepare participant for interview',
      description: 'Prepare participant for interview (Day 7–14)',
      orderIndex: 1,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage4.id,
      title: 'Ensure interview completed',
      description: 'Ensure interview completed (Day 7–21)',
      orderIndex: 2,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage4.id,
      title: 'Track requested verifications',
      description: 'Track requested additional verifications (Day 7–21)',
      orderIndex: 3,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage4.id,
      title: 'Submit follow-up documents',
      description: 'Submit follow-up documents (Day 7–21)',
      orderIndex: 4,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage4.id,
      title: 'Monitor verification deadlines',
      description: 'Monitor verification deadlines (Day 7–21)',
      orderIndex: 5,
    },
  });

  // --- Stage 5: Decision & Next Steps (Day 14–30, 7 tasks) ---
  const bStage5 = await prisma.templateStage.create({
    data: {
      templateId: benefits.id,
      title: 'Decision & Next Steps',
      orderIndex: 4,
      iconName: 'flag',
      recommendedDurationDays: 16,
      timelineLabel: 'Day 14–30',
    },
  });

  await prisma.templateTask.create({
    data: {
      stageId: bStage5.id,
      title: 'Confirm decision status',
      description: 'Confirm approval or denial status (Day 14–30)',
      orderIndex: 0,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage5.id,
      title: 'Confirm benefit start date',
      description: 'If approved, confirm benefit start date (Day 14–30)',
      orderIndex: 1,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage5.id,
      title: 'Confirm EBT card status',
      description:
        'Confirm EBT card received or replacement requested (Day 14–30)',
      orderIndex: 2,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage5.id,
      title: 'Educate on benefit use',
      description:
        'Educate on benefit use and reporting requirements (Day 14–30)',
      orderIndex: 3,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage5.id,
      title: 'Review denial reason',
      description: 'If denied, review denial reason (Day 14–30)',
      orderIndex: 4,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage5.id,
      title: 'Determine appeal viability',
      description: 'Determine if appeal is appropriate (Day 14–30)',
      orderIndex: 5,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: bStage5.id,
      title: 'Assist with appeal submission',
      description: 'Assist with appeal submission if applicable (Day 14–30)',
      orderIndex: 6,
    },
  });

  // =============================================================
  // Instance helpers
  // =============================================================
  // Note: stage5 was removed (Ongoing Case Management), so stage6/7 remain to avoid renaming.
  const allStages = [stage1, stage2, stage3, stage4, stage6, stage7];
  const tasksByStage: Record<string, (typeof s1t1)[]> = {
    [stage1.id]: [s1t1, s1t2, s1t3, s1t4, s1t5, s1t6, s1t7, s1t8, s1t9],
    [stage2.id]: [s2t1, s2t2, s2t3, s2t4, s2t5, s2t6, s2t7, s2t8],
    [stage3.id]: [s3t1, s3t2, s3t3, s3t4, s3t5, s3t6],
    [stage4.id]: [s4t1, s4t2, s4t3, s4t4, s4t5, s4t6, s4t7],
    [stage6.id]: [s6t1, s6t2, s6t3, s6t4, s6t5, s6t6],
    [stage7.id]: [s7t1, s7t2, s7t3, s7t4, s7t5, s7t6, s7t7],
  };

  async function cloneProgram(
    clientId: string,
    activateUpTo: number,
    startDate: Date,
  ) {
    const instance = await prisma.clientProgramInstance.create({
      data: {
        clientId,
        templateId: housing.id,
        startDate,
        programLengthDays: 90,
      },
    });

    const stageInstanceMap: Record<string, string> = {};
    for (const stage of allStages) {
      const si = await prisma.stageInstance.create({
        data: {
          programInstanceId: instance.id,
          templateStageId: stage.id,
          activatedAt:
            stage.orderIndex <= activateUpTo
              ? daysAgo(30 - stage.orderIndex * 5)
              : null,
        },
      });
      stageInstanceMap[stage.id] = si.id;
    }

    const taskInstanceMap: Record<string, string> = {};
    for (const stage of allStages) {
      const tasks = tasksByStage[stage.id];
      for (const task of tasks) {
        const ti = await prisma.taskInstance.create({
          data: {
            stageInstanceId: stageInstanceMap[stage.id],
            templateTaskId: task.id,
          },
        });
        taskInstanceMap[task.id] = ti.id;
      }
    }

    return { instance, stageInstanceMap, taskInstanceMap };
  }

  // =============================================================
  // DAVID THOMPSON — Instance 1 (advanced, multi-state demo)
  // =============================================================
  const david1 = await cloneProgram(david.id, 3, daysAgo(60));

  // Stage 1 (Intake): all COMPLETE → GREEN
  for (const task of [s1t1, s1t2, s1t3, s1t4, s1t5, s1t6, s1t7, s1t8, s1t9]) {
    await prisma.taskInstance.update({
      where: { id: david1.taskInstanceMap[task.id] },
      data: {
        status: TaskStatus.COMPLETE,
        completedAt: daysAgo(55),
        assignedUserId: maria.id,
      },
    });
  }
  await prisma.stageInstance.update({
    where: { id: david1.stageInstanceMap[stage1.id] },
    data: {
      completedAt: daysAgo(55),
      handoffSummary:
        'Intake complete. All documents collected. Ready for assessment.',
    },
  });

  // Stage 2 (Assessment & Planning): all COMPLETE → GREEN
  for (const task of [s2t1, s2t2, s2t3, s2t4, s2t5, s2t6, s2t7, s2t8]) {
    await prisma.taskInstance.update({
      where: { id: david1.taskInstanceMap[task.id] },
      data: {
        status: TaskStatus.COMPLETE,
        completedAt: daysAgo(45),
        assignedUserId: maria.id,
      },
    });
  }
  await prisma.stageInstance.update({
    where: { id: david1.stageInstanceMap[stage2.id] },
    data: {
      completedAt: daysAgo(45),
      handoffSummary:
        'Housing Action Plan developed. PSH identified as priority.',
    },
  });

  // Stage 3 (Documentation): 4 COMPLETE, 1 BLOCKED, 1 IN_PROGRESS → RED
  for (const task of [s3t1, s3t2, s3t3, s3t4]) {
    await prisma.taskInstance.update({
      where: { id: david1.taskInstanceMap[task.id] },
      data: {
        status: TaskStatus.COMPLETE,
        completedAt: daysAgo(30),
        assignedUserId: james.id,
      },
    });
  }
  // s3t5 (credit issues) — BLOCKED + overdue
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s3t5.id] },
    data: {
      status: TaskStatus.BLOCKED,
      blockerType: BlockerType.EXTERNAL,
      blockerNote: 'Waiting on credit bureau dispute resolution',
      assignedUserId: maria.id,
      dueDate: daysAgo(5),
    },
  });
  // s3t6 (tenant rights) — IN_PROGRESS
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s3t6.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: james.id,
      dueDate: daysFromNow(3),
    },
  });
  await prisma.stageInstance.update({
    where: { id: david1.stageInstanceMap[stage3.id] },
    data: {
      handoffSummary:
        'Credit dispute blocking progress. Tenant coaching underway.',
    },
  });

  // Stage 4 (Housing Search): 2 IN_PROGRESS, rest NOT_STARTED → YELLOW
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s4t1.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: james.id,
      dueDate: daysFromNow(14),
    },
  });
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s4t2.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: maria.id,
      dueDate: daysFromNow(10),
    },
  });

  // Stages 5-6: not activated (GRAY) — left as defaults

  // =============================================================
  // DAVID THOMPSON — Instance 2 (early, multi-roadmap demo)
  // =============================================================
  const david2 = await cloneProgram(david.id, 0, daysAgo(5));

  // Stage 1: 1 IN_PROGRESS, rest NOT_STARTED → YELLOW
  await prisma.taskInstance.update({
    where: { id: david2.taskInstanceMap[s1t1.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: aisha.id,
      dueDate: daysFromNow(5),
    },
  });

  // =============================================================
  // SARAH MITCHELL — 1 instance (mixed progress, N/A demo)
  // =============================================================
  const sarah1 = await cloneProgram(sarah.id, 1, daysAgo(30));

  // Stage 1 (Intake): all COMPLETE → GREEN
  for (const task of [s1t1, s1t2, s1t3, s1t4, s1t5, s1t6, s1t7, s1t8, s1t9]) {
    await prisma.taskInstance.update({
      where: { id: sarah1.taskInstanceMap[task.id] },
      data: {
        status: TaskStatus.COMPLETE,
        completedAt: daysAgo(22),
        assignedUserId: james.id,
      },
    });
  }
  await prisma.stageInstance.update({
    where: { id: sarah1.stageInstanceMap[stage1.id] },
    data: {
      completedAt: daysAgo(22),
      handoffSummary: 'Intake done. Client is motivated and responsive.',
    },
  });

  // Stage 2 (Assessment): 5 COMPLETE, 1 N/A, 2 IN_PROGRESS → YELLOW
  for (const task of [s2t1, s2t2, s2t3, s2t4, s2t5]) {
    await prisma.taskInstance.update({
      where: { id: sarah1.taskInstanceMap[task.id] },
      data: {
        status: TaskStatus.COMPLETE,
        completedAt: daysAgo(15),
        assignedUserId: james.id,
      },
    });
  }
  // s2t6 (timeline) — N/A
  await prisma.taskInstance.update({
    where: { id: sarah1.taskInstanceMap[s2t6.id] },
    data: {
      isNa: true,
      naReason: 'Client already has clear timeline from prior program',
      assignedUserId: james.id,
    },
  });
  // s2t7 (income review) — IN_PROGRESS
  await prisma.taskInstance.update({
    where: { id: sarah1.taskInstanceMap[s2t7.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: aisha.id,
      dueDate: daysFromNow(7),
    },
  });
  // s2t8 (benefits referral) — IN_PROGRESS
  await prisma.taskInstance.update({
    where: { id: sarah1.taskInstanceMap[s2t8.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: aisha.id,
      dueDate: daysFromNow(10),
    },
  });

  // =============================================================
  // MARCUS RIVERA — 1 instance (early stage, mostly NOT_STARTED)
  // =============================================================
  const marcus1 = await cloneProgram(marcus.id, 0, daysAgo(3));

  // Stage 1: 1 IN_PROGRESS, 1 NOT_STARTED with due date → YELLOW
  await prisma.taskInstance.update({
    where: { id: marcus1.taskInstanceMap[s1t1.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: aisha.id,
      dueDate: daysFromNow(4),
    },
  });
  await prisma.taskInstance.update({
    where: { id: marcus1.taskInstanceMap[s1t2.id] },
    data: {
      assignedUserId: aisha.id,
      dueDate: daysFromNow(4),
    },
  });

  console.log('Seed complete.');
  console.log('  Users: 3');
  console.log('  Clients: 3');
  console.log('  Templates: 2');
  console.log('    - Housing Program (6 stages, 43 tasks)');
  console.log('    - Benefits Access (5 stages, 33 tasks)');
  console.log('  Program instances: 4');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
