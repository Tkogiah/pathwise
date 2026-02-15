# Design Tokens Brief (Light/Dark)

This is the canonical theme brief for the UI overhaul. Tokens must be implemented as CSS custom properties and mapped into Tailwind. No hard-coded hex values in components.

## Design Goals

- Calm, professional, low‑noise UI
- Fast visual scanning of progress states
- Warm neutral surfaces (no pure white)
- Accessible: color + icon + contrast

## Light Mode Tokens

Base

- background-primary: #F4F1EC
- surface-card: #EAE6DF
- surface-elevated: #FFFFFF
- border: #D6D1C8
- text-primary: #2C2A27
- text-secondary: #6F6A62
- text-muted: #9B948A

Accent

- accent-primary: #3E5873
- accent-hover: #32485F

Semantic — Complete

- semantic-success: #2F7A63
- semantic-success-bg: #E3F1EC
- semantic-success-border: #A9D3C5

Semantic — In Progress

- semantic-warning: #C28A00
- semantic-warning-bg: #FFF3D6
- semantic-warning-border: #E6C36A

Semantic — Blocked/Overdue

- semantic-error: #B54848
- semantic-error-bg: #FDECEC
- semantic-error-border: #E4A4A4

Semantic — Locked/Inactive

- semantic-inactive: #9C978E
- semantic-inactive-bg: #F1EEE9
- semantic-inactive-border: #D4CFC6

## Dark Mode Tokens

Base

- dark-background: #1F2430
- dark-surface: #2A3040
- dark-surface-elevated: #32384A
- dark-border: #3E4558
- dark-text-primary: #E6E2DA
- dark-text-secondary: #B8B2A8
- dark-text-muted: #8C879F

Accent

- dark-accent-primary: #5C7A9B

Semantic (dark)

- dark-success: #3AA981
- dark-warning: #E0A400
- dark-error: #D35B5B

## Component Mapping Guidance

Roadmap bar

- Stage node backgrounds: semantic‑\*‑bg in light; dark‑surface in dark
- Stage status icons + colors: semantic status palette
- Stage node fill when complete (entire node highlight)

Tasks list

- Row background: surface‑card / dark‑surface
- Status indicator: semantic status color

Progress arcs

- Thick gauge arc with pink/blue accent (separate from semantic status colors)
- Use the same arc style for overall client progress and per‑stage progress

## Accessibility

- Text contrast meets WCAG AA (>= 4.5:1 for primary)
- Status is never conveyed by color alone (icon + label)
