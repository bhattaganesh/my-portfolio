import AxeBuilder from '@axe-core/playwright';
import { box, dock, expect, test, windowRegion } from './fixtures';

const TITLE_BAR = 44;
const MIN_VISIBLE = 96;

test.beforeEach(async ({ page }) => {
  await page.goto('/workspace/');
  await expect(page.locator('.gw')).toBeVisible();
});

test('opens Projects from the dock with focus on its title, and browses projects', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  const projects = windowRegion(page, 'Projects');
  await expect(projects).toBeVisible();
  await expect(page.locator('#gw-title-projects')).toBeFocused();
  await projects.getByRole('button', { name: 'Masteriyo LMS' }).click();
  await expect(projects.getByRole('heading', { name: 'Masteriyo LMS', level: 3 })).toBeVisible();
  await expect(projects.getByRole('button', { name: 'Masteriyo LMS' })).toHaveAttribute('aria-current', 'true');
  await expect(projects).not.toContainText(/\b(now|present|currently)\b/i);
});

test('minimize removes the window from the tab order and restore returns focus where it was', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  const projects = windowRegion(page, 'Projects');
  await projects.getByRole('button', { name: 'WP Agent AI' }).focus();

  await dock(page).getByRole('button', { name: 'Projects, open' }).click();
  await expect(projects).toBeHidden();
  await expect(dock(page).getByRole('button', { name: 'Projects, minimized' })).toBeFocused();

  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => !!document.activeElement?.closest('section.gw-window'));
    expect(inside, `Tab stop ${i} landed inside a minimized window`).toBe(false);
  }

  await dock(page).getByRole('button', { name: 'Projects, minimized' }).click();
  await expect(projects).toBeVisible();
  await expect(projects.getByRole('button', { name: 'WP Agent AI' })).toBeFocused();
});

test('minimize and close via window controls hand focus back to the dock', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  await page.getByRole('button', { name: 'Minimize Projects' }).click();
  await expect(dock(page).getByRole('button', { name: 'Projects, minimized' })).toBeFocused();
  await dock(page).getByRole('button', { name: 'Projects, minimized' }).click();
  await page.getByRole('button', { name: 'Close Projects' }).click();
  await expect(windowRegion(page, 'Projects')).toHaveCount(0);
  await expect(dock(page).getByRole('button', { name: 'Projects', exact: true })).toBeFocused();
});

test('maximize fills the desk and restore brings back the previous size', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  const before = await box(page, 'section.gw-window');
  await page.getByRole('button', { name: 'Maximize Projects' }).click();
  const desk = await box(page, '.gw-desk');
  const max = await box(page, 'section.gw-window');
  expect(max.width).toBeCloseTo(desk.width, 0);
  expect(max.height).toBeCloseTo(desk.height, 0);
  await page.getByRole('button', { name: 'Restore Projects' }).click();
  expect(await box(page, 'section.gw-window')).toEqual(before);
});

test('keyboard only: open, move, resize, use the terminal and close', async ({ page }) => {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    if (await dock(page).getByRole('button', { name: 'Projects' }).evaluate((el) => el === document.activeElement)) break;
  }
  await expect(dock(page).getByRole('button', { name: 'Projects' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#gw-title-projects')).toBeFocused();

  const start = await box(page, 'section.gw-window');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Window options for Projects' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: 'Move with keyboard' })).toBeFocused();
  await page.keyboard.press('Enter');
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  const moved = await box(page, 'section.gw-window');
  expect(moved.x - start.x).toBeCloseTo(48, 0);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Resize with keyboard' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Shift+ArrowDown');
  await page.keyboard.press('Escape');
  expect((await box(page, 'section.gw-window')).height - moved.height).toBeCloseTo(64, 0);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Window options for Projects' })).toBeFocused();
  await expect(page.getByRole('menuitem', { name: 'Move with keyboard' })).toHaveCount(0);

  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    if (await dock(page).getByRole('button', { name: 'Terminal' }).evaluate((el) => el === document.activeElement)) break;
  }
  await page.keyboard.press('Enter');
  await expect(page.locator('#gw-title-terminal')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const field = page.locator('#gw-term-field');
  await expect(field).toBeFocused();
  await page.keyboard.type('jou');
  await page.keyboard.press('Tab');
  await expect(field).toHaveValue('journey');
  await expect(field).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('log', { name: 'Terminal output' })).toContainText('joined Jan 2025 · Software Developer, Brainstorm Force');

  await page.keyboard.type('c');
  await page.keyboard.press('Tab');
  await expect(field).not.toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Window options for Terminal' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(windowRegion(page, 'Terminal')).toHaveCount(0);
  const focusInProjects = await page.evaluate(() => !!document.activeElement?.closest('[aria-labelledby="gw-title-projects"]'));
  expect(focusInProjects).toBe(true);
});

test('terminal: hostile input stays text, history recalls it, and commands open apps', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Terminal' }).click();
  const field = page.locator('#gw-term-field');
  const log = page.getByRole('log', { name: 'Terminal output' });
  await field.fill('<script>alert(1)</script>');
  await field.press('Enter');
  await expect(log).toContainText('"<script>alert(1)</script>" isn\'t a command here');
  await expect(page.locator('.gw-term-log script')).toHaveCount(0);
  await field.press('ArrowUp');
  await expect(field).toHaveValue('<script>alert(1)</script>');

  await field.fill('projects spectra');
  await field.press('Enter');
  const projects = windowRegion(page, 'Projects');
  await expect(projects.getByRole('heading', { name: 'Spectra', level: 3 })).toBeVisible();
  await expect(page.locator('#gw-title-projects')).toBeFocused();

  await dock(page).getByRole('button', { name: 'Terminal, open' }).click();
  await page.getByRole('button', { name: 'contact', exact: true }).click();
  await expect(log.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/bhattaganesh');
  await field.fill('exit');
  await field.press('Enter');
  await expect(windowRegion(page, 'Terminal')).toHaveCount(0);
});

