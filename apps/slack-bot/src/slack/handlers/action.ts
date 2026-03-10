import type { App, BlockAction, ButtonAction } from '@slack/bolt';
import { pathwiseClient } from '../../pathwise/client';

interface EditMetadata {
  id: string;
  notes: string;
  status: string;
}

function isAllowed(userId: string): boolean {
  const allowlist = process.env.ALLOWED_APPROVER_SLACK_IDS;
  if (!allowlist) return false; // explicit allowlist required; empty env = no one allowed
  return allowlist
    .split(',')
    .map((s) => s.trim())
    .includes(userId);
}

export function registerActionHandlers(app: App): void {
  app.action<BlockAction<ButtonAction>>(
    'approve_extraction',
    async ({ action, ack, respond, body }) => {
      await ack();

      const userId = body.user.id;
      if (!isAllowed(userId)) {
        await respond({
          text: 'You are not authorized to approve extractions.',
          replace_original: false,
          response_type: 'ephemeral',
        });
        return;
      }

      const extractionId = action.value;
      try {
        await pathwiseClient.approve(extractionId);
        await respond({
          replace_original: true,
          text: `✅ Approved by <@${userId}>`,
          blocks: [],
        });
      } catch (err) {
        await respond({
          text: `Failed to approve: ${String(err)}`,
          replace_original: false,
          response_type: 'ephemeral',
        });
      }
    },
  );

  app.action<BlockAction<ButtonAction>>(
    'reject_extraction',
    async ({ action, ack, respond, body }) => {
      await ack();

      const userId = body.user.id;
      if (!isAllowed(userId)) {
        await respond({
          text: 'You are not authorized to reject extractions.',
          replace_original: false,
          response_type: 'ephemeral',
        });
        return;
      }

      const extractionId = action.value;
      try {
        await pathwiseClient.reject(extractionId);
        await respond({
          replace_original: true,
          text: `❌ Rejected by <@${userId}>`,
          blocks: [],
        });
      } catch (err) {
        await respond({
          text: `Failed to reject: ${String(err)}`,
          replace_original: false,
          response_type: 'ephemeral',
        });
      }
    },
  );

  app.action<BlockAction<ButtonAction>>(
    'edit_extraction',
    async ({ action, ack, client, body }) => {
      await ack();

      const userId = body.user.id;
      if (!isAllowed(userId)) return; // silently ignore; can't easily respond ephemerally here

      const metadata = JSON.parse(action.value) as EditMetadata;

      const statusOptions = [
        {
          text: { type: 'plain_text' as const, text: 'Not Started' },
          value: 'not_started',
        },
        {
          text: { type: 'plain_text' as const, text: 'In Progress' },
          value: 'in_progress',
        },
        {
          text: { type: 'plain_text' as const, text: 'Blocked' },
          value: 'blocked',
        },
        {
          text: { type: 'plain_text' as const, text: 'Complete' },
          value: 'complete',
        },
      ];

      const initialOption = statusOptions.find(
        (o) => o.value === metadata.status,
      );

      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'edit_extraction_modal',
          private_metadata: metadata.id,
          title: { type: 'plain_text', text: 'Edit & Approve' },
          submit: { type: 'plain_text', text: 'Approve' },
          close: { type: 'plain_text', text: 'Cancel' },
          blocks: [
            {
              type: 'input',
              block_id: 'notes_block',
              label: { type: 'plain_text', text: 'Notes' },
              element: {
                type: 'plain_text_input',
                action_id: 'notes_input',
                multiline: true,
                initial_value: metadata.notes,
              },
              optional: true,
            },
            {
              type: 'input',
              block_id: 'status_block',
              label: { type: 'plain_text', text: 'Status' },
              element: {
                type: 'static_select',
                action_id: 'status_input',
                placeholder: { type: 'plain_text', text: 'Select status' },
                options: statusOptions,
                ...(initialOption ? { initial_option: initialOption } : {}),
              },
              optional: true,
            },
          ],
        },
      });
    },
  );

  // Modal submission: approve the existing PENDING extraction.
  // TODO: add a PATCH /extractions/:id endpoint to update notes/status before approving.
  app.view('edit_extraction_modal', async ({ ack, view, body }) => {
    await ack();
    const userId = body.user.id;
    const extractionId = view.private_metadata;

    try {
      await pathwiseClient.approve(extractionId);
      console.log(
        `[edit] extraction ${extractionId} approved by ${userId} after edit`,
      );
    } catch (err) {
      console.error(
        `[edit] failed to approve extraction ${extractionId}:`,
        err,
      );
    }
  });
}
