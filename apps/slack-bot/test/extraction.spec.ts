import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted ensures mockCreate is available when the vi.mock factory runs (which is hoisted
// before any imports). Without this, mockCreate would be undefined in the factory.
const mockCreate = vi.hoisted(() => vi.fn());

vi.mock('@anthropic-ai/sdk', () => ({
  // Must use regular function (not arrow) so it can be used as a constructor with `new`
  default: vi.fn(function () {
    return { messages: { create: mockCreate } };
  }),
}));

import { redactText } from '../src/extraction/redact';
import { extractFromThread } from '../src/extraction/prompt';
import type { ThreadMessage } from '../src/extraction/prompt';
import fixture from './fixtures/slack_thread.json';

const threadMessages: ThreadMessage[] = fixture.messages;

describe('redactText', () => {
  it('masks SSN', () => {
    const { redacted, categories } = redactText(
      'Patient SSN: 123-45-6789 on file.',
    );
    expect(categories).toContain('SSN');
    expect(redacted).not.toContain('123-45-6789');
    expect(redacted).toContain('[SSN REDACTED]');
  });

  it('masks phone number', () => {
    const { redacted, categories } = redactText(
      'Call 555-867-5309 for follow-up.',
    );
    expect(categories).toContain('PHONE');
    expect(redacted).not.toContain('867-5309');
  });

  it('masks email address', () => {
    const { redacted, categories } = redactText('Email: client@example.com');
    expect(categories).toContain('EMAIL');
    expect(redacted).not.toContain('client@example.com');
  });

  it('masks DOB', () => {
    const { redacted, categories } = redactText('DOB: 04/15/1990');
    expect(categories).toContain('DOB');
    expect(redacted).not.toContain('04/15/1990');
  });

  it('masks income amount', () => {
    const { redacted, categories } = redactText('Income is $1,200/month.');
    expect(categories).toContain('INCOME_AMOUNT');
    expect(redacted).not.toContain('$1,200');
  });

  it('returns clean text unchanged', () => {
    const clean = 'Assisted client with housing application. No issues.';
    const { redacted, categories } = redactText(clean);
    expect(categories).toHaveLength(0);
    expect(redacted).toBe(clean);
  });

  it('masks multiple PII categories in same text', () => {
    const { categories } = redactText(
      'SSN 123-45-6789 and DOB 04/15/1990 provided.',
    );
    expect(categories).toContain('SSN');
    expect(categories).toContain('DOB');
  });
});

describe('extractFromThread', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns valid extraction from well-formed Claude response', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            client_ref: 'frank_santos',
            stage: 'Housing Search & Applications',
            task: 'Assist with housing applications',
            status: 'in_progress',
            notes: 'Assisted Frank with housing applications today.',
            confidence: 0.82,
          }),
        },
      ],
    });

    const result = await extractFromThread(threadMessages, 'housing');

    expect(result.client_ref).toBe('frank_santos');
    expect(result.stage).toBe('Housing Search & Applications');
    expect(result.status).toBe('in_progress');
    expect(result.confidence).toBe(0.82);
  });

  it('redacts PII that Claude includes in notes', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            client_ref: 'frank_santos',
            notes: 'Client SSN is 123-45-6789.',
            confidence: 0.9,
          }),
        },
      ],
    });

    const result = await extractFromThread(threadMessages, 'housing');

    expect(result.notes).not.toContain('123-45-6789');
    expect(result.notes).toContain('[SSN REDACTED]');
  });

  it('falls back gracefully on JSON parse failure', async () => {
    mockCreate.mockResolvedValue({
      content: [
        { type: 'text', text: 'Here is the extraction: not valid json' },
      ],
    });

    const result = await extractFromThread(threadMessages, 'housing');

    expect(result.client_ref).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.5);
  });

  it('falls back gracefully on schema validation failure', async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          // confidence out of range → fails ExtractionOutputSchema
          text: JSON.stringify({ client_ref: 'someone', confidence: 5.0 }),
        },
      ],
    });

    const result = await extractFromThread(threadMessages, 'housing');

    expect(result.client_ref).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.5);
  });

  it('falls back gracefully on Anthropic API failure', async () => {
    mockCreate.mockRejectedValue(new Error('Network error'));

    const result = await extractFromThread(threadMessages, 'housing');

    expect(result.client_ref).toBe('unknown');
    expect(result.confidence).toBeLessThan(0.5);
  });
});
