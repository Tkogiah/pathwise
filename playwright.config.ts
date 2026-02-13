import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:api',
      port: 3001,
      reuseExistingServer: true,
      timeout: 30_000,
      env: {
        DATABASE_URL:
          process.env.DATABASE_URL ??
          'postgresql://pathwise:pathwise@localhost:5432/pathwise_dev',
      },
    },
    {
      command: 'npm run dev:web',
      port: 3000,
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
