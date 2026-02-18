# Task 8.4 Plan Request — Demo Hosting Checklist (Vercel + Railway + Neon)

## Goal

Document the exact deployment steps for demo hosting.

## Requirements

- Neon: create Postgres DB, copy connection string
- Railway: deploy API from GitHub, set env vars (DATABASE_URL, JWT_SECRET, CORS)
- Vercel: deploy web from GitHub, set env vars (NEXT_PUBLIC_API_URL)
- Verify health endpoints and login flow
- Capture any free‑tier caveats

## Token Hygiene

Reminder: For implementation, skip running tests unless user explicitly asks. Note any lint/test failures as pre‑existing.
