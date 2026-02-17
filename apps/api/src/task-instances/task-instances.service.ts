import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskInput, TaskStatus } from '@pathwise/types';
import { isTaskLocked } from '@pathwise/engine';
import { UpdateTaskInstanceDto } from './dto/update-task-instance.dto';
import {
  Prisma,
  TaskStatus as PrismaTaskStatus,
  BlockerType as PrismaBlockerType,
  NoteLabel,
} from '@prisma/client';

type TaskInstanceWithContext = Prisma.TaskInstanceGetPayload<{
  include: {
    templateTask: true;
    stageInstance: {
      include: {
        programInstance: {
          include: {
            stageInstances: {
              include: {
                taskInstances: { include: { templateTask: true } };
              };
            };
          };
        };
      };
    };
  };
}>;

@Injectable()
export class TaskInstancesService {
  constructor(private prisma: PrismaService) {}

  async update(id: string, dto: UpdateTaskInstanceDto) {
    // Load the task with its template task and the full program instance context
    const taskInstance: TaskInstanceWithContext | null =
      await this.prisma.taskInstance.findUnique({
        where: { id },
        include: {
          templateTask: true,
          stageInstance: {
            include: {
              programInstance: {
                include: {
                  stageInstances: {
                    include: {
                      taskInstances: {
                        include: { templateTask: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

    if (!taskInstance) {
      throw new NotFoundException(`Task instance ${id} not found`);
    }

    // Build all TaskInputs across the entire program using templateTask.id
    const allTaskInputs: TaskInput[] =
      taskInstance.stageInstance.programInstance.stageInstances.flatMap((si) =>
        si.taskInstances.map((ti) => ({
          id: ti.templateTask.id,
          status: ti.status as TaskStatus,
          isNa: ti.isNa,
          isRequired: ti.templateTask.isRequired,
          dueDate: ti.dueDate,
          dependsOnTaskId: ti.templateTask.dependsOnTaskId,
        })),
      );

    const thisTaskInput: TaskInput = {
      id: taskInstance.templateTask.id,
      status: taskInstance.status as TaskStatus,
      isNa: taskInstance.isNa,
      isRequired: taskInstance.templateTask.isRequired,
      dueDate: taskInstance.dueDate,
      dependsOnTaskId: taskInstance.templateTask.dependsOnTaskId,
    };

    if (isTaskLocked(thisTaskInput, allTaskInputs)) {
      throw new UnprocessableEntityException(
        'Cannot update a locked task. Its dependency is not yet complete.',
      );
    }

    // Build the Prisma update data with side effects
    const updateData: Prisma.TaskInstanceUpdateInput = {};

    if (dto.status !== undefined) {
      updateData.status = dto.status as PrismaTaskStatus;

      // Side effect: completedAt
      if (dto.status === 'COMPLETE') {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }

      // Side effect: clear blocker when moving away from BLOCKED
      if (
        dto.status !== 'BLOCKED' &&
        taskInstance.status === 'BLOCKED' &&
        dto.blockerType === undefined
      ) {
        updateData.blockerType = null;
        updateData.blockerNote = null;
      }
    }

    if (dto.assignedUserId !== undefined) {
      updateData.assignedUser =
        dto.assignedUserId === null
          ? { disconnect: true }
          : { connect: { id: dto.assignedUserId } };
    }

    if (dto.dueDate !== undefined) {
      updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }

    if (dto.dueNote !== undefined) {
      updateData.dueNote = dto.dueNote;
    }

    const prevAppointmentAt = taskInstance.appointmentAt;
    const prevAppointmentNote = taskInstance.appointmentNote ?? null;
    let nextAppointmentAt = prevAppointmentAt;
    let nextAppointmentNote = prevAppointmentNote;

    if (dto.appointmentAt !== undefined) {
      nextAppointmentAt = dto.appointmentAt
        ? new Date(dto.appointmentAt)
        : null;
      updateData.appointmentAt = nextAppointmentAt;
    }

    if (dto.appointmentNote !== undefined) {
      nextAppointmentNote = dto.appointmentNote;
      updateData.appointmentNote = dto.appointmentNote;
    }

    if (dto.blockerType !== undefined) {
      updateData.blockerType = dto.blockerType as PrismaBlockerType | null;
      // Clear blocker note when blocker type is cleared
      if (dto.blockerType === null && dto.blockerNote === undefined) {
        updateData.blockerNote = null;
      }
    }

    if (dto.blockerNote !== undefined) {
      updateData.blockerNote = dto.blockerNote;
    }

    if (dto.isNa !== undefined) {
      updateData.isNa = dto.isNa;
    }

    if (dto.naReason !== undefined) {
      updateData.naReason = dto.naReason;
    }

    const updatedTask = await this.prisma.taskInstance.update({
      where: { id },
      data: updateData,
    });

    const appointmentTouched =
      dto.appointmentAt !== undefined || dto.appointmentNote !== undefined;
    const prevTime = prevAppointmentAt?.getTime() ?? null;
    const nextTime = nextAppointmentAt?.getTime() ?? null;
    const appointmentChanged =
      appointmentTouched &&
      (prevTime !== nextTime || prevAppointmentNote !== nextAppointmentNote);

    if (appointmentChanged && dto.authorId) {
      const formatDateTime = (date: Date | null) =>
        date
          ? date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })
          : 'unscheduled';

      let body = '';
      if (prevAppointmentAt && !nextAppointmentAt) {
        body = `Appointment removed (was ${formatDateTime(
          prevAppointmentAt,
        )}).`;
      } else if (!prevAppointmentAt && nextAppointmentAt) {
        body = `Appointment scheduled for ${formatDateTime(
          nextAppointmentAt,
        )}.`;
      } else if (
        prevAppointmentAt &&
        nextAppointmentAt &&
        prevTime !== nextTime
      ) {
        body = `Appointment updated to ${formatDateTime(
          nextAppointmentAt,
        )} (was ${formatDateTime(prevAppointmentAt)}).`;
      } else if (prevAppointmentNote !== nextAppointmentNote) {
        body = 'Appointment note updated.';
      }

      if (nextAppointmentNote) {
        body = `${body} Note: ${nextAppointmentNote}`;
      } else if (prevAppointmentNote && !nextAppointmentNote) {
        body = `${body} Previous note cleared.`;
      }

      if (body.trim()) {
        await this.prisma.taskNote.create({
          data: {
            taskInstanceId: id,
            authorId: dto.authorId,
            label: NoteLabel.APPOINTMENT,
            body,
          },
        });
      }
    }

    return updatedTask;
  }
}
