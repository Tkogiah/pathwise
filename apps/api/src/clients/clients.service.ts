import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const now = Date.now();
    const clients = await this.prisma.client.findMany({
      where: { isArchived: false },
      orderBy: { lastName: 'asc' },
      include: {
        programInstances: {
          where: { isActive: true },
          include: {
            template: { select: { name: true } },
            stageInstances: {
              include: {
                taskInstances: {
                  include: {
                    templateTask: { select: { isRequired: true } },
                  },
                },
              },
            },
          },
          orderBy: { startDate: 'desc' },
        },
      },
    });

    return clients.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      roadmaps: client.programInstances.map((pi) => {
        const allTasks = pi.stageInstances.flatMap((si) => si.taskInstances);
        const required = allTasks.filter((t) => t.templateTask.isRequired);
        const completed = required.filter(
          (t) => t.status === 'COMPLETE' || t.isNa,
        ).length;

        return {
          templateName: pi.template.name,
          daysInProgram: Math.max(
            0,
            Math.floor((now - pi.startDate.getTime()) / 86_400_000),
          ),
          programLengthDays: pi.programLengthDays,
          progress: { completed, total: required.length },
        };
      }),
    }));
  }

  async create(body: { firstName?: string; lastName?: string }) {
    const firstName = body.firstName?.trim() ?? '';
    const lastName = body.lastName?.trim() ?? '';

    if (!firstName || !lastName) {
      throw new BadRequestException('First and last name are required');
    }

    return this.prisma.client.create({
      data: { firstName, lastName },
      select: { id: true, firstName: true, lastName: true },
    });
  }

  async findAllArchived() {
    const clients = await this.prisma.client.findMany({
      where: { isArchived: true },
      orderBy: { lastName: 'asc' },
      select: { id: true, firstName: true, lastName: true },
    });
    return clients;
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        programInstances: {
          include: { template: { select: { name: true } } },
          orderBy: { startDate: 'desc' },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      isArchived: client.isArchived,
      roadmaps: client.programInstances.map((pi) => ({
        roadmapId: pi.id,
        templateId: pi.templateId,
        templateName: pi.template.name,
        startDate: pi.startDate,
        isActive: pi.isActive,
      })),
    };
  }

  async activateRoadmap(clientId: string, templateId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Client ${clientId} not found`);
    }

    const template = await this.prisma.programTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template || !template.isActive) {
      throw new BadRequestException('Template not found or inactive');
    }

    const existing = await this.prisma.clientProgramInstance.findFirst({
      where: { clientId, templateId },
    });
    if (existing) {
      throw new BadRequestException('Client already has this roadmap');
    }

    const defaultProgramLengthDays =
      template.name === 'Benefits Access' ? 30 : 90;

    return this.prisma.$transaction(async (tx) => {
      const instance = await tx.clientProgramInstance.create({
        data: {
          clientId,
          templateId,
          startDate: new Date(),
          programLengthDays: defaultProgramLengthDays,
          isActive: true,
        },
      });

      const stages = await tx.templateStage.findMany({
        where: { templateId },
        orderBy: { orderIndex: 'asc' },
        include: { tasks: { orderBy: { orderIndex: 'asc' } } },
      });

      for (const stage of stages) {
        const si = await tx.stageInstance.create({
          data: {
            programInstanceId: instance.id,
            templateStageId: stage.id,
            activatedAt: stage.orderIndex === 0 ? new Date() : null,
          },
        });

        for (const task of stage.tasks) {
          await tx.taskInstance.create({
            data: {
              stageInstanceId: si.id,
              templateTaskId: task.id,
            },
          });
        }
      }

      return { id: instance.id };
    });
  }

  async archive(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }
    return this.prisma.client.update({
      where: { id },
      data: { isArchived: true },
      select: { id: true, isArchived: true },
    });
  }

  async unarchive(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }
    return this.prisma.client.update({
      where: { id },
      data: { isArchived: false },
      select: { id: true, isArchived: true },
    });
  }
}
