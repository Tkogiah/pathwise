# Task 3.5 Plan — E2E Smoke Tests (Final)

## Final Revised Plan Steps (Maximized Independence and Reliability)

### Part A: Test Setup and Code Preparation

1. Install Playwright

- `npm install -D @playwright/test` at repo root.
- `npx playwright install chromium` (chromium-only for speed).

2. Initialize Test Environment

- Create `e2e/` at repo root.
- Create or update `playwright.config.ts` with:
  - `baseURL: 'http://localhost:3000'`
  - `testDir: 'e2e'`
  - `webServer` to start API + web before tests (3001 and 3000).
  - Chromium only, no parallel, retries 0.
- Confirm `"test:e2e": "playwright test"` exists in root package.json (already present).

3. ESLint setup for e2e/

- Add `e2e/**/*.ts` to `allowDefaultProject` in `eslint.config.mjs` (same pattern as engine tests).

4. DB state prerequisite

- Tests assume seed data exists. Ensure `db:seed` has been run before E2E (or add to webServer setup command if desired).

5. Add `data-testid` Attributes for Stable Selectors

- Create `apps/web/src/lib/utils.ts` with a `slugify()` helper (e.g., "Income Verification" -> "income-verification").
- Update components:
  - `TaskRow.tsx`: add `data-testid={task-row-${slugify(task.title)}}` to the row, and `data-testid={task-status-label-${slugify(task.title)}}` to the status label (sr-only or visible).
  - `StageNode.tsx`: add `data-testid={stage-node-${slugify(stage.title)}}` to the button, and `data-testid={stage-progress-${slugify(stage.title)}}` to the progress text.
  - `TaskDrawer.tsx`: ensure `data-testid="task-drawer"`, `data-testid="task-status-select"`, `data-testid="task-drawer-title"` (already added in Phase 3).
  - `RoadmapBar.tsx`: add `data-testid="roadmap-bar"` to the container.

### Part B: E2E Test Implementation (`e2e/smoke.spec.ts`)

6. Test Case 1: Client Navigation and Roadmap View

- Navigate to `/`.
- Assert `h1` “Clients” is visible.
- Click the **first client link**.
- Assert URL matches `/clients/[id]`.
- Assert `[data-testid="roadmap-bar"]` is visible.

7. Test Case 2: Task Drawer Interaction

- Independent navigation: repeat steps from Test 1.
- Select a seeded task by exact title (e.g., `Income verification`).
- Click task row.
- Assert drawer visible (`[data-testid="task-drawer"]`).
- Assert drawer title matches task title (`[data-testid="task-drawer-title"]`).
- Close drawer and verify it’s not visible.

8. Test Case 3: Task Status Update + UI Verification

- Independent navigation: repeat steps from Test 1.
- Use exact seeded stage + task titles (e.g., stage: `Intake & Assessment`, task: `Income verification`).
- Locate task row via `data-testid={task-row-${slugify(task.title)}}`.
- Capture initial status label and stage progress text.
- Open drawer, set status to `COMPLETE` via `[data-testid="task-status-select"]`.
- Assert dropdown shows “Complete”.
- Close drawer.
- Assert task status label changed to “Complete”.
- Assert stage progress text updated for that stage.
- **Reset status back to the original value** to keep DB clean for subsequent runs.

## Files to Change/Create

- Create: `e2e/smoke.spec.ts`
- Create: `apps/web/src/lib/utils.ts` (slugify)
- (Potentially) Create: `playwright.config.ts`
- Modify: `apps/web/src/components/TaskRow.tsx`
- Modify: `apps/web/src/components/StageNode.tsx`
- Modify: `apps/web/src/components/TaskDrawer.tsx`
- Modify: `apps/web/src/components/RoadmapBar.tsx`
- Modify: `eslint.config.mjs` (allowDefaultProject for e2e)
- Modify: `package.json` (if `test:e2e` missing)
