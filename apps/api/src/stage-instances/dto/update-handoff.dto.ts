import { z } from 'zod';

export const UpdateHandoffSchema = z.object({
  handoffSummary: z.string().trim().max(2000),
});

export type UpdateHandoffDto = z.infer<typeof UpdateHandoffSchema>;
