import AxeBuilder from '@axe-core/playwright';
import { dock, expect, test, windowRegion } from './fixtures';

test('a keyboard-only run plays three rounds with a twist, shows the debrief and replays', async ({ page }) => {
  await page.goto('/lab/ship-it/');
  await page.getByRole('button', { name: 'Start round 1' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Round 1: The slow catalogue' })).toBeFocused();

  await page.getByRole('button', { name: 'Ship it', exact: true }).press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Pick a fix first.' })).toBeVisible();

  await page.getByRole('radio', { name: /Fix the slow database lookup/ }).press('Space');
  await page.getByRole('button', { name: 'Ship it', exact: true }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Works: Fast, and fixed at the source' })).toBeFocused();

  await page.getByRole('button', { name: 'Try the harder twist' }).press('Enter');
  await expect(page.getByText('What changed:')).toBeVisible();
  await page.getByRole('radio', { name: /Keep a ready-made copy of the page/ }).press('Space');
  await page.getByRole('button', { name: 'Ship it', exact: true }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Made it worse: Students see someone else’s progress' })).toBeFocused();

  await page.getByRole('button', { name: 'Next: round 2' }).press('Enter');
  await page.getByRole('radio', { name: /waiting line and work through/ }).press('Space');
  await page.getByRole('button', { name: 'Ship it', exact: true }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Partly works: Nothing lost, but still doubled' })).toBeFocused();
  await expect(page.getByRole('complementary', { name: 'A common question' })).toContainText('provider resends');

  await page.getByRole('button', { name: 'Next: round 3' }).press('Enter');
  await page.getByRole('radio', { name: /Only redraw the block/ }).press('Space');
  await page.getByRole('button', { name: 'Ship it', exact: true }).press('Enter');
  await page.getByRole('button', { name: 'See the debrief' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Debrief' })).toBeFocused();
  await expect(page.getByText('2 of 4 fixes you shipped worked.')).toBeVisible();

  await page.getByRole('button', { name: 'Play again' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Round 1: The slow catalogue' })).toBeFocused();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
});

test('the game page has no axe violations on each screen', async ({ page }) => {
  await page.goto('/lab/ship-it/');
  const scan = async (label: string) => {
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.map((v) => `${label}: ${v.id} ${v.nodes[0]?.target}`)).toEqual([]);
  };
  await scan('intro');
  await page.getByRole('button', { name: 'Start round 1' }).click();
  await page.getByLabel('Show engineering terms').check();
  await scan('choose');
  await page.getByRole('radio', { name: /Add more web servers/ }).check();
  await page.getByRole('button', { name: 'Ship it', exact: true }).click();
  await scan('result');
});

test('in the Workspace, minimizing keeps the run and closing ends it; the game loads only when opened', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (r) => {
    if (r.resourceType() === 'script') scripts.push(new URL(r.url()).pathname);
  });
  await page.goto('/workspace/', { waitUntil: 'networkidle' });
  const before = scripts.length;
  await dock(page).getByRole('button', { name: 'Ship It' }).click();
  const game = windowRegion(page, 'Ship It');
  await game.getByRole('button', { name: 'Start round 1' }).click();
  expect(scripts.length, 'opening the game fetched its own code').toBeGreaterThan(before);

  await game.getByRole('radio', { name: /Fix the slow database lookup/ }).check();
  await game.getByRole('button', { name: 'Ship it', exact: true }).click();
  await page.getByRole('button', { name: 'Minimize Ship It' }).click();
  await dock(page).getByRole('button', { name: 'Ship It, minimized' }).click();
  await expect(game.getByRole('heading', { name: /Fast, and fixed at the source/ })).toBeVisible();

  await page.getByRole('button', { name: 'Close Ship It' }).click();
  await dock(page).getByRole('button', { name: 'Ship It' }).click();
  await expect(game.getByRole('button', { name: 'Start round 1' })).toBeVisible();
});
