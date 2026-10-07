import { defineConfig, devices } from '@playwright/test';

/** One-off archiving task: `npx playwright test --config scripts/archive-notes.config.ts`. */
export default defineConfig({
  testDir: '.',
  testMatch: /archive-notes\.task\.ts$/,
  reporter: [['list']],
  use: { ...devices['Desktop Chrome'] },
});
