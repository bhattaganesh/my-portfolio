import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const PAGES = ['/', '/work/', '/work/spectra/', '/work/masteriyo/', '/work/wp-agent-ai/', '/work/everest-forms/', '/work/user-registration/', '/journey/', '/contact/', '/lab/ship-it/'];
const LEGACY: Record<string, string> = {
  '/about/': '/journey/',
  '/experience/': '/journey/',
  '/projects/': '/work/',
  '/projects/spectra-v3/': '/work/spectra/',
  '/projects/masteriyo-lms/': '/work/masteriyo/',
  '/projects/user-registration/': '/work/user-registration/',
};
const WIDTHS = [360, 390, 768, 1024, 1440];

test('primary navigation marks the current page and reaches every section', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' }).first();
  for (const [label, path] of [['Work', '/work/'], ['Journey', '/journey/'], ['Contact', '/contact/']] as const) {
    await nav.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(nav.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
  }
  await page.goto('/work/spectra/');
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
});

test('a flagship case study shows its decisions and request flow, each backed by a pinned source file', async ({ page }) => {
  await page.goto('/work/wp-agent-ai/');
  const decisions = page.getByRole('region', { name: 'Key decisions' });
  const flow = page.getByRole('region', { name: 'How a request flows' });
  await expect(decisions.getByRole('listitem')).toHaveCount(4);
  await expect(flow.getByRole('list')).toHaveJSProperty('tagName', 'OL');
  await expect(flow.getByRole('listitem')).toHaveCount(5);
  const sources = page.getByRole('link', { name: /^Source: / });
  await expect(sources).toHaveCount(9);
  for (const href of await sources.evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
    expect(href).toMatch(/^https:\/\/github\.com\/bhattaganesh\/wp-agent-ai\/blob\/[0-9a-f]{40}\//);
  }
  await page.goto('/work/everest-forms/');
  await expect(page.getByRole('heading', { name: 'Key decisions' })).toHaveCount(0);
});

test('theme follows the system first, and a chosen theme persists across reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Switch between light and dark theme' }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('every internal link on every page resolves', async ({ page, request }) => {
  test.setTimeout(180_000);
  const seen = new Set<string>();
  const queue = ['/'];
  const broken: string[] = [];
  while (queue.length) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await request.get(path);
    if (res.status() !== 200) {
      broken.push(`${res.status()} ${path}`);
      continue;
    }
    if (!res.headers()['content-type']?.includes('text/html')) continue;
    await page.goto(path);
    const hrefs = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')!.split('#')[0]));
    queue.push(...hrefs.filter((h) => h && !seen.has(h)));
  }
  expect(broken).toEqual([]);
  expect(seen.size).toBeGreaterThan(8);
});

test('no page overflows horizontally at phone, tablet and desktop widths or at 200% zoom', async ({ page }) => {
  test.setTimeout(180_000);
  const overflow: string[] = [];
  for (const width of [...WIDTHS, 640]) {
    await page.setViewportSize({ width, height: width === 640 ? 450 : 900 });
    for (const path of PAGES) {
      await page.goto(path);
      const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (extra > 0) overflow.push(`${width}px ${path}: +${extra}`);
    }
  }
  expect(overflow).toEqual([]);
});

test('public pages make no unconfirmed or unverified claims', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const text = await page.locator('body').innerText();
    expect(text, path).not.toMatch(/\b(currently|present)\b|[–-]\s*now\b|core engineer|\b(40|30|80)%/i);
    await expect(page.locator('a[href$=".pdf"]'), `${path}: résumé link`).toHaveCount(0);
    await expect(page.locator('img[src*="ganesh"]'), `${path}: unapproved portrait`).toHaveCount(0);
  }
});

