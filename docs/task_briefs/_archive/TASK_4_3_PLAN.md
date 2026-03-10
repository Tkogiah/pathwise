# Task 4.3 Plan — ProgressArc Component + Placement

## Steps

1. Create ProgressArc.tsx component

- Pure presentational SVG.
- Props:
  ```ts
  interface ProgressArcProps {
    completed: number;
    total: number;
    size?: number; // default 48
    strokeWidth?: number; // default 5
    className?: string;
    color?: 'accent' | 'success' | 'warning' | 'error' | 'inactive';
  }
  ```
- SVG approach:
  - Background track circle: `stroke-edge` (token).
  - Progress arc circle: `stroke-accent` (default) or semantic stroke based on `color`.
  - Use `stroke-dasharray` + `stroke-dashoffset`.
  - `strokeLinecap="round"`.
  - Rotate -90deg so arc starts at 12 o’clock.
  - Center text showing completed/total or percent using `text-content-primary`.
  - Add `role="img"` + `aria-label="X of Y tasks complete"`.

2. Compute overall client progress

- Use StageVM.progress values:
  ```ts
  const overallCompleted = stages.reduce(
    (sum, s) => sum + s.progress.completed,
    0,
  );
  const overallTotal = stages.reduce((sum, s) => sum + s.progress.total, 0);
  ```

3. Place overall progress arc in overview state

- In RoadmapView overview (selectedStageId === null), render ProgressArc alongside the **existing prompt**.
- Do not remove the prompt text; show both:
  `[ProgressArc]  Select a stage to view tasks`
- Use `size={64}` and `strokeWidth={6}`.
- Use neutral accent color (not semantic).

4. Place stage progress arc in zoom-in view

- In zoom-in state, add ProgressArc next to the stage title in the stage header.
- Use `size={40}` and `strokeWidth={4}`.
- Keep the “X of Y tasks complete” line, styled as `text-content-muted`.

5. Color rules

- Overall arc: always `accent`.
- Stage arc color:
  - GREEN → success
  - YELLOW → warning
  - RED → error
  - GRAY → inactive

6. Edge cases

- If `total === 0`, render empty track and show `0/0`.
- If `completed === total`, full arc.
- Add a CSS transition on `stroke-dashoffset` for smooth updates.

7. Verification

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format`

## Risks / Edge Cases

- Tailwind stroke utilities should be generated from `@theme` tokens (stroke-accent, stroke-status-\*).
- Use `viewBox="0 0 100 100"` for scalable sizing.
- No data-testid required (non-interactive).
