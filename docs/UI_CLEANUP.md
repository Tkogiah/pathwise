# UI Cleanup (Phase 4)

## Core Intent

The UI must emphasize the high‑level roadmap. This is a **visual state machine**, not a CRM. Users should understand client progress in seconds with minimal reading.

## Key Issues to Fix

- Roadmap is too small; tasks are too large and too dense.
- Layout feels grid‑like and cluttered.
- All‑white palette feels sleepy; needs stronger visual identity.
- Too much detail visible by default.
- Demo user selector placement is inconsistent across clients.

## Required Direction

- **Roadmap‑first overview**: roadmap is primary element on the client page.
- **Keep roadmap visible** at all times for context.
- **Zoom‑in mode**: clicking a stage reveals tasks below while retaining the roadmap.
- **Top 20% header**: client name + overall progress arc + tabs + demo user selector (right aligned).
- **Progress arcs**: thick gauge arcs (pink/blue accent) for overall client progress and per‑stage progress.
- **Stage nodes**: larger, titles mostly visible, entire node fills when complete.
- **Warm gray background** (not pure white).
- **Status palette**: green/yellow/red/gray with icons for color‑blind clarity.
- **Drawer**: right‑side panel that dims but does not fully block the UI.

## UX Principle

This app is meant for **fast visual comprehension**, not detailed documentation. Reduce reading. Increase visual hierarchy.
