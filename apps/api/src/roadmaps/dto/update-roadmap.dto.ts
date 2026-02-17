import { z } from 'zod';

export const UpdateRoadmapSchema = z
  .object({
    startDate: z.string().datetime().optional(),
    programLengthDays: z.number().int().min(1).nullable().optional(),
    overviewSummary: z.string().max(300).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
