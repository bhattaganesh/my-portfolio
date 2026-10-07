import { defineConfig, devices } from '@playwright/test';

/** Port for the dev server; set E2E_BASE_URL to test a served static export instead (the release check). */
const PORT = 3100;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const desktop = { viewport: { width: 1440, height: 900 } };

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], ...desktop }, testIgnore: /mobile/ },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], ...desktop }, testIgnore: /mobile/ },
    { name: 'webkit', use: { ...devices['Desktop Safari'], ...desktop }, testIgnore: /mobile/ },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] }, testMatch: /mobile/ },
    { name: 'mobile-webkit', use: { ...devices['iPhone 14'] }, testMatch: /mobile/ },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: `npx next dev --turbopack -p ${PORT}`, url: `${baseURL}/workspace/`, reuseExistingServer: true, timeout: 120_000 },
});
