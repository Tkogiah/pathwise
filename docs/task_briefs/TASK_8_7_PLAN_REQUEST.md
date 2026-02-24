# Task 8.7 Plan Request — Appointment Digest Pipeline

## Goal

Create a daily digest pipeline for upcoming appointments, stored in the database and ready for delivery via email in a later task.

## Requirements

- Add a `UserDigest` (or similar) table to store daily appointment summaries per user
- Implement a scheduled job that generates a daily digest for each user
- Digests must be idempotent (safe to re-run for same day/user)
- Include a minimal schema: userId, date, summary text, createdAt
- No email sending yet

## Token Hygiene

Reminder: For implementation, skip running tests unless user explicitly asks. Note any lint/test failures as pre‑existing.
