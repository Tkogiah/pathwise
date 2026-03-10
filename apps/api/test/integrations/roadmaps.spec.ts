import { PrismaClient } from '@prisma/client';
import { ClientsService } from '../../src/clients/clients.service';
import { RoadmapsService } from '../../src/roadmaps/roadmaps.service';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Integration tests for roadmap creation and derived VM fields.
 * Each describe block uses its own client to avoid the (clientId, templateId) uniqueness constraint.
 * Requires DATABASE_URL and a running Postgres instance.
 */

let service: ClientsService;
let roadmapsService: RoadmapsService;
let prisma: PrismaClient;
let templateId: string;

// ---------------------------------------------------------------------------
// Shared setup: services + template (shared across describe blocks)
// ---------------------------------------------------------------------------

beforeAll(async () => {
  prisma = new PrismaClient();
  const ps = new PrismaService();
  await ps.onModuleInit();
  service = new ClientsService(ps);
  roadmapsService = new RoadmapsService(ps);

  // Pre-cleanup template + any stale clients from prior failed runs
  await prisma.taskInstance.deleteMany({
    where: {
      stageInstance: {
        programInstance: {
          client: { lastName: { in: ['RoadmapTest', 'ApptTest'] } },
        },
      },
    },
  });
  await prisma.stageInstance.deleteMany({
    where: {
      programInstance: {
        client: { lastName: { in: ['RoadmapTest', 'ApptTest'] } },
      },
    },
  });
  await prisma.clientProgramInstance.deleteMany({
    where: { client: { lastName: { in: ['RoadmapTest', 'ApptTest'] } } },
  });
  await prisma.client.deleteMany({
    where: { lastName: { in: ['RoadmapTest', 'ApptTest'] } },
  });
  await prisma.templateTask.deleteMany({
    where: { stage: { template: { slug: 'due-offset-test' } } },
  });
  await prisma.templateStage.deleteMany({
    where: { template: { slug: 'due-offset-test' } },
  });
  await prisma.programTemplate.deleteMany({
    where: { slug: 'due-offset-test' },
  });

  // Create shared template with two tasks
  const template = await prisma.programTemplate.create({
    data: { name: 'Due Offset Test Template', slug: 'due-offset-test' },
  });
  templateId = template.id;

  const stage = await prisma.templateStage.create({
    data: {
      templateId,
      title: 'Test Stage',
      orderIndex: 0,
      iconName: 'clipboard',
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: stage.id,
      title: 'Task with offset',
      orderIndex: 0,
      dueOffsetDays: 7,
    },
  });
  await prisma.templateTask.create({
    data: {
      stageId: stage.id,
      title: 'Task without offset',
      orderIndex: 1,
      dueOffsetDays: null,
    },
  });
});

afterAll(async () => {
  await prisma.taskInstance.deleteMany({
    where: {
      stageInstance: {
        programInstance: {
          client: { lastName: { in: ['RoadmapTest', 'ApptTest'] } },
        },
      },
    },
  });
  await prisma.stageInstance.deleteMany({
    where: {
      programInstance: {
        client: { lastName: { in: ['RoadmapTest', 'ApptTest'] } },
      },
    },
  });
  await prisma.clientProgramInstance.deleteMany({
    where: { client: { lastName: { in: ['RoadmapTest', 'ApptTest'] } } },
  });
  await prisma.client.deleteMany({
    where: { lastName: { in: ['RoadmapTest', 'ApptTest'] } },
  });
  await prisma.templateTask.deleteMany({
    where: { stage: { template: { slug: 'due-offset-test' } } },
  });
  await prisma.templateStage.deleteMany({
    where: { template: { slug: 'due-offset-test' } },
  });
  await prisma.programTemplate.deleteMany({
    where: { slug: 'due-offset-test' },
  });
  await prisma.$disconnect();
});

// ---------------------------------------------------------------------------
// upcomingAppointments — own client (ApptTest) + one roadmap for the block
// ---------------------------------------------------------------------------

