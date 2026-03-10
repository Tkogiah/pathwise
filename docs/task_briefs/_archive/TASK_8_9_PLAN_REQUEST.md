# Task 8.9 Plan Request — Email Delivery for Daily Digest

## Goal

Send the daily appointment digest via email once the pipeline and UI are stable.

## Requirements

- Integrate an email provider (e.g., Resend or SendGrid)
- Add a feature flag/env var to enable email sending
- Use the existing digest output (no new formatting logic in the job)
- Log delivery success/failure for each user
- Ensure retries are safe and idempotent
- Keep secrets out of source control (update `.env.example` + docs, not `.env`)
- Gate sending on both `DIGEST_EMAIL_ENABLED === 'true'` and `RESEND_API_KEY` present
- Avoid N+1 queries when fetching digests + user emails

## Token Hygiene

Reminder: For implementation, skip running tests unless user explicitly asks. Note any lint/test failures as pre‑existing.
