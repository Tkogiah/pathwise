import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskInput, StageInput, TaskStatus } from '@pathwise/types';
import {
  getStageStatus,
  getStageProgress,
  getRedTaskCount,
  getTaskColor,
  isTaskLocked,
  isTaskOverdue,
  isStageBehind,
} from '@pathwise/engine';

@Injectable()
export class RoadmapsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const instance = await this.prisma.clientProgramInstance.findUnique({
      where: { id },
      include: {
        client: { select: { firstName: true, lastName: true } },
        template: { select: { name: true } },
        stageInstances: {
          include: {
            templateStage: true,
            taskInstances: {
              include: {
                templateTask: true,
                assignedUser: { select: { id: true, name: true } },
              },
              orderBy: { templateTask: { orderIndex: 'asc' } },
            },
          },
          orderBy: { templateStage: { orderIndex: 'asc' } },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException(`Roadmap ${id} not found`);
    }

    return this.toViewModel(instance);
  }

  async update(
    id: string,
    dto: {
      startDate?: string;
      programLengthDays?: number | null;
      overviewSummary?: string | null;
    },
  ) {
    const instance = await this.prisma.clientProgramInstance.findUnique({
      where: { id },
    });
    if (!instance) {
      throw new NotFoundException(`Roadmap ${id} not found`);
    }

    const updateData: Record<string, unknown> = {};
    if (dto.startDate !== undefined) {
      updateData.startDate = new Date(dto.startDate);
    }
    if (dto.programLengthDays !== undefined) {
      updateData.programLengthDays = dto.programLengthDays;
    }
    if (dto.overviewSummary !== undefined) {
      updateData.overviewSummary = dto.overviewSummary;
    }

    await this.prisma.clientProgramInstance.update({
      where: { id },
      data: updateData,
    });

    return this.findOne(id);
  }

  private toViewModel(
    instance: NonNullable<Awaited<ReturnType<typeof this.findOneRaw>>>,
  ) {
    const now = new Date();

    // Build all TaskInputs across the entire roadmap for isTaskLocked
    const allTaskInputs: TaskInput[] = instance.stageInstances.flatMap((si) =>
      si.taskInstances.map((ti) => this.toTaskInput(ti)),
    );

    // Build all StageInputs up front for isStageBehind
    const allStageInputs: StageInput[] = instance.stageInstances.map((si) => ({
      id: si.id,
      orderIndex: si.templateStage.orderIndex,
      activatedAt: si.activatedAt,
      tasks: si.taskInstances.map((ti) => this.toTaskInput(ti)),
    }));

    const stages = instance.stageInstances.map((si) => {
      const stageTaskInputs = si.taskInstances.map((ti) =>
        this.toTaskInput(ti),
      );
      const stageInput: StageInput = {
        id: si.id,
        orderIndex: si.templateStage.orderIndex,
        activatedAt: si.activatedAt,
        tasks: stageTaskInputs,
      };

      const tasks = si.taskInstances.map((ti) => {
        const taskInput = this.toTaskInput(ti);
        return {
          id: ti.id,
          title: ti.templateTask.title,
          description: ti.templateTask.description,
          orderIndex: ti.templateTask.orderIndex,
          status: ti.status,
          color: getTaskColor(taskInput, allTaskInputs, now),
          isLocked: isTaskLocked(taskInput, allTaskInputs),
          isOverdue: isTaskOverdue(taskInput, now),
          isNa: ti.isNa,
          naReason: ti.naReason,
          isRequired: ti.templateTask.isRequired,
          dueDate: ti.dueDate,
          assignedUser: ti.assignedUser,
          blockerType: ti.blockerType,
          blockerNote: ti.blockerNote,
          dependsOnTaskId: ti.templateTask.dependsOnTaskId,
          dueNote: ti.dueNote,
          appointmentAt: ti.appointmentAt,
          appointmentNote: ti.appointmentNote,
        };
      });

      return {
        id: si.id,
        title: si.templateStage.title,
        orderIndex: si.templateStage.orderIndex,
        iconName: si.templateStage.iconName,
        status: getStageStatus(stageInput, now),
        isBehind: isStageBehind(stageInput, allStageInputs, now),
        progress: getStageProgress(stageInput),
        redTaskCount: getRedTaskCount(stageInput, now),
        activatedAt: si.activatedAt,
        completedAt: si.completedAt,
        handoffSummary: si.handoffSummary,
        timelineLabel: si.templateStage.timelineLabel,
        recommendedDurationDays: si.templateStage.recommendedDurationDays,
        tasks,
      };
    });

    return {
      id: instance.id,
      templateName: instance.template.name,
      clientName: `${instance.client.firstName} ${instance.client.lastName}`,
      startDate: instance.startDate,
      programLengthDays: instance.programLengthDays,
      overviewSummary: instance.overviewSummary,
      isActive: instance.isActive,
      stages,
    };
  }

  private toTaskInput(ti: {
    id: string;
    status: string;
    isNa: boolean;
    dueDate: Date | null;
    templateTask: {
      id: string;
      isRequired: boolean;
      dependsOnTaskId: string | null;
    };
  }): TaskInput {
    return {
      // Use templateTask id for engine dependency resolution
      id: ti.templateTask.id,
      status: ti.status as TaskStatus,
      isNa: ti.isNa,
      isRequired: ti.templateTask.isRequired,
      dueDate: ti.dueDate,
      dependsOnTaskId: ti.templateTask.dependsOnTaskId,
    };
  }

  // Helper for type inference only — same query as findOne but returns raw
  private findOneRaw(id: string) {
    return this.prisma.clientProgramInstance.findUnique({
      where: { id },
      include: {
        client: { select: { firstName: true, lastName: true } },
        template: { select: { name: true } },
        stageInstances: {
          include: {
            templateStage: true,
            taskInstances: {
              include: {
                templateTask: true,
                assignedUser: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  }
}
