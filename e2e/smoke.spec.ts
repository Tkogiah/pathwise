import { test, expect } from '@playwright/test';

/**
 * E2E smoke tests for Pathwise.
 *
 * Prerequisites:
 * - Database is running and seeded (`npm run db:seed`)
 * - API and Web servers are started (handled by playwright.config.ts webServer)
 *
 * Seed data reference:
 * - Clients (sorted by lastName): Mitchell, Rivera, Thompson
 * - Marcus Rivera has 1 roadmap, stage "Intake & Assessment"
 *   with "Collect ID documents" (IN_PROGRESS) and "Complete intake form" (NOT_STARTED)
 */

/** Navigate to a client detail page via the client list. */
async function navigateToClient(
  page: import('@playwright/test').Page,
  clientName: string,
) {
  await page.goto('/clients');
  await expect(page.locator('h1')).toHaveText('Clients');
  await page.locator('a', { hasText: clientName }).click();
  await expect(page.locator('[data-testid="roadmap-bar"]')).toBeVisible();
}

test.describe('Pathwise Smoke Tests', () => {
  test('Test 1: Client list navigation and roadmap view', async ({ page }) => {
    await page.goto('/clients');

    // Client list is visible
    await expect(page.locator('h1')).toHaveText('Clients');
    const clientLinks = page.locator('ul li a');
    await expect(clientLinks.first()).toBeVisible();

    // Click first client
    const firstName = await clientLinks.first().textContent();
    await clientLinks.first().click();

    // Verify we navigated to a client detail page
    await expect(page).toHaveURL(/\/clients\/.+/);
    expect(firstName).toBeTruthy();

    // Roadmap bar is visible
    await expect(page.locator('[data-testid="roadmap-bar"]')).toBeVisible();
  });

  test('Test 2: Task drawer interaction', async ({ page }) => {
    // Navigate to Marcus Rivera (simple roadmap, predictable state)
    await navigateToClient(page, 'Rivera');

    // Click a stage to enter zoom-in view (tasks not visible in overview)
    await page.locator('[data-testid="roadmap-bar"] button').first().click();

    // Click the "Collect ID documents" task row
    const taskRow = page.locator(
      '[data-testid="task-row-collect-id-documents"]',
    );
    await expect(taskRow).toBeVisible();
    await taskRow.click();

    // Drawer opens with correct title
    const drawer = page.locator('[data-testid="task-drawer"]');
    await expect(drawer).toBeVisible();
    await expect(page.locator('[data-testid="task-drawer-title"]')).toHaveText(
      'Collect ID documents',
    );

    // Close drawer via Escape
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  });

  test('Test 3: Update task status and verify stage recalculation', async ({
    page,
  }) => {
    // Navigate to Marcus Rivera
    await navigateToClient(page, 'Rivera');

    // Click a stage to enter zoom-in view (tasks not visible in overview)
    await page.locator('[data-testid="roadmap-bar"] button').first().click();

    // Capture initial stage progress for "Intake & Assessment"
    const stageProgress = page.locator(
      '[data-testid="stage-progress-intake-assessment"]',
    );
    const initialProgress = await stageProgress.textContent();

    // Open "Complete intake form" (NOT_STARTED, not locked, not N/A)
    const taskRow = page.locator(
      '[data-testid="task-row-complete-intake-form"]',
    );
    await taskRow.click();

    const drawer = page.locator('[data-testid="task-drawer"]');
    await expect(drawer).toBeVisible();

    // Change status to COMPLETE
    const statusSelect = page.locator('[data-testid="task-status-select"]');
    await statusSelect.selectOption('COMPLETE');

    // Wait for roadmap refresh — drawer should still be open with updated data
    await expect(statusSelect).toHaveValue('COMPLETE');

    // Close drawer
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();

    // Verify stage progress updated (retrying assertion to avoid flakiness)
    await expect(stageProgress).not.toHaveText(initialProgress ?? '');

    // Verify task row status label updated
    const statusLabel = page.locator(
      '[data-testid="task-status-label-complete-intake-form"]',
    );
    await expect(statusLabel).toHaveText('Complete');

    // --- Cleanup: reset status back to NOT_STARTED ---
    await taskRow.click();
    await expect(drawer).toBeVisible();
    await statusSelect.selectOption('NOT_STARTED');
    await expect(statusSelect).toHaveValue('NOT_STARTED');
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();

    // Verify progress restored (retrying assertion)
    await expect(stageProgress).toHaveText(initialProgress ?? '');
  });
});
