import AxeBuilder from '@axe-core/playwright';
import { dock, expect, test, windowRegion, settle } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/workspace/');
  await dock(page).getByRole('button', { name: 'Browser' }).click();
  await expect(windowRegion(page, 'Browser').getByRole('heading', { name: 'Ganesh’s portfolio browser' })).toBeVisible();
});

test('bookmarks, links and back/forward move through internal pages with focus on each page', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  const address = br.getByRole('textbox', { name: 'Address' });
  await br.getByRole('navigation', { name: 'Bookmarks' }).getByRole('button', { name: 'Work' }).click();
  await expect(br.getByRole('heading', { name: 'Work', level: 3 })).toBeFocused();
  await expect(address).toHaveValue('ganesh://work');
  await br.getByRole('tabpanel').getByRole('link', { name: 'Masteriyo LMS' }).click();
  await expect(br.getByRole('heading', { name: 'Masteriyo LMS', level: 3 })).toBeFocused();
  await expect(address).toHaveValue('ganesh://work/masteriyo');

  await br.getByRole('button', { name: 'Back' }).click();
  await expect(address).toHaveValue('ganesh://work');
  await br.getByRole('button', { name: 'Back' }).click();
  await expect(address).toHaveValue('ganesh://home');
  await expect(br.getByRole('button', { name: 'Back' })).toBeDisabled();
  await br.getByRole('button', { name: 'Forward' }).click();
  await br.getByRole('button', { name: 'Forward' }).click();
  await expect(br.getByRole('heading', { name: 'Masteriyo LMS', level: 3 })).toBeVisible();
  await expect(br.getByRole('button', { name: 'Forward' })).toBeDisabled();
});

test('the address bar resolves portfolio URLs, makes other sites an explicit new-tab link, and blocks unsafe schemes', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  const address = br.getByRole('textbox', { name: 'Address' });
  await address.fill('https://www.ganeshbhatt.com.np/work/wp-agent-ai/');
  await address.press('Enter');
  await expect(br.getByRole('img', { name: /How a request flows through WP Agent AI/ })).toBeVisible();

  await address.fill('example.com/path');
  await address.press('Enter');
  const out = br.getByRole('link', { name: 'Open example.com in a new tab' });
  await expect(out).toHaveAttribute('href', 'https://example.com/path');
  await expect(out).toHaveAttribute('target', '_blank');
  await expect(out).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(br.locator('iframe')).toHaveCount(0);

  for (const unsafe of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>']) {
    await address.fill(unsafe);
    await address.press('Enter');
    await expect(br.getByRole('heading', { name: 'That address can’t be opened' })).toBeVisible();
    await expect(br.getByRole('tabpanel').locator('a[href^="javascript"], a[href^="data"], script')).toHaveCount(0);
  }

  await address.fill('<img src=x onerror=alert(1)> spectra');
  await address.press('Enter');
  await expect(br.getByRole('heading', { name: 'No portfolio page at that address' })).toBeVisible();
  await expect(br.getByRole('tabpanel')).toContainText('<img src=x onerror=alert(1)> spectra');
  await expect(br.getByRole('tabpanel').locator('img')).toHaveCount(0);
});

test('GitHub and LinkedIn previews are labelled as previews and link to the real profiles in a new tab', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  const bookmarks = br.getByRole('navigation', { name: 'Bookmarks' });
  await bookmarks.getByRole('button', { name: 'GitHub' }).click();
  await expect(br.getByText('Portfolio preview, not the live GitHub page')).toBeVisible();
  const gh = br.getByRole('link', { name: /Open on GitHub/ });
  await expect(gh).toHaveAttribute('href', 'https://github.com/bhattaganesh');
  await expect(gh).toHaveAttribute('target', '_blank');

  await bookmarks.getByRole('button', { name: 'LinkedIn' }).click();
  await expect(br.getByText('Portfolio preview, not the live LinkedIn page')).toBeVisible();
  await expect(br.getByRole('tabpanel')).not.toContainText(/\b(now|present|currently)\b/i);
  const li = br.getByRole('link', { name: /Open on LinkedIn/ });
  await expect(li).toHaveAttribute('href', 'https://www.linkedin.com/in/ganesh-bhatta/');
  await expect(li).toHaveAttribute('target', '_blank');
});

test('tabs keep their own history, switch with arrow keys and close to a neighbour', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  const address = br.getByRole('textbox', { name: 'Address' });
  await br.getByRole('navigation', { name: 'Bookmarks' }).getByRole('button', { name: 'Work' }).click();
  await br.getByRole('button', { name: 'New tab' }).click();
  await expect(br.getByRole('tab')).toHaveCount(2);
  await expect(br.getByRole('tab', { name: 'Start page' })).toHaveAttribute('aria-selected', 'true');
  await expect(address).toHaveValue('ganesh://home');

  await br.getByRole('tab', { name: 'Start page' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(br.getByRole('tab', { name: 'Work' })).toBeFocused();
  await expect(address).toHaveValue('ganesh://work');

  await page.keyboard.press('Delete');
  await expect(br.getByRole('tab')).toHaveCount(1);
  await expect(br.getByRole('tab', { name: 'Start page' })).toBeFocused();
  await expect(address).toHaveValue('ganesh://home');

  await br.getByRole('button', { name: 'New tab' }).click();
  await br.locator('.gw-br-close').last().click();
  await expect(br.getByRole('tab')).toHaveCount(1);
});

test('the Ship It page opens the game app', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  await br.getByRole('navigation', { name: 'Bookmarks' }).getByRole('button', { name: 'Ship It' }).click();
  await br.getByRole('button', { name: 'Play Ship It' }).click();
  await expect(windowRegion(page, 'Ship It').getByRole('button', { name: 'Start round 1' })).toBeVisible();
});

test('Browser pages have no axe violations', async ({ page }) => {
  const br = windowRegion(page, 'Browser');
  const address = br.getByRole('textbox', { name: 'Address' });
  for (const target of ['ganesh://home', 'ganesh://work', 'ganesh://work/wp-agent-ai', 'ganesh://linkedin', 'example.com', 'javascript:x', 'nothing here']) {
    await address.fill(target);
    await address.press('Enter');
    await settle(page);
    const { violations } = await new AxeBuilder({ page }).include('.gw').analyze();
    expect(violations.map((v) => `${target}: ${v.id} ${v.nodes[0]?.target}`)).toEqual([]);
  }
});
