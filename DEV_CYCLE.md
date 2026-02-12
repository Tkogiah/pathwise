# Development Cycle (CTO/Senior Engineer View)

## 1. Product Framing + Success Criteria

- Define the problem, the target user, and success metrics.
- Lock MVP scope and explicitly list what is out of scope.

Why first: Without clarity, engineering drifts and you waste weeks building the wrong thing.

## 2. Architecture + Risk Plan

- Identify risks (data model, engine rules, UX clarity, mobile layout).
- Choose stack, repo layout, and API surface.

Why now: Prevents rework and creates clean module boundaries early.

## 3. Foundation Setup

- Repo structure, linting, formatting, tests, CI skeleton.
- Local dev environment (Docker + DB).

Why now: A clean base preserves velocity and reduces future friction.

## 4. Data Model + Migrations + Seed Data

- Implement schema and seed demo data.
- Build engine rules as pure functions.

Why now: Realistic data drives UI correctness and reduces drift.

## 5. Thin Vertical Slice

- One client page, one roadmap, one stage list, one task drawer.
- Read path from DB -> API -> UI.

Why now: Proves architecture and surfaces integration issues early.

## 6. Iterative Feature Development

- Add task updates, blockers, filters, handoff.
- Validate each feature against MVP goals.

Why now: Avoids big-bang failure and keeps progress visible.

## 7. QA + Hardening

- Tests for engine logic, API integration, core UI flows.
- Accessibility checks (color + icon).

Why now: Predictability and fewer regressions.

## 8. Deployment + Feedback Loop

- Deploy demo build.
- Gather feedback and adjust roadmap.

Why now: Feedback drives product-market fit and scope alignment.
