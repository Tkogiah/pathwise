import { z } from 'zod';

export const CreateNoteSchema = z.object({
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
  summary: z.string().max(200).optional(),
  body: z.string().min(1),
});

export type CreateNoteDto = z.infer<typeof CreateNoteSchema>;