test('dragging and viewport resizing never strand a window', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  const handle = await box(page, 'section.gw-window .gw-resize');
  await page.mouse.move(handle.x + 9, handle.y + 9);
  await page.mouse.down();
  await page.mouse.move(handle.x - 2000, handle.y - 2000, { steps: 6 });
  await page.mouse.up();
  const small = await box(page, 'section.gw-window');
  expect(small.width).toBeGreaterThanOrEqual(520 - 1);
  expect(small.height).toBeGreaterThanOrEqual(360 - 1);

  const title = await box(page, 'section.gw-window .gw-titlebar h2');
  await page.mouse.move(title.x + title.width / 2, title.y + title.height / 2);
  await page.mouse.down();
  await page.mouse.move(-3000, 4000, { steps: 8 });
  await page.mouse.up();

  const check = async () => {
    const desk = await box(page, '.gw-desk');
    const win = await box(page, 'section.gw-window');
    expect(win.y).toBeGreaterThanOrEqual(desk.y - 1);
    expect(win.y + TITLE_BAR).toBeLessThanOrEqual(desk.y + desk.height + 1);
    expect(win.x + win.width).toBeGreaterThanOrEqual(desk.x + Math.min(MIN_VISIBLE, win.width) - 1);
    expect(win.x).toBeLessThanOrEqual(desk.x + desk.width - Math.min(MIN_VISIBLE, win.width) + 1);
  };
  await check();

  const stranded = await box(page, 'section.gw-window');
  await page.mouse.move(stranded.x + stranded.width - 70, stranded.y + 20);
  await page.mouse.down();
  await page.mouse.move(5000, -5000, { steps: 8 });
  await page.mouse.up();
  await check();

  await page.setViewportSize({ width: 800, height: 600 });
  await check();
  await page.setViewportSize({ width: 1440, height: 900 });
  await check();
});

test('narrow viewports switch to full-screen panels and back without losing the app', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  const projects = windowRegion(page, 'Projects');
  await expect(projects).toHaveAttribute('data-mode', 'panel');
  const panel = await box(page, 'section.gw-window');
  expect(panel.width).toBeCloseTo(390, 0);
  await projects.getByRole('button', { name: 'Apps', exact: true }).click();
  await expect(projects).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Apps' }).getByRole('button', { name: /Projects/ })).toBeFocused();

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(dock(page)).toBeVisible();
  await dock(page).getByRole('button', { name: 'Projects, minimized' }).click();
  await expect(projects).toHaveAttribute('data-mode', 'normal');
  const restored = await box(page, 'section.gw-window');
  expect(restored.width).toBeLessThan(1440);
});

test('reduced motion turns off the window animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  expect(await page.locator('section.gw-window').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await page.getByRole('button', { name: 'Close Projects' }).click();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  expect(await page.locator('section.gw-window').evaluate((el) => getComputedStyle(el).animationName)).toBe('gw-open');
});

test('200% zoom (640×450 CSS px) uses panels without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 450 });
  const launcher = page.getByRole('navigation', { name: 'Apps' });
  await expect(launcher).toBeVisible();
  await launcher.getByRole('button', { name: /Projects/ }).click();
  await expect(windowRegion(page, 'Projects')).toHaveAttribute('data-mode', 'panel');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('has no axe violations empty, with two windows, and in panel mode', async ({ page }) => {
  const scan = async (label: string) => {
    const { violations } = await new AxeBuilder({ page }).include('.gw').analyze();
    expect(violations.map((v) => `${label}: ${v.id} (${v.nodes.length})`)).toEqual([]);
  };
  await scan('empty');
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  await dock(page).getByRole('button', { name: 'Terminal' }).click();
  await page.locator('#gw-term-field').fill('help');
  await page.locator('#gw-term-field').press('Enter');
  await scan('two windows');
  await page.setViewportSize({ width: 390, height: 844 });
  await scan('panels');
});

test('the portfolio home page does not load workspace code', async ({ browser }) => {
  /** Script and stylesheet URLs a fresh visit to `path` downloads, optionally after interacting with the page. */
  const assetsFor = async (path: string, interact?: (p: import('@playwright/test').Page) => Promise<void>) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const urls = new Set<string>();
    page.on('request', (r) => {
      if (['script', 'stylesheet'].includes(r.resourceType())) urls.add(new URL(r.url()).pathname);
    });
    await page.goto(path, { waitUntil: 'networkidle' });
    if (interact) await interact(page);
    await page.waitForLoadState('networkidle');
    await context.close();
    return urls;
  };

  const plain = await assetsFor('/contact/');
  const workspaceOnly = [...(await assetsFor('/workspace/'))].filter((u) => !plain.has(u));
  expect(workspaceOnly.length, 'the workspace route has its own code').toBeGreaterThan(0);

  const home = await assetsFor('/', async (page) => {
    await page.mouse.wheel(0, 20000);
    for (const link of await page.getByRole('link', { name: /workspace/i }).all()) {
      if (await link.isVisible()) await link.hover();
    }
    await page.waitForTimeout(1500);
  });
  expect(workspaceOnly.filter((u) => home.has(u))).toEqual([]);
});
