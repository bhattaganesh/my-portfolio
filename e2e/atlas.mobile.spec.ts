import { expect, test } from './fixtures';

test('the phone menu opens, closes with Escape back to its button, and navigates', async ({ page }) => {
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.tap();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  const panel = page.locator('#site-menu');
  await panel.getByRole('link', { name: 'Journey' }).focus();
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(menu).toBeFocused();

  await menu.tap();
  await panel.getByRole('link', { name: 'Work', exact: true }).tap();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.locator('#site-menu')).toHaveCount(0);
});

test('primary actions on the home page are large enough to tap', async ({ page }) => {
  await page.goto('/');
  for (const name of ['Explore selected work →', 'Email me', 'Enter my workspace →', 'Menu']) {
    const box = await page.getByRole(name === 'Menu' ? 'button' : 'link', { name, exact: true }).first().boundingBox();
    expect(box?.height ?? 0, name).toBeGreaterThanOrEqual(44);
  }
});
