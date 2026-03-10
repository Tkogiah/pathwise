# Task 0.2 Plan Request — Slack Ingestion MVP

## Goal

- Build a Slack MVP that extracts structured facts from threads and posts a human‑review draft to Slack. Uses Pathwise ingestion API from Task 0.1.

## Context

- Spec: `docs/AI_INGESTION_SPEC.md`
- Task 0.1 provides schema + API endpoints.

## Scope

- In scope:
  - Slack App MVP in **Socket Mode** (local dev).
  - Manual triggers: `/case extract` + emoji reaction (✅).
  - Fetch thread messages, run extraction, post draft with evidence and confidence.
  - Slack approval flow: Approve / Reject / Edit (minimal edit optional).
  - Write approved payloads to Pathwise API using `INTEGRATION_API_KEY`.
- Out of scope:
  - Full auto‑listen.
  - Outlook ingestion.
  - Pathwise UI review dashboard.

## Constraints

- Manual trigger only.
- Evidence‑per‑field, redaction before sending to Pathwise.
- No PHI/PII storage.

## Tests (required)

- Unit tests for extraction + redaction pipeline.
- Slack payload fixture for reproducible tests.

## Files (anticipated)

- `apps/api/src/integrations/slack-bot/*` (new Slack ingestion service)
- `apps/api/test/fixtures/slack_thread.json`
- `docs/AI_INGESTION_SPEC.md` (if clarifications needed)

## Success Criteria

- Manual trigger in Slack produces a draft extraction.
- Approve sends payload to Pathwise ingestion API.
- Rejections are logged; no data written.
