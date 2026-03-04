import { z } from 'zod';

export const EvidenceSchema = z.object({
  source: z.literal('slack'),
  permalink: z.string().url(),
  author: z.string().min(1),
  timestamp: z.string().datetime(),
});

export const CreateExtractionSchema = z.object({
  program_id: z.string().min(1),
  client_ref: z.string().min(1),
  stage: z.string().optional(),
  task: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  evidence: z.array(EvidenceSchema).min(1),
  confidence: z.number().min(0).max(1),
  requires_review: z.boolean(),
});

export type CreateExtractionDto = z.infer<typeof CreateExtractionSchema>;