test('legacy URLs redirect to their replacement and are not indexed', async ({ page }) => {
  for (const [from, to] of Object.entries(LEGACY)) {
    await page.goto(from, { waitUntil: 'commit' });
    const head = await page.request.get(from).then((r) => r.text());
    expect(head, from).toContain(`content="0; url=${to}"`);
    expect(head, from).toContain('content="noindex, follow"');
    expect(head, from).toContain(`<link rel="canonical" href="https://www.ganeshbhatt.com.np${to}"/>`);
    await page.waitForURL(`**${to}`);
  }
  for (const path of ['/blog/', '/blog/php-8-x-features-every-wordpress-developer-should-know/']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/being revised/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('meta[http-equiv="refresh"]')).toHaveCount(0);
  }
});

test('the sitemap lists only canonical pages, and each one loads', async ({ page, request }) => {
  const xml = await request.get('/sitemap.xml').then((r) => r.text());
  const paths = [...xml.matchAll(/<loc>https:\/\/www\.ganeshbhatt\.com\.np([^<]*)<\/loc>/g)].map((m) => m[1]);
  expect(paths).toEqual(expect.arrayContaining(PAGES));
  for (const path of paths) {
    expect(path, 'trailing slash').toMatch(/\/$/);
    expect(Object.keys(LEGACY)).not.toContain(path);
    expect((await request.get(path)).status(), path).toBe(200);
  }
  await page.goto('/feed.xml');
});

test('pages pass axe in light and dark themes', async ({ page, errors }) => {
  test.setTimeout(180_000);
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const path of [...PAGES, '/blog/', '/does-not-exist/']) {
      const before = errors.length;
      await page.goto(path);
      // The deliberate 404 page logs exactly one failed document request; anything else still fails the test.
      if (path === '/does-not-exist/' && errors.length === before + 1 && /status of 404/.test(errors[before])) errors.pop();
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map((v) => `${scheme} ${path}: ${v.id} (${v.nodes.length})`)).toEqual([]);
    }
  }
});

test('the copy button reports what happened, whether or not the clipboard is allowed', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Copy' }).click();
  await expect(page.getByRole('status').filter({ hasText: /copied|selected/i })).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the portfolio is fully readable and navigable', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('I build the systems behind');
    await expect(page.getByRole('link', { name: 'Spectra' }).first()).toBeVisible();
    await expect(page.getByText('bhattaganesh05@gmail.com').first()).toBeVisible();
    const footer = page.getByRole('navigation', { name: 'Footer' });
    for (const label of ['Work', 'Journey', 'Contact']) await expect(footer.getByRole('link', { name: label, exact: true })).toBeVisible();
    await page.goto('/work/spectra/');
    await expect(page.getByRole('heading', { name: 'What I owned' })).toBeVisible();
    await page.goto('/work/wp-agent-ai/');
    await expect(page.getByRole('heading', { name: 'How a request flows' })).toBeVisible();
    await page.goto('/workspace/');
    // getByText skips <noscript> subtrees even when they render, so target the overlay itself.
    await expect(page.locator('.gw-noscript')).toBeVisible();
    await expect(page.locator('.gw-noscript')).toContainText('The interactive workspace needs JavaScript');
  });

  test('the 60-second overview puts work, experience, résumé and contact one link from the top', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '60-second overview ↓' }).click();
    await expect(page).toHaveURL(/#overview$/);
    const overview = page.getByRole('region', { name: 'The 60-second overview' });
    await expect(overview).toBeInViewport();
    for (const title of ['Spectra', 'Masteriyo LMS', 'WP Agent AI']) {
      await expect(overview.getByRole('link', { name: title, exact: true })).toHaveAttribute('href', /^\/work\/[a-z-]+\/$/);
    }
    for (const org of ['Brainstorm Force', 'ThemeGrill', 'Zenlab']) await expect(overview).toContainText(org);
    const resume = overview.getByRole('link', { name: /^Résumé/ });
    await expect(resume).toHaveAttribute('href', /^(\/resume\/.+\.pdf|mailto:bhattaganesh05@gmail\.com\?subject=)/);
    await expect(overview.getByRole('link', { name: 'bhattaganesh05@gmail.com' })).toHaveAttribute('href', 'mailto:bhattaganesh05@gmail.com');
    await expect(overview.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/ganesh-bhatta/');
    await expect(overview.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/bhattaganesh');
  });
});
