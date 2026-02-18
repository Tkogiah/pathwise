# Task 8.2 Plan Request — Auth API (Register + Login)

## Goal

Add minimal auth endpoints for demo use.

## Requirements

- POST /auth/register: create user, hash password, return JWT
- POST /auth/login: verify password, return JWT
- Optional: GET /auth/me (via JWT) to validate session
- Zod validation on request bodies
- JWT secret via env

## Token Hygiene

Reminder: For implementation, skip running tests unless user explicitly asks. Note any lint/test failures as pre‑existing.
