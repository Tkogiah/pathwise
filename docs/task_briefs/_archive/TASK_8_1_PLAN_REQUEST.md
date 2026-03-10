# Task 8.1 Plan Request — Auth Schema + Hashing (Demo)

## Goal

Add minimal auth fields and password hashing for demo signup/login.

## Requirements

- Add auth fields to User model (email unique, passwordHash)
- Backfill/migrate existing seed users
- Use bcrypt for hashing
- Keep demo‑only scope (no reset/verify)

## Notes

- JWT auth will be added in 8.2/8.3.

## Token Hygiene

Reminder: For implementation, skip running tests unless user explicitly asks. Note any lint/test failures as pre‑existing.
