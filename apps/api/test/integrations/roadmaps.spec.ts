import { PrismaClient } from '@prisma/client';
import { ClientsService } from '../../src/clients/clients.service';
import { RoadmapsService } from '../../src/roadmaps/roadmaps.service';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Integration tests for roadmap creation (activateRoadmap).
 * Verifies that dueOffsetDays on template tasks populates dueDate on task instances.
 * Requires DATABASE_URL and a running Postgres instance.
 */

let service: ClientsService;
let roadmapsService: RoadmapsService;
let prisma: PrismaClient;
let templateId: string;
let clientId: string;

beforeAll(async () => {
  prisma = new PrismaClient();
  const ps = new PrismaService();
  await ps.onModuleInit();
  service = new ClientsService(ps);
  roadmapsService = new RoadmapsService(ps);

  // Pre-cleanup
  await prisma.taskInstance.deleteMany({
    where: {
      stageInstance: {
        programInstance: { client: { lastName: 'RoadmapTest' } },
      },
    },
  });
  await prisma.stageInstance.deleteMany({
    where: { programInstance: { client: { lastName: 'RoadmapTest' } } },
  });
  await prisma.clientProgramInstance.deleteMany({
    where: { client: { lastName: 'RoadmapTest' } },
  });
  await prisma.client.deleteMany({ where: { lastName: 'RoadmapTest' } });
  await prisma.templateTask.deleteMany({
    where: { stage: { template: { slug: 'due-offset-test' } } },
  });
  await prisma.templateStage.deleteMany({
    where: { template: { slug: 'due-offset-test' } },
  });
  await prisma.programTemplate.deleteMany({
    where: { slug: 'due-offset-test' },
  });

  // Create minimal template with two tasks: one with offset, one without
  const template = await prisma.programTemplate.create({
    data: {
      name: 'Due Offset Test Template',
      slug: 'due-offset-test',
    },
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

  const client = await prisma.client.create({
    data: { firstName: 'Test', lastName: 'RoadmapTest' },
  });
  clientId = client.id;
});

afterAll(async () => {
  await prisma.taskInstance.deleteMany({
    where: {
      stageInstance: {
        programInstance: { client: { lastName: 'RoadmapTest' } },
      },
    },
  });
  await prisma.stageInstance.deleteMany({
    where: { programInstance: { client: { lastName: 'RoadmapTest' } } },
  });
  await prisma.clientProgramInstance.deleteMany({
    where: { client: { lastName: 'RoadmapTest' } },
  });
  await prisma.client.deleteMany({ where: { lastName: 'RoadmapTest' } });
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

describe('activateRoadmap — dueOffsetDays', () => {
  it('sets dueDate on task instance when dueOffsetDays is set', async () => {
    const { id: roadmapId } = await service.activateRoadmap(
      clientId,
      templateId,
    );

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
      where: {
        stageInstance: {
          programInstance: { clientId, templateId },
        },
      },
      include: { templateTask: true },
    });

    const withoutOffset = instances.find(
      (ti) => ti.templateTask.title === 'Task without offset',
    );
    expect(withoutOffset).toBeDefined();
    expect(withoutOffset!.dueDate).toBeNull();
  });

  it('computes dueDate as startDate + dueOffsetDays', async () => {
    const instance = await prisma.clientProgramInstance.findFirst({
      where: { clientId, templateId },
    });
    expect(instance).toBeDefined();

    const taskInstance = await prisma.taskInstance.findFirst({
      where: {
        stageInstance: { programInstanceId: instance!.id },
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
