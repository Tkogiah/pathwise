# Task 8.8 Plan Request — Digest UI Surface

## Goal

Expose the daily appointment digest inside the client experience so users can see what the background job produced.

## Requirements

- Add a simple UI panel above the Notes list in NotesRail showing today’s digest
- Use `GET /digest/me?date=YYYY-MM-DD` (protected, JWT-based)
- Client-side fetch with auth headers (no SSR fetch)
- Render digest lines by splitting on `\n` (no table formatting yet)
- Show a subtle “No appointments today” empty state
- Keep the UI compact and non-disruptive

## Token Hygiene

Reminder: For implementation, skip running tests unless user explicitly asks. Note any lint/test failures as pre‑existing.
