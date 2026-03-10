import type { ExtractionOutput } from '../extraction/prompt';

export function buildDraftBlocks(
  extraction: ExtractionOutput,
  programSlug: string,
  extractionId: string,
): object[] {
  const confidencePct = Math.round(extraction.confidence * 100);
  const isLowConfidence = extraction.confidence < 0.6;

  const blocks: object[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Draft Extraction — Review Required',
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Client:* ${extraction.client_ref}` },
        { type: 'mrkdwn', text: `*Program:* ${programSlug}` },
        { type: 'mrkdwn', text: `*Confidence:* ${confidencePct}%` },
      ],
    },
  ];

  const detailFields: object[] = [];
  if (extraction.stage)
    detailFields.push({ type: 'mrkdwn', text: `*Stage:* ${extraction.stage}` });
  if (extraction.task)
    detailFields.push({ type: 'mrkdwn', text: `*Task:* ${extraction.task}` });
  if (extraction.status)
    detailFields.push({
      type: 'mrkdwn',
      text: `*Status:* ${extraction.status}`,
    });
  if (extraction.notes)
    detailFields.push({ type: 'mrkdwn', text: `*Notes:* ${extraction.notes}` });

  if (detailFields.length > 0) {
    blocks.push({ type: 'section', fields: detailFields });
  }

  if (isLowConfidence) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':warning: *Low confidence — please verify all fields before approving.*',
      },
    });
  }

  blocks.push({ type: 'divider' });

  blocks.push({
    type: 'actions',
    block_id: 'extraction_actions',
    elements: [
      {
        type: 'button',
        text: { type: 'plain_text', text: 'Approve', emoji: true },
        style: 'primary',
        action_id: 'approve_extraction',
        value: extractionId,
      },
      {
        type: 'button',
        text: { type: 'plain_text', text: 'Edit & Approve', emoji: true },
        action_id: 'edit_extraction',
        value: JSON.stringify({
          id: extractionId,
          notes: extraction.notes ?? '',
          status: extraction.status ?? '',
        }),
      },
      {
        type: 'button',
        text: { type: 'plain_text', text: 'Reject', emoji: true },
        style: 'danger',
        action_id: 'reject_extraction',
        value: extractionId,
      },
    ],
  });

  return blocks;
}
