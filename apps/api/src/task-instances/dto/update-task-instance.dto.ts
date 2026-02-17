import { z } from 'zod';

export const UpdateTaskInstanceSchema = z
  .object({
    authorId: z.string().min(1).optional(),
    status: z
      .enum(['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETE'])
      .optional(),
    assignedUserId: z.string().nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    dueNote: z.string().nullable().optional(),
    appointmentAt: z.string().datetime().nullable().optional(),
    appointmentNote: z.string().nullable().optional(),
    blockerType: z
      .enum(['INTERNAL', 'EXTERNAL', 'UNKNOWN'])
      .nullable()
      .optional(),
    blockerNote: z.string().nullable().optional(),
    isNa: z.boolean().optional(),
    naReason: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      const editableKeys = Object.keys(data).filter((k) => k !== 'authorId');
      return editableKeys.length > 0;
    },
    { message: 'At least one field besides authorId must be provided' },
  );

export type UpdateTaskInstanceDto = z.infer<typeof UpdateTaskInstanceSchema>;