describe('upcomingAppointments — RoadmapVM', () => {
  let apptClientId: string;
  let apptRoadmapId: string;
  let taskInstances: { id: string }[];

  beforeAll(async () => {
    const client = await prisma.client.create({
      data: { firstName: 'Appt', lastName: 'ApptTest' },
    });
    apptClientId = client.id;
    const { id } = await service.activateRoadmap(apptClientId, templateId);
    apptRoadmapId = id;
    const si = await prisma.stageInstance.findFirst({
      where: { programInstanceId: apptRoadmapId },
    });
    taskInstances = await prisma.taskInstance.findMany({
      where: { stageInstanceId: si!.id },
      orderBy: { templateTask: { orderIndex: 'asc' } },
    });
  });

  it('filters out past appointments', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await prisma.taskInstance.update({
      where: { id: taskInstances[0].id },
      data: { appointmentAt: yesterday },
    });
    await prisma.taskInstance.update({
      where: { id: taskInstances[1].id },
      data: { appointmentAt: tomorrow },
    });

    const vm = await roadmapsService.findOne(apptRoadmapId);

    expect(vm.upcomingAppointments).toHaveLength(1);
    expect(vm.upcomingAppointments[0].taskId).toBe(taskInstances[1].id);
  });

  it('returns future appointments sorted ascending', async () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    await prisma.taskInstance.update({
      where: { id: taskInstances[0].id },
      data: { appointmentAt: tomorrow },
    });
    await prisma.taskInstance.update({
      where: { id: taskInstances[1].id },
      data: { appointmentAt: dayAfterTomorrow },
    });

    const vm = await roadmapsService.findOne(apptRoadmapId);

    expect(vm.upcomingAppointments).toHaveLength(2);
    expect(
      new Date(vm.upcomingAppointments[0].appointmentAt).getTime(),
    ).toBeLessThan(
      new Date(vm.upcomingAppointments[1].appointmentAt).getTime(),
    );
  });

  it('returns empty list when no future appointments', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    for (const ti of taskInstances) {
      await prisma.taskInstance.update({
        where: { id: ti.id },
        data: { appointmentAt: yesterday },
      });
    }

    const vm = await roadmapsService.findOne(apptRoadmapId);
    expect(vm.upcomingAppointments).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// activateRoadmap — own client (RoadmapTest)
// ---------------------------------------------------------------------------

describe('activateRoadmap — dueOffsetDays', () => {
  let clientId: string;
  let roadmapId: string;

  beforeAll(async () => {
    const client = await prisma.client.create({
      data: { firstName: 'Test', lastName: 'RoadmapTest' },
    });
    clientId = client.id;
    const { id } = await service.activateRoadmap(clientId, templateId);
    roadmapId = id;
  });

  it('sets dueDate on task instance when dueOffsetDays is set', async () => {
    const instances = await prisma.taskInstance.findMany({
      where: { stageInstance: { programInstanceId: roadmapId } },
      include: { templateTask: true },
    });
    const withOffset = instances.find(
      (ti) => ti.templateTask.title === 'Task with offset',
    );
    expect(withOffset).toBeDefined();
    expect(withOffset!.dueDate).not.toBeNull();
  });

  it('leaves dueDate null when dueOffsetDays is null', async () => {
    const instances = await prisma.taskInstance.findMany({
      where: { stageInstance: { programInstanceId: roadmapId } },
      include: { templateTask: true },
    });
    const withoutOffset = instances.find(
      (ti) => ti.templateTask.title === 'Task without offset',
    );
    expect(withoutOffset).toBeDefined();
    expect(withoutOffset!.dueDate).toBeNull();
  });

  it('computes dueDate as startDate + dueOffsetDays', async () => {
    const instance = await prisma.clientProgramInstance.findUnique({
      where: { id: roadmapId },
    });
    expect(instance).toBeDefined();

    const taskInstance = await prisma.taskInstance.findFirst({
      where: {
        stageInstance: { programInstanceId: roadmapId },
        templateTask: { title: 'Task with offset' },
      },
      include: { templateTask: true },
    });
    expect(taskInstance?.dueDate).not.toBeNull();

    const expectedDate = new Date(instance!.startDate);
    expectedDate.setDate(
      expectedDate.getDate() + taskInstance!.templateTask.dueOffsetDays!,
    );
    expect(taskInstance!.dueDate!.toDateString()).toBe(
      expectedDate.toDateString(),
    );
  });
});

describe('RoadmapsService — daysInProgram', () => {
  let daysClientId: string;
  let daysRoadmapId: string;

  beforeAll(async () => {
    await prisma.taskInstance.deleteMany({
      where: {
        stageInstance: {
          programInstance: { client: { lastName: 'DaysTest' } },
        },
      },
    });
    await prisma.stageInstance.deleteMany({
      where: { programInstance: { client: { lastName: 'DaysTest' } } },
    });
    await prisma.clientProgramInstance.deleteMany({
      where: { client: { lastName: 'DaysTest' } },
    });
    await prisma.client.deleteMany({ where: { lastName: 'DaysTest' } });

    const client = await prisma.client.create({
      data: { firstName: 'Days', lastName: 'DaysTest' },
    });
    daysClientId = client.id;

    const { id } = await service.activateRoadmap(daysClientId, templateId);
    daysRoadmapId = id;
  });

  afterAll(async () => {
    await prisma.taskInstance.deleteMany({
      where: {
        stageInstance: {
          programInstance: { client: { lastName: 'DaysTest' } },
        },
      },
    });
    await prisma.stageInstance.deleteMany({
      where: { programInstance: { client: { lastName: 'DaysTest' } } },
    });
    await prisma.clientProgramInstance.deleteMany({
      where: { client: { lastName: 'DaysTest' } },
    });
    await prisma.client.deleteMany({ where: { lastName: 'DaysTest' } });
  });

  it('returns daysInProgram = 0 when roadmap was just activated today', async () => {
    const vm = await roadmapsService.findOne(daysRoadmapId);
    expect(vm.daysInProgram).toBe(0);
  });

  it('returns daysInProgram = 7 when startDate is 7 days ago', async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    await prisma.clientProgramInstance.update({
      where: { id: daysRoadmapId },
      data: { startDate: sevenDaysAgo },
    });

    const vm = await roadmapsService.findOne(daysRoadmapId);
    expect(vm.daysInProgram).toBe(7);
  });
});
