import AxeBuilder from '@axe-core/playwright';
import { dock, expect, settle, test, windowRegion } from './fixtures';

const omnibox = (page: import('@playwright/test').Page) => windowRegion(page, 'Browser').getByRole('textbox', { name: 'Address and search bar' });

test.beforeEach(async ({ page }) => {
  await page.goto('/workspace/');
  await dock(page).getByRole('button', { name: 'Browser' }).click();
  await expect(windowRegion(page, 'Browser').getByRole('search')).toBeVisible();
});

test('the new-tab page searches the portfolio, and results open project pages', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  const ntp = br.getByRole('textbox', { name: "Search Ganesh's work or type an address" });
  await ntp.fill('server-sent events');
  await ntp.press('Enter');
  await expect(br.getByRole('heading', { name: /Results for/ })).toBeFocused();
  await expect(omnibox(page)).toHaveValue('ganesh://search?q=server-sent%20events');
  await br.getByRole('tabpanel').getByRole('link', { name: 'WP Agent AI' }).click();
  await expect(br.getByRole('heading', { name: 'WP Agent AI', level: 3 })).toBeFocused();
  await expect(br.getByRole('img', { name: /How a request flows through WP Agent AI/ })).toBeVisible();
  await expect(br.getByRole('tab', { selected: true })).toHaveAccessibleName('WP Agent AI');
});

test('bookmarks, shortcuts and back/forward/reload/home move through pages with focus on each one', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  await br.getByRole('list', { name: 'Shortcuts' }).getByRole('link', { name: 'Spectra' }).click();
  await expect(br.getByRole('heading', { name: 'Spectra', level: 3 })).toBeFocused();
  await br.getByRole('navigation', { name: 'Bookmarks' }).getByRole('button', { name: 'Work' }).click();
  await expect(br.getByRole('heading', { name: 'Plugins and products I have built' })).toBeFocused();
  await expect(omnibox(page)).toHaveValue('ganesh://work');

  await br.getByRole('button', { name: 'Back' }).click();
  await expect(omnibox(page)).toHaveValue('ganesh://work/spectra');
  await br.getByRole('button', { name: 'Back' }).click();
  await expect(br.getByRole('button', { name: 'Back' })).toBeDisabled();
  await br.getByRole('button', { name: 'Forward' }).click();
  await br.getByRole('button', { name: 'Forward' }).click();
  await expect(br.getByRole('button', { name: 'Forward' })).toBeDisabled();
  await br.getByRole('button', { name: 'Reload' }).click();
  await expect(br.getByRole('heading', { name: 'Plugins and products I have built' })).toBeFocused();
  await br.getByRole('button', { name: 'Home' }).click();
  await expect(br.getByRole('textbox', { name: "Search Ganesh's work or type an address" })).toBeFocused();
});

test('other sites are an explicit new-tab link with a game, unsafe schemes are blocked, and typed text is never markup', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  await omnibox(page).fill('example.com/path');
  await omnibox(page).press('Enter');
  await expect(br.getByRole('heading', { name: 'This page is outside the portfolio' })).toBeFocused();
  const out = br.getByRole('link', { name: /Open example\.com in a new tab/ });
  await expect(out).toHaveAttribute('href', 'https://example.com/path');
  await expect(out).toHaveAttribute('target', '_blank');
  await expect(out).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(br.getByRole('application', { name: /Summit Run/ })).toBeVisible();
  await expect(br.locator('iframe')).toHaveCount(0);

  for (const unsafe of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>']) {
    await omnibox(page).fill(unsafe);
    await omnibox(page).press('Enter');
    await expect(br.getByRole('heading', { name: "This address can't be opened" })).toBeVisible();
    await expect(br.getByRole('tabpanel').locator('a[href^="javascript"], a[href^="data"], script')).toHaveCount(0);
  }

  await omnibox(page).fill('<img src=x onerror=alert(1)>');
  await omnibox(page).press('Enter');
  await expect(br.getByRole('heading', { name: /Results for/ })).toContainText('<img src=x onerror=alert(1)>');
  await expect(br.getByRole('tabpanel').locator('img')).toHaveCount(0);

  await omnibox(page).fill('ganesh://nowhere');
  await omnibox(page).press('Enter');
  await expect(br.getByRole('heading', { name: "This page can't be reached" })).toBeVisible();
});

