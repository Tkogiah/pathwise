# AI Ingestion Spec — Slack → Pathwise (MVP)

## Purpose

Pathwise should become a backend intelligence layer that **extracts structured program updates from Slack** without changing case manager workflows. The system generates **human‑reviewed, evidence‑backed snapshots** for management and reporting, while avoiding storage of sensitive data.

## Goals

- Reduce manual updates by extracting structured facts from Slack conversations.
- Keep case managers in Slack; Pathwise is primarily a **visualization + audit backend**.
- Provide management‑level visibility: progress, blockers, appointments, and outcomes.
- Generate exportable snapshots (CSV/JSON) for grants/reporting.

## Non‑Goals (MVP)

- No automatic writes to CharityTracker.
- No Outlook integration (MVP will output an email‑format digest template instead).
- No fully autonomous auto‑listen writes without human approval.

---

## MVP Operating Model

### Trigger Model

- **MVP:** Manual trigger only (emoji or slash command).
- **Target:** Auto‑listen with the same review process once accuracy is validated.

### Review & Approval

- Draft extractions are posted **in Slack** for review.
- Approval and clarification requests happen in Slack.
- Pathwise stores only **approved** facts for snapshots.

### Client Linking (Program‑Scoped)

- Use fuzzy matching against a **program‑scoped trie** of client names.
- If ambiguous (multiple matches), the bot prompts for confirmation in Slack.
- The program context is derived from the channel mapping (channels mapped to a program ID).

---

## Data Contract (Slack → Pathwise)

The bot sends structured extraction payloads to Pathwise. Example:

```json
{
  "program_id": "mthp",
  "client_ref": "frank_santos",
  "stage": "Housing Search & Applications",
  "task": "Assist with housing applications",
  "status": "in_progress",
  "notes": "Assisted Frank with housing applications today.",
  "evidence": [
    {
      "source": "slack",
      "permalink": "https://...",
      "author": "Ryan",
      "timestamp": "2026-03-04T22:19:00Z"
    }
  ],
  "confidence": 0.74,
  "requires_review": true
}
```

### Evidence Rules

- Every extracted field must cite a Slack permalink.
- Slack author and timestamp are stored for traceability.

### Confidence Rules

- Confidence is a 0–1 numeric score.
- Low confidence → require clarification prompt.

---

## Privacy & Redaction (Hard Rules)

Never store or output:

- SSN
- DOB
- Exact addresses
- Phone numbers
- Email addresses
- Case numbers
- Benefit IDs
- Income amounts

Notes must be **redacted/abstracted** before storing in Pathwise.

---

## Slack UX (MVP)

### Trigger Options

- `/case extract` (slash command in a thread)
- ✅ reaction (emoji trigger) — optional second trigger

### Slack Draft Response

- Summary
- Extracted fields (with confidence + evidence)
- “Uncertain / needs clarification” questions
- Buttons: **Approve**, **Edit**, **Reject**

### Clarification Loop

- If multiple clients match, bot asks a clarifying question in thread.
- If task/stage is ambiguous, bot asks for selection or confirmation.

---

## Pathwise Data Model (MVP Additions)

### Suggested New Tables

- `extractions`
  - raw_text (redacted)
  - structured_payload
  - confidence
  - status: pending/approved/rejected
  - program_id, client_id
  - created_at, approved_at

- `facts`
  - client_id
  - stage_id / task_id (if mapped)
  - status
  - notes (redacted)
  - evidence_links[]
  - source: slack
  - created_at

- `evidence`
  - extraction_id
  - permalink
  - author
  - timestamp

### Snapshot Generation

- Pathwise computes program snapshot from **approved facts** only.
- Snapshots are derived, not manually edited, unless corrected via review.

---

## Exports (MVP)

- CSV + JSON exports of:
  - clients
  - stage progress
  - task completion
  - appointments
  - outcomes (graduated vs not)

---

## Safety Mode (MVP)

- Single‑user allowlist (only your Slack user can approve).
- Manual trigger only.
- Dry‑run supported: extraction + review only, no snapshot writes.

---

## Phased Rollout

### Phase 1 — Slack MVP (Manual Trigger)

- Slack app + manual trigger
- Extraction + evidence
- Slack review + approval
- Pathwise stores approved facts

### Phase 2 — Email Digest Template

- Generate email‑format digest from approved facts
- No Outlook integration

### Phase 3 — Auto‑Listen (Guarded)

- Auto‑listen in program channels
- Continue human approval
- Add thresholds + ignore rules

### Phase 4 — Outlook Integration (Optional)

- Ingest emails from Outlook
- Apply same extraction + review

---

## Open Questions (to resolve before build)

- Exact list of top 10–15 extractable fields for the program.
- Slack channel → program mapping source of truth.
- Where to store program‑scoped trie (DB table vs in‑memory cache).
- Whether review UI will eventually move into Pathwise or remain Slack‑only.
