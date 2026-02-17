import { z } from 'zod';

export const UpdateNoteSchema = z
  .object({
    authorId: z.string().min(1),
    label: z
      .enum([
        'APPOINTMENT',
        'DOCUMENTS',
        'HOUSING_SEARCH',
        'VOUCHER',
        'BENEFITS',
        'OUTREACH',
        'ID_VERIFICATION',
        'BARRIER',
        'TASK_UPDATE',
        'OTHER',
      ])
      .optional(),
    summary: z.string().max(200).nullable().optional(),
    body: z.string().min(1).optional(),
  })
  .refine(
    (data) => {
      const editableKeys = Object.keys(data).filter((k) => k !== 'authorId');
      return editableKeys.length > 0;
    },
    { message: 'At least one field besides authorId must be provided' },
  );

export type UpdateNoteDto = z.infer<typeof UpdateNoteSchema>;