test('the runner on an error page is playable with the keyboard', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  await omnibox(page).fill('ganesh://nowhere');
  await omnibox(page).press('Enter');
  const game = br.getByRole('application', { name: /Summit Run/ });
  await br.getByRole('button', { name: 'Play now' }).click();
  await expect(game).toBeFocused();
  await page.keyboard.press('Space');
  await expect(game.getByText(/tap to start/)).toHaveCount(0);
});

test('GitHub and LinkedIn previews are labelled and link to the real profiles in a new tab', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  const bookmarks = br.getByRole('navigation', { name: 'Bookmarks' });
  await bookmarks.getByRole('button', { name: 'GitHub' }).click();
  await expect(br.getByText('Portfolio preview, not the live GitHub page')).toBeVisible();
  await expect(br.getByRole('link', { name: /Open on GitHub/ })).toHaveAttribute('href', 'https://github.com/bhattaganesh');
  await bookmarks.getByRole('button', { name: 'LinkedIn' }).click();
  await expect(br.getByText('Portfolio preview, not the live LinkedIn page')).toBeVisible();
  await expect(br.getByRole('tabpanel')).not.toContainText(/\b(now|present|currently)\b/i);
  const li = br.getByRole('link', { name: /Open on LinkedIn/ });
  await expect(li).toHaveAttribute('href', 'https://www.linkedin.com/in/ganesh-bhatta/');
  await expect(li).toHaveAttribute('target', '_blank');
});

test('tabs keep their own history, switch with arrow keys, and close with Delete or the menu', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  await br.getByRole('navigation', { name: 'Bookmarks' }).getByRole('button', { name: 'Work' }).click();
  await br.getByRole('button', { name: 'New tab' }).click();
  await expect(br.getByRole('tab')).toHaveCount(2);
  await expect(br.getByRole('tab', { name: 'New Tab' })).toHaveAttribute('aria-selected', 'true');

  await br.getByRole('tab', { name: 'New Tab' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(br.getByRole('tab', { name: 'Work · Ganesh' })).toBeFocused();
  await expect(omnibox(page)).toHaveValue('ganesh://work');
  await page.keyboard.press('Delete');
  await expect(br.getByRole('tab')).toHaveCount(1);
  await expect(br.getByRole('tab', { name: 'New Tab' })).toBeFocused();

  await br.getByRole('button', { name: 'New tab' }).click();
  await br.getByRole('button', { name: 'Browser menu' }).click();
  await page.getByRole('menuitem', { name: 'Close tab' }).click();
  await expect(br.getByRole('tab')).toHaveCount(1);
  await expect(br.getByRole('button', { name: 'Browser menu' })).toBeFocused();
});

test('the Arcade page plays Summit Run and opens the Arcade app', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  await br.getByRole('navigation', { name: 'Bookmarks' }).getByRole('button', { name: 'Arcade' }).click();
  await expect(br.getByRole('application', { name: /Summit Run/ })).toBeVisible();
  await br.getByRole('button', { name: 'Open the Arcade for Snake and 2048' }).click();
  await expect(windowRegion(page, 'Arcade').getByRole('button', { name: /^Snake/ })).toBeVisible();
});

test('Browser pages have no axe violations', async ({ page }) => {
  test.setTimeout(90_000);
  for (const target of ['', 'react', 'ganesh://work', 'ganesh://work/wp-agent-ai', 'ganesh://github', 'ganesh://linkedin', 'ganesh://arcade', 'example.com', 'javascript:x', 'ganesh://nowhere']) {
    await omnibox(page).fill(target || 'ganesh://home');
    await omnibox(page).press('Enter');
    await settle(page);
    const { violations } = await new AxeBuilder({ page }).include('.gw').analyze();
    expect(violations.map((v) => `${target}: ${v.id} ${v.nodes[0]?.target}`)).toEqual([]);
  }
});
