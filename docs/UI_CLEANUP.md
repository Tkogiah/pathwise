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
- **Hero header**: single row containing client name + actions + demo user + theme + compact program metadata.
- **Progress arcs**: thick gauge arcs using theme tokens (no pink/blue requirement).
- **Stage nodes**: larger, titles mostly visible, entire node fills when complete.
- **Warm gray background** (not pure white).
- **Status palette**: green/yellow/red/gray with icons for color‑blind clarity.
- **Drawer**: right‑side panel that dims but does not fully block the UI.
- **Notes rail** (Phase 7): muted, collapsible sidebar that never overwhelms the roadmap.

## UX Principle

This app is meant for **fast visual comprehension**, not detailed documentation. Reduce reading. Increase visual hierarchy.
