import { expect, test } from './fixtures';

test('the game is playable by touch on a phone without horizontal scrolling', async ({ page }) => {
  await page.goto('/lab/ship-it/');
  await page.getByRole('button', { name: 'Start round 1' }).tap();
  await page.getByText('Fix the slow database lookup').tap();
  await expect(page.getByRole('radio', { name: /Fix the slow database lookup/ })).toBeChecked();
  await page.getByRole('button', { name: 'Ship it', exact: true }).tap();
  await expect(page.getByRole('heading', { name: /Fast, and fixed at the source/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  for (const name of ['Try the harder twist', 'Next: round 2', 'Try a different fix']) {
    expect((await page.getByRole('button', { name }).boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
});
