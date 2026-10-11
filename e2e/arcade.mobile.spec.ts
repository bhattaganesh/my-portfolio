import { expect, test, windowRegion } from './fixtures';

test('the games are playable by touch, with large controls and no sideways scrolling', async ({ page }) => {
  await page.goto('/workspace/');
  await page.getByRole('navigation', { name: 'Apps' }).getByRole('button', { name: /Arcade/ }).tap();
  const arcade = windowRegion(page, 'Arcade');

  await arcade.getByRole('button', { name: /Summit Run/ }).tap();
  await expect(arcade.getByText('tap to start')).toBeVisible();
  await expect(arcade.locator('.arc-kbd-only')).toBeHidden();
  const jump = arcade.locator('.arc-touch button').last();
  expect((await jump.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await jump.tap();
  await expect(arcade.getByText('tap to start')).toHaveCount(0);

  await arcade.getByRole('button', { name: 'Games' }).tap();
  await arcade.getByRole('button', { name: /^2048/ }).tap();
  for (const b of await arcade.locator('.arc-pad button').all()) expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await arcade.locator('.arc-pad-left').tap();
  await expect(arcade.getByRole('status')).toHaveText(/Moved|Nothing moves/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
