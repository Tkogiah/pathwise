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

export function registerReactionHandlers(app: App): void {
  app.event('reaction_added', async ({ event, client }) => {
    if (event.reaction !== 'white_check_mark') return;
    if (event.item.type !== 'message') return;

    const channelId = event.item.channel;
    const programSlug = getProgramSlug(channelId);
    // Silently ignore unmapped channels for emoji triggers — no disruption to normal Slack use
    if (!programSlug) return;

    const ts = event.item.ts;

    try {
      const result = await client.conversations.replies({ channel: channelId, ts });
      const rawMessages = (result.messages ?? []).filter((m) => m.text && m.ts);

      if (rawMessages.length === 0) return;

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
        await client.chat.postEphemeral({
          channel: channelId,
          user: event.user,
          text: `Failed to create draft in Pathwise: ${String(err)}`,
        });
        return;
      }

      await client.chat.postMessage({
        channel: channelId,
        thread_ts: ts,
        blocks: buildDraftBlocks(extraction, programSlug, extractionId),
        text: `Draft extraction for ${extraction.client_ref} — review and approve or reject.`,
      });
    } catch (err) {
      console.error('[reaction ✅]', err);
    }
  });
}
