# Task 0.2 Plan — Slack Ingestion MVP

## Goal
- Build a Slack MVP that extracts structured facts from threads, posts a review draft in Slack, and writes approved payloads to Pathwise.

## Plan

### 1) New Workspace: `apps/slack-bot/`
Create a standalone Socket Mode bot workspace so it can run independently from the NestJS API.

Structure:
```
apps/slack-bot/
  package.json          # @pathwise/slack-bot
  tsconfig.json
  src/
    index.ts            # app entry
    extraction/
      prompt.ts         # Claude extraction
      redact.ts         # pre-send redaction
    slack/
      handlers/
        slash.ts        # /case extract
        reaction.ts     # ✅ emoji trigger
        action.ts       # Approve/Edit/Reject
      blocks.ts         # Block Kit draft
    pathwise/
      client.ts         # HTTP client wrapper
  test/
    extraction.spec.ts
    fixtures/
      slack_thread.json
  .env.example
```

### 2) Env Vars
Add to `apps/slack-bot/.env.example`:
- `SLACK_BOT_TOKEN=`
- `SLACK_APP_TOKEN=` (xapp-... for Socket Mode)
- `PATHWISE_API_URL=`
- `INTEGRATION_API_KEY=`
- `ANTHROPIC_API_KEY=`
- `ANTHROPIC_MODEL=claude-haiku-4-5-20251001` (default)
- `ALLOWED_APPROVER_SLACK_IDS=U123,U456`
- `CHANNEL_PROGRAM_MAP='{"C123":"housing"}'`

### 3) Trigger Handlers
- `/case extract` slash command
- ✅ emoji reaction

Both triggers:
1. Ack immediately.
2. Fetch thread via `conversations.replies`.
3. Derive `program_slug` from `CHANNEL_PROGRAM_MAP`.
   - If missing: respond with ephemeral error and exit.
4. Run extraction pipeline → redacted payload.
5. POST draft to Pathwise API (status=PENDING).
   - If POST fails: respond with ephemeral error and exit.
6. Post Slack draft with Approve/Edit/Reject buttons.
   - Store only `extraction_id` in `private_metadata` (no full DTO).

### 4) Extraction Pipeline
- Serialize thread messages with author + timestamp.
- Call Claude → JSON response matching CreateExtractionDto shape.
- Validate with Zod; on parse failure set low confidence + requires_review.
- Run `redact()` to strip PII before sending to Pathwise.

### 5) Block Kit Draft Message
- Show: client_ref, program_slug, confidence, stage/task/status/notes, evidence.
- If confidence < 0.6, display warning.
- Buttons: Approve, Edit, Reject.

### 6) Approve/Edit/Reject Flow
- **Approve**: PATCH `/integrations/slack/extractions/:id/approve`.
- **Reject**: PATCH `/integrations/slack/extractions/:id/reject`.
- **Edit**: Slack modal (notes + status only), then approve flow.
- **Allowlist**: Only IDs in `ALLOWED_APPROVER_SLACK_IDS` can approve/reject/edit.
  - Others receive ephemeral "not authorized" error.

### 7) Pathwise API Client
- Thin wrapper around Task 0.1 endpoints.
- Sets `x-api-key` header.
- Throws on non‑2xx; handler catches and posts Slack error.

### 8) Tests (unit only)
- `test/extraction.spec.ts`:
  - Fixture → valid CreateExtractionDto shape
  - Redaction strips SSN/phone/email
  - Low confidence sets requires_review
  - Claude parse failure handled gracefully
- No live Slack or Pathwise integration tests in MVP.

## Files
- `apps/slack-bot/**`
- `package.json` (root scripts: `dev:bot`, `test:bot`)
- `eslint.config.mjs` (add slack-bot paths)

## Notes
- Socket Mode for local dev. HTTP Events can follow later.
- Drafts are created in Pathwise immediately; approval operates by extraction id.
