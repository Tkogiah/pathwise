import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { redactText } from './redact';

export const ExtractionOutputSchema = z.object({
  client_ref: z.string().min(1),
  stage: z.string().optional(),
  task: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export type ExtractionOutput = z.infer<typeof ExtractionOutputSchema>;

export interface ThreadMessage {
  user: string;
  text: string;
  ts: string;
  permalink: string;
}

const EXTRACTION_PROMPT = (programSlug: string, threadText: string) => `\
You are extracting structured case management facts from a Slack conversation.
Program: ${programSlug}

Conversation:
${threadText}

Extract the following as a single JSON object. Only include optional fields if clearly present.
{
  "client_ref": "first_last (lowercase snake_case, required — if uncertain set confidence < 0.5)",
  "stage": "program stage name, optional",
  "task": "task name within the stage, optional",
  "status": "one of: not_started | in_progress | blocked | complete, optional",
  "notes": "brief redacted clinical note, optional — DO NOT include SSN, phone, DOB, address, case numbers, benefit IDs, or income amounts",
  "confidence": 0.0 to 1.0
}

Respond with only valid JSON. No explanation, no markdown fences.`;

/**
 * Calls Claude to extract structured facts from Slack thread messages.
 * Notes are redacted before returning. Falls back to low-confidence on any failure.
 */
export async function extractFromThread(
  messages: ThreadMessage[],
  programSlug: string,
): Promise<ExtractionOutput> {
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';
  // Instantiated inside function so tests can mock the constructor per-call
  const client = new Anthropic();

  const threadText = messages
    .map((m) => {
      const ts = new Date(parseFloat(m.ts) * 1000).toISOString();
      return `[${m.user} at ${ts}]: ${m.text}`;
    })
    .join('\n');

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 512,
      messages: [
        { role: 'user', content: EXTRACTION_PROMPT(programSlug, threadText) },
      ],
    });

    const rawText =
      response.content[0]?.type === 'text'
        ? response.content[0].text.trim()
        : '';

    const parsed = JSON.parse(rawText) as unknown;
    const validated = ExtractionOutputSchema.parse(parsed);

    // Redact notes as a safety net before the payload reaches Pathwise
    if (validated.notes) {
      const { redacted } = redactText(validated.notes);
      validated.notes = redacted;
    }

    return validated;
  } catch {
    // API failure, JSON parse error, or schema mismatch → low-confidence fallback
    return { client_ref: 'unknown', confidence: 0.1 };
  }
}
