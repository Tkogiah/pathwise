import type { App } from '@slack/bolt';
import { extractFromThread, type ThreadMessage } from '../../extraction/prompt';
import { pathwiseClient } from '../../pathwise/client';
import { buildDraftBlocks } from '../blocks';

function getProgramSlug(channelId: string): string | null {
  const raw = process.env.CHANNEL_PROGRAM_MAP ?? '{}';
  try {
    const map = JSON.parse(raw) as Record<string, string>;
    return map[channelId] ?? null;
  } catch {
    return null;
  }
}

export function registerSlashHandlers(app: App): void {
  app.command('/case', async ({ command, ack, client, respond }) => {
    if (command.text.trim() !== 'extract') {
      await ack();
      await respond({ text: 'Unknown subcommand. Try `/case extract` in a channel.' });
      return;
    }

    await ack();

    const channelId = command.channel_id;
    const programSlug = getProgramSlug(channelId);

    if (!programSlug) {
      await respond({
        text: 'This channel is not mapped to a Pathwise program. Ask your admin to configure `CHANNEL_PROGRAM_MAP`.',
        response_type: 'ephemeral',
      });
      return;
    }

    try {
      // Slack includes thread_ts when the command is run inside a thread (undocumented but
      // reliable in practice). Prefer thread replies; fall back to channel history.
      const threadTs = (command as Record<string, unknown>).thread_ts as string | undefined;

      let rawMessages: Array<{ user?: string; text?: string; ts?: string }>;
      if (threadTs) {
        const replies = await client.conversations.replies({
          channel: channelId,
          ts: threadTs,
        });
        rawMessages = (replies.messages ?? []).filter((m) => m.text && m.ts);
      } else {
        const history = await client.conversations.history({ channel: channelId, limit: 20 });
        rawMessages = (history.messages ?? []).filter((m) => m.text && m.ts);
      }

      if (rawMessages.length === 0) {
        await respond({
          text: 'No messages found to extract from.',
          response_type: 'ephemeral',
        });
        return;
      }

      const messages: ThreadMessage[] = await Promise.all(
        rawMessages.map(async (m) => {
          const pl = await client.chat.getPermalink({
            channel: channelId,
            message_ts: m.ts!,
          });
          return {
            user: m.user ?? 'unknown',
            text: m.text!,
            ts: m.ts!,
            permalink: pl.permalink ?? '',
          };
        }),
      );

      const extraction = await extractFromThread(messages, programSlug);

      // POST draft to Pathwise immediately — store extraction id, not full DTO
      let extractionId: string;
      try {
        const { id } = await pathwiseClient.createExtraction({
          program_id: programSlug,
          client_ref: extraction.client_ref,
          stage: extraction.stage,
          task: extraction.task,
          status: extraction.status,
          notes: extraction.notes,
          evidence: messages.map((m) => ({
            source: 'slack' as const,
            permalink: m.permalink,
            author: m.user,
            timestamp: new Date(parseFloat(m.ts) * 1000).toISOString(),
          })),
          confidence: extraction.confidence,
          requires_review: true,
        });
        extractionId = id;
      } catch (err) {
        await respond({
          text: `Failed to create draft in Pathwise: ${String(err)}`,
          response_type: 'ephemeral',
        });
        return;
      }

      await client.chat.postMessage({
        channel: channelId,
        ...(threadTs ? { thread_ts: threadTs } : {}),
        blocks: buildDraftBlocks(extraction, programSlug, extractionId),
        text: `Draft extraction for ${extraction.client_ref} — review and approve or reject.`,
      });
    } catch (err) {
      console.error('[/case extract]', err);
      await respond({
        text: `Extraction failed unexpectedly: ${String(err)}`,
        response_type: 'ephemeral',
      });
    }
  });
}
