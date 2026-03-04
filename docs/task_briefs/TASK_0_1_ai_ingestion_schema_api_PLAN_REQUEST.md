# Task 0.1 Plan Request — AI Ingestion Schema + API (Pathwise)

## Goal

- Add the minimal schema and API endpoints needed to ingest Slack extractions into Pathwise with a human‑review workflow.

## Context

- New spec: `docs/AI_INGESTION_SPEC.md`
- This is the foundation for Slack ingestion; no Slack app in this task.

## Scope

- In scope:
  - Prisma schema additions for `extractions`, `facts`, `evidence`.
  - API endpoints to create draft extraction and approve/reject.
  - Tests: integration tests in `apps/api/test`, pure logic tests in `packages/engine/test` if needed.
  - Mock Slack payload fixture for reproducible tests.
- Out of scope:
  - Slack app implementation.
  - UI review dashboard.
  - Outlook integration.

## Constraints

- Preserve existing architecture and naming conventions.
- No PHI/PII storage; redaction rules must be enforced at ingestion.

## Tests (required)

- API integration tests (Nest + Supertest) for:
  - POST extraction draft
  - approve → facts created
  - reject → no facts created
- Unit tests for redaction and payload validation (engine or api utils as appropriate).

## Files (anticipated)

- `apps/api/prisma/schema.prisma`
- `apps/api/src/integrations/slack/*`
- `apps/api/test/*`
- `packages/engine/test/*` (if pure logic extracted there)
- `apps/api/test/fixtures/slack_event.json`
- `package.json` (root test script, if needed)

## Success Criteria

- Draft extractions can be ingested and reviewed via API.
- Evidence + confidence stored with each extraction.
- Tests run from a single root command.
