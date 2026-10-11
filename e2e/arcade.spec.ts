import AxeBuilder from '@axe-core/playwright';
import { dock, expect, settle, test, windowRegion } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/workspace/');
  await dock(page).getByRole('button', { name: 'Arcade' }).click();
});

test('Summit Run starts with Space, ends on a rock, saves the best score and replays', async ({ page }) => {
  const arcade = windowRegion(page, 'Arcade');
  await arcade.getByRole('button', { name: /Summit Run/ }).click();
  const game = arcade.getByRole('application', { name: /Summit Run/ });
  await expect(game).toBeFocused();
  await page.keyboard.press('Space');
  await expect(arcade.getByRole('status').filter({ hasText: /Game over/ })).toHaveText(/Game over\. Score \d+/, { timeout: 20_000 });
  const best = await page.evaluate(() => JSON.parse(localStorage.getItem('gw.arcade.best.v1') ?? '{}').runner);
  expect(best).toBeGreaterThan(0);
  await arcade.getByRole('button', { name: 'Play again' }).click();
  await expect(arcade.getByRole('button', { name: 'Play again' })).toHaveCount(0);

  await arcade.getByRole('button', { name: 'Games' }).click();
  await expect(arcade.getByRole('button', { name: /Summit Run/ })).toBeFocused();
  await expect(arcade.getByRole('button', { name: /Summit Run/ })).toContainText(`Best ${best}`);
});

test('Snake steers with the keyboard and ends at a wall', async ({ page }) => {
  const arcade = windowRegion(page, 'Arcade');
  await arcade.getByRole('button', { name: /^Snake/ }).click();
  await expect(arcade.getByRole('application', { name: /Snake/ })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(arcade.getByRole('status').filter({ hasText: /Game over/ })).toBeVisible({ timeout: 10_000 });
  await arcade.getByRole('button', { name: 'Play again' }).click();
  await expect(arcade.getByRole('application', { name: /Snake/ })).toBeFocused();
});

test('2048 is a readable board that announces each move', async ({ page }) => {
  const arcade = windowRegion(page, 'Arcade');
  await arcade.getByRole('button', { name: /^2048/ }).click();
  const board = arcade.getByRole('table', { name: 'Board, row by row' });
  await expect(board.getByRole('cell')).toHaveCount(16);
  await expect(board.getByRole('cell').filter({ hasText: /^(2|4)$/ })).toHaveCount(2);
  for (const key of ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']) await page.keyboard.press(key);
  await expect(arcade.getByRole('status')).toHaveText(/Moved|Nothing moves/);
  expect(await board.getByRole('cell').filter({ hasText: /^\d+$/ }).count()).toBeGreaterThanOrEqual(2);
});

test('closing the Arcade ends the game, and the shelf has no axe violations', async ({ page }) => {
  const arcade = windowRegion(page, 'Arcade');
  await settle(page);
  const { violations } = await new AxeBuilder({ page }).include('.gw').analyze();
  expect(violations.map((v) => `${v.id} ${v.nodes[0]?.target}`)).toEqual([]);
  await arcade.getByRole('button', { name: /^2048/ }).click();
  await page.getByRole('button', { name: 'Close Arcade' }).click();
  await dock(page).getByRole('button', { name: 'Arcade' }).click();
  await expect(arcade.getByRole('button', { name: /^2048/ })).toBeVisible();
});
