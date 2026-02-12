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

  // --- Housing Template (1 template, 5 stages, 17 tasks) ---
  const housing = await prisma.programTemplate.create({
    data: {
      name: 'Housing Program',
      description: 'Standard housing stabilization pathway',
    },
  });

  // Stage 1: Intake & Assessment (4 tasks)
  const stage1 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Intake & Assessment',
      orderIndex: 0,
      iconName: 'clipboard',
      recommendedDurationDays: 7,
    },
  });

  const s1t1 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Collect ID documents',
      description: 'Gather government-issued photo ID and Social Security card',
      orderIndex: 0,
    },
  });
  const s1t2 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Complete intake form',
      description: 'Fill out standard intake questionnaire',
      orderIndex: 1,
    },
  });
  const s1t3 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Conduct needs assessment',
      description: 'Evaluate housing needs, barriers, and preferences',
      orderIndex: 2,
    },
  });
  const s1t4 = await prisma.templateTask.create({
    data: {
      stageId: stage1.id,
      title: 'Record housing preference',
      description:
        'Document preferred location, unit size, and accessibility needs',
      isRequired: false,
      orderIndex: 3,
    },
  });

  // Stage 2: Document Collection (4 tasks, with dependency)
  const stage2 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Document Collection',
      orderIndex: 1,
      iconName: 'folder',
      recommendedDurationDays: 14,
    },
  });

  const s2t1 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Verify income documentation',
      description: 'Collect pay stubs, benefits letters, or tax returns',
      orderIndex: 0,
    },
  });
  const s2t2 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Copy identification documents',
      description: 'Make copies of all ID documents for file',
      orderIndex: 1,
    },
  });
  const s2t3 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Obtain references',
      description: 'Collect landlord or personal references',
      isRequired: false,
      orderIndex: 2,
    },
  });
  // Background check depends on income verification (same stage)
  const s2t4 = await prisma.templateTask.create({
    data: {
      stageId: stage2.id,
      title: 'Run background check',
      description: 'Submit background check request after income is verified',
      dependsOnTaskId: s2t1.id,
      orderIndex: 3,
    },
  });

  // Stage 3: Housing Search (3 tasks, with dependency)
  const stage3 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Housing Search',
      orderIndex: 2,
      iconName: 'search',
      recommendedDurationDays: 30,
    },
  });

  const s3t1 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Search available units',
      description: 'Identify available units matching client preferences',
      orderIndex: 0,
    },
  });
  const s3t2 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Submit housing application',
      description: 'Complete and submit application to selected property',
      orderIndex: 1,
    },
  });
  // Landlord contact depends on application submission (same stage)
  const s3t3 = await prisma.templateTask.create({
    data: {
      stageId: stage3.id,
      title: 'Contact landlord',
      description: 'Follow up with landlord on application status',
      dependsOnTaskId: s3t2.id,
      orderIndex: 2,
    },
  });

  // Stage 4: Lease & Move-In (3 tasks)
  const stage4 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Lease & Move-In',
      orderIndex: 3,
      iconName: 'home',
      recommendedDurationDays: 14,
    },
  });

  const s4t1 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Review lease agreement',
      description: 'Review lease terms with client before signing',
      orderIndex: 0,
    },
  });
  const s4t2 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Arrange deposit assistance',
      description: 'Process security deposit and first month rent assistance',
      orderIndex: 1,
    },
  });
  const s4t3 = await prisma.templateTask.create({
    data: {
      stageId: stage4.id,
      title: 'Conduct move-in inspection',
      description: 'Walk through unit with client and document condition',
      orderIndex: 2,
    },
  });

  // Stage 5: Stabilization (3 tasks)
  const stage5 = await prisma.templateStage.create({
    data: {
      templateId: housing.id,
      title: 'Stabilization',
      orderIndex: 4,
      iconName: 'shield',
      recommendedDurationDays: 30,
    },
  });

  const s5t1 = await prisma.templateTask.create({
    data: {
      stageId: stage5.id,
      title: '30-day check-in',
      description: 'Conduct follow-up visit after 30 days in housing',
      orderIndex: 0,
    },
  });
  const s5t2 = await prisma.templateTask.create({
    data: {
      stageId: stage5.id,
      title: 'Confirm utility setup',
      description: 'Verify all utilities are connected and in client name',
      orderIndex: 1,
    },
  });
  const s5t3 = await prisma.templateTask.create({
    data: {
      stageId: stage5.id,
      title: 'Connect to community resources',
      description:
        'Link client to local food bank, transit, and support groups',
      isRequired: false,
      orderIndex: 2,
    },
  });

  const allStages = [stage1, stage2, stage3, stage4, stage5];
  const tasksByStage: Record<string, (typeof s1t1)[]> = {
    [stage1.id]: [s1t1, s1t2, s1t3, s1t4],
    [stage2.id]: [s2t1, s2t2, s2t3, s2t4],
    [stage3.id]: [s3t1, s3t2, s3t3],
    [stage4.id]: [s4t1, s4t2, s4t3],
    [stage5.id]: [s5t1, s5t2, s5t3],
  };

  // --- Helper: clone template into instances ---
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
              ? daysAgo(30 - stage.orderIndex * 7)
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

  // =========================================================
  // DAVID THOMPSON — Instance 1 (advanced, multi-state demo)
  // =========================================================
  const david1 = await cloneProgram(david.id, 2, daysAgo(45));

  // Stage 1 (Intake): all COMPLETE → GREEN
  for (const task of [s1t1, s1t2, s1t3, s1t4]) {
    await prisma.taskInstance.update({
      where: { id: david1.taskInstanceMap[task.id] },
      data: {
        status: TaskStatus.COMPLETE,
        completedAt: daysAgo(35),
        assignedUserId: maria.id,
      },
    });
  }
  await prisma.stageInstance.update({
    where: { id: david1.stageInstanceMap[stage1.id] },
    data: {
      completedAt: daysAgo(35),
      handoffSummary:
        'Intake complete. All documents collected. Ready for verification.',
    },
  });

  // Stage 2 (Documents): 2 COMPLETE, 1 BLOCKED, 1 locked → RED
  // s2t2 (copy IDs) — COMPLETE
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s2t2.id] },
    data: {
      status: TaskStatus.COMPLETE,
      completedAt: daysAgo(25),
      assignedUserId: maria.id,
    },
  });
  // s2t3 (references) — COMPLETE
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s2t3.id] },
    data: {
      status: TaskStatus.COMPLETE,
      completedAt: daysAgo(20),
      assignedUserId: james.id,
    },
  });
  // s2t1 (income verification) — BLOCKED
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s2t1.id] },
    data: {
      status: TaskStatus.BLOCKED,
      blockerType: BlockerType.EXTERNAL,
      blockerNote: 'Waiting on employer to provide verification letter',
      assignedUserId: maria.id,
      dueDate: daysAgo(5),
    },
  });
  // s2t4 (background check) — NOT_STARTED, LOCKED (depends on s2t1 which is not COMPLETE)
  // Left as default NOT_STARTED — engine will derive locked state
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s2t4.id] },
    data: { assignedUserId: maria.id },
  });
  await prisma.stageInstance.update({
    where: { id: david1.stageInstanceMap[stage2.id] },
    data: {
      handoffSummary:
        'Income verification blocked. Background check waiting on that.',
    },
  });

  // Stage 3 (Housing Search): 1 IN_PROGRESS + overdue → RED
  await prisma.taskInstance.update({
    where: { id: david1.taskInstanceMap[s3t1.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      dueDate: daysAgo(3),
      assignedUserId: james.id,
    },
  });

  // =========================================================
  // DAVID THOMPSON — Instance 2 (early, for multi-roadmap)
  // =========================================================
  const david2 = await cloneProgram(david.id, 0, daysAgo(5));

  // Stage 1: 1 IN_PROGRESS, rest NOT_STARTED
  await prisma.taskInstance.update({
    where: { id: david2.taskInstanceMap[s1t1.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: aisha.id,
      dueDate: daysFromNow(5),
    },
  });

  // =========================================================
  // SARAH MITCHELL — 1 instance (mixed progress, N/A demo)
  // =========================================================
  const sarah1 = await cloneProgram(sarah.id, 1, daysAgo(30));

  // Stage 1 (Intake): all COMPLETE → GREEN
  for (const task of [s1t1, s1t2, s1t3, s1t4]) {
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

  // Stage 2 (Documents): 2 COMPLETE, 1 N/A, 1 IN_PROGRESS → YELLOW
  await prisma.taskInstance.update({
    where: { id: sarah1.taskInstanceMap[s2t1.id] },
    data: {
      status: TaskStatus.COMPLETE,
      completedAt: daysAgo(15),
      assignedUserId: james.id,
    },
  });
  await prisma.taskInstance.update({
    where: { id: sarah1.taskInstanceMap[s2t2.id] },
    data: {
      status: TaskStatus.COMPLETE,
      completedAt: daysAgo(14),
      assignedUserId: james.id,
    },
  });
  // s2t3 (references) — N/A
  await prisma.taskInstance.update({
    where: { id: sarah1.taskInstanceMap[s2t3.id] },
    data: {
      isNa: true,
      naReason: 'Client self-referred, no prior landlord',
      assignedUserId: james.id,
    },
  });
  // s2t4 (background check) — IN_PROGRESS (s2t1 is COMPLETE so not locked)
  await prisma.taskInstance.update({
    where: { id: sarah1.taskInstanceMap[s2t4.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: aisha.id,
      dueDate: daysFromNow(7),
    },
  });

  // =========================================================
  // MARCUS RIVERA — 1 instance (early stage, mostly NOT_STARTED)
  // =========================================================
  const marcus1 = await cloneProgram(marcus.id, 0, daysAgo(3));

  // Stage 1: 1 IN_PROGRESS, rest NOT_STARTED → YELLOW
  await prisma.taskInstance.update({
    where: { id: marcus1.taskInstanceMap[s1t1.id] },
    data: {
      status: TaskStatus.IN_PROGRESS,
      assignedUserId: aisha.id,
      dueDate: daysFromNow(4),
    },
  });

  console.log('Seed complete.');
  console.log('  Users: 3');
  console.log('  Clients: 3');
  console.log('  Template: 1 (Housing Program, 5 stages, 17 tasks)');
  console.log('  Program instances: 4');
  console.log(
    '  Stage instances:',
    Object.keys(david1.stageInstanceMap).length * 4,
  );
  console.log(
    '  Task instances:',
    Object.keys(david1.taskInstanceMap).length * 4,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
