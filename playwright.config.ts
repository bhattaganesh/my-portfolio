import { defineConfig, devices } from '@playwright/test';

/** Port for the server under test; E2E_BASE_URL overrides it to test a served static export instead. */
const PORT = 3100;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }, testIgnore: /mobile/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /mobile/ },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: `npx next dev --turbopack -p ${PORT}`, url: `${baseURL}/workspace/`, reuseExistingServer: true, timeout: 120_000 },
});
