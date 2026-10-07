import AxeBuilder from '@axe-core/playwright';
import { box, dock, expect, test, windowRegion } from './fixtures';

const PREFS_KEY = 'gw.prefs.v2';

test.beforeEach(async ({ page }) => {
  await page.goto('/workspace/');
  await expect(page.locator('.gw')).toBeVisible();
});

test('Mission Control lists open and minimized windows and switches between them', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  await dock(page).getByRole('button', { name: 'About Ganesh' }).click();
  await page.getByRole('button', { name: 'Minimize About Ganesh' }).click();

  const opener = page.getByRole('button', { name: 'Mission Control' });
  await opener.click();
  const mc = page.getByRole('dialog', { name: 'Mission Control' });
  await expect(mc.getByRole('button', { name: /Projects\s*Active/ })).toBeFocused();
  await expect(mc.getByRole('button', { name: /About Ganesh\s*Minimized/ })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Dock' })).toHaveAttribute('inert', '');

  await page.keyboard.press('Escape');
  await expect(mc).toHaveCount(0);
  await expect(opener).toBeFocused();

  await page.keyboard.press('Control+ArrowUp');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(mc).toHaveCount(0);
  await expect(windowRegion(page, 'About Ganesh')).toBeVisible();
  // Restoring returns focus to where it last was inside the window (WebKit does not focus clicked buttons).
  await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('[aria-labelledby="gw-title-about"]'))).toBe(true);
});

test('Mission Control offers the apps when nothing is open, and choosing the active window keeps focus in it', async ({ page }) => {
  await page.getByRole('button', { name: 'Mission Control' }).click();
  const mc = page.getByRole('dialog', { name: 'Mission Control' });
  await expect(mc).toContainText('No windows are open');
  await mc.getByRole('button', { name: /Terminal/ }).click();
  await expect(page.locator('#gw-title-terminal')).toBeFocused();

  await page.keyboard.press('Control+ArrowUp');
  await page.keyboard.press('Enter');
  await expect(page.locator('#gw-title-terminal')).toBeFocused();
});

test('Spotlight finds apps, projects and commands, and treats hostile input as text', async ({ page }) => {
  const opener = page.getByRole('button', { name: 'Search' });
  await opener.click();
  const field = page.getByRole('combobox', { name: 'Search apps, projects and commands' });
  await expect(field).toBeFocused();
  await field.fill('masteriyo');
  await expect(page.getByRole('option', { name: /Masteriyo LMS/ })).toHaveAttribute('aria-selected', 'true');
  await field.press('Enter');
  await expect(windowRegion(page, 'Projects').getByRole('heading', { name: 'Masteriyo LMS', level: 3 })).toBeVisible();

  await page.keyboard.press('Control+k');
  await field.fill('<img src=x onerror=alert(1)>');
  await expect(page.getByRole('option')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Search the workspace' })).toContainText('No matches for');
  await field.fill('journ');
  await field.press('ArrowDown');
  await field.press('ArrowUp');
  await field.press('Enter');
  await expect(page.getByRole('log', { name: 'Terminal output' })).toContainText('joined Jan 2025 · Software Developer, Brainstorm Force');

  await page.keyboard.press('Control+k');
  await page.keyboard.press('Escape');
  await expect(field).toHaveCount(0);
});

test('the desktop context menu changes the wallpaper, with a keyboard route through the menu bar', async ({ page }) => {
  const desk = await box(page, '.gw-desk');
  await page.mouse.click(desk.x + 300, desk.y + 300, { button: 'right' });
  const menu = page.getByRole('menu', { name: 'Desktop' });
  await expect(menu.getByRole('menuitemradio', { name: 'Wallpaper: Himalayan dawn' })).toHaveAttribute('aria-checked', 'true');
  await menu.getByRole('menuitemradio', { name: 'Wallpaper: Himalayan dusk' }).click();
  await expect(page.locator('.gw')).toHaveAttribute('data-wallpaper', 'dusk');

  const workspaceMenu = page.getByRole('button', { name: 'Ganesh Workspace' });
  await workspaceMenu.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: 'About Ganesh' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('#gw-title-settings')).toBeFocused();
  await expect(windowRegion(page, 'Settings').getByLabel('Himalayan dusk')).toBeChecked();
});

test('dock items have a context menu that opens from the keyboard and returns focus', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  const item = dock(page).getByRole('button', { name: 'Projects, open' });
  await item.focus();
  await page.keyboard.press('Shift+F10');
  const menu = page.getByRole('menu', { name: 'Projects options' });
  await expect(menu.getByRole('menuitem').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(item).toBeFocused();

  await item.click({ button: 'right' });
  await menu.getByRole('menuitem', { name: 'Minimize Projects' }).click();
  await expect(windowRegion(page, 'Projects')).toBeHidden();
  await expect(dock(page).getByRole('button', { name: 'Projects, minimized' })).toBeFocused();
});

test('appearance, wallpaper and window layout are remembered, and Reset restores the defaults', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Settings' }).click();
  const settings = windowRegion(page, 'Settings');
  await settings.getByLabel('Dark').check();
  await settings.getByLabel('Himalayan night').check();
  await page.getByRole('button', { name: 'Window options for Settings' }).click();
  await page.getByRole('menuitem', { name: 'Move with keyboard' }).click();
  for (let i = 0; i < 4; i++) await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('Enter');
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  const before = await box(page, 'section[aria-labelledby="gw-title-settings"]');
  await page.waitForTimeout(600);

  await page.reload();
  await expect(page.locator('.gw')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.gw')).toHaveAttribute('data-wallpaper', 'night');
  await expect(windowRegion(page, 'Projects')).toBeVisible();
  expect(await box(page, 'section[aria-labelledby="gw-title-settings"]')).toEqual(before);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('.gw-window')!).backgroundColor)).toBe('rgb(31, 32, 36)');

  await dock(page).getByRole('button', { name: 'Settings, open' }).click();
  await windowRegion(page, 'Settings').getByRole('button', { name: 'Reset workspace…' }).click();
  await expect(windowRegion(page, 'Settings').getByRole('button', { name: 'Cancel' })).toBeFocused();
  await windowRegion(page, 'Settings').getByRole('button', { name: 'Reset everything' }).click();
  await expect(page.locator('.gw')).toHaveAttribute('data-theme', 'system');
  await expect(page.locator('.gw')).toHaveAttribute('data-wallpaper', 'dawn');
  await expect(windowRegion(page, 'Projects')).toHaveCount(0);
  await expect(page.locator('#gw-title-settings')).toBeFocused();
});

test('corrupt or blocked storage falls back to defaults without errors', async ({ page, context }) => {
  await page.evaluate((key) => localStorage.setItem(key, '{"theme":"dark","wallpaper":"javascript:alert(1)"'), PREFS_KEY);
  await page.reload();
  await expect(page.locator('.gw')).toHaveAttribute('data-wallpaper', 'dawn');

  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('blocked', 'SecurityError');
      },
    });
  });
  await page.reload();
  await dock(page).getByRole('button', { name: 'Settings' }).click();
  const settings = windowRegion(page, 'Settings');
  await expect(settings).toContainText('not allowing the workspace to save anything');
  await settings.getByLabel('Dark').check();
  await expect(page.locator('.gw')).toHaveAttribute('data-theme', 'dark');
});

test('the Reduce motion setting turns off animation even when the device allows it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await dock(page).getByRole('button', { name: 'Settings' }).click();
  await windowRegion(page, 'Settings').getByLabel('Reduce motion').check();
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  expect(await windowRegion(page, 'Projects').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
});

test('sound is off by default and creates no audio context until it is turned on', async ({ page, context }) => {
  await context.addInitScript(() => {
    const w = window as unknown as { audioContexts: number; AudioContext: typeof AudioContext };
    w.audioContexts = 0;
    const Real = w.AudioContext;
    if (!Real) return;
    w.AudioContext = class extends Real {
      constructor() {
        super();
        w.audioContexts++;
      }
    };
  });
  await page.reload();
  const contexts = () => page.evaluate(() => (window as unknown as { audioContexts: number }).audioContexts);
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  await page.getByRole('button', { name: 'Close Projects' }).click();
  expect(await contexts()).toBe(0);

  await dock(page).getByRole('button', { name: 'Settings' }).click();
  await windowRegion(page, 'Settings').getByLabel(/Play soft sounds/).check();
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  // Some engines (Playwright's WebKit on Windows) have no Web Audio; sound then stays a silent no-op.
  const supported = await page.evaluate(() => 'AudioContext' in window);
  expect(await contexts()).toBe(supported ? 1 : 0);
});

test('the terminal opens apps by name and Projects shows the traced architecture', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Terminal' }).click();
  const field = page.locator('#gw-term-field');
  await field.fill('open ab');
  await field.press('Tab');
  await expect(field).toHaveValue('open about');
  await field.press('Enter');
  await expect(windowRegion(page, 'About Ganesh')).toBeVisible();
  await expect(windowRegion(page, 'About Ganesh')).not.toContainText(/\b(now|present|currently)\b/i);

  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('wp agent');
  await page.keyboard.press('Enter');
  const projects = windowRegion(page, 'Projects');
  await expect(projects.getByRole('img', { name: /How a request flows through WP Agent AI: Prompt, then Guard/ })).toBeVisible();
  await expect(projects.getByRole('link', { name: /^Source: / })).toHaveCount(9);
  await expect(projects.getByRole('link', { name: 'Open the full case study on the portfolio' })).toHaveAttribute('href', '/work/wp-agent-ai/');
});

test('has no axe violations with every app open in both themes, in Mission Control, Spotlight and a menu', async ({ page }) => {
  const scan = async (label: string) => {
    const { violations } = await new AxeBuilder({ page }).include('.gw').analyze();
    expect(violations.map((v) => `${label}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`)).toEqual([]);
  };
  for (const app of ['Projects', 'Terminal', 'About Ganesh', 'Settings']) await dock(page).getByRole('button', { name: app }).click();
  await scan('light, four windows');
  await windowRegion(page, 'Settings').getByLabel('Dark').check();
  await scan('dark, four windows');
  await page.getByRole('button', { name: 'Mission Control' }).click();
  await scan('mission control');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('s');
  await scan('spotlight');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Ganesh Workspace' }).click();
  await scan('workspace menu');
});

test('a saved layout survives a visit that starts narrow and is then widened', async ({ page }) => {
  await dock(page).getByRole('button', { name: 'Projects' }).click();
  await dock(page).getByRole('button', { name: 'About Ganesh' }).click();
  await page.waitForTimeout(600);
  await page.setViewportSize({ width: 600, height: 800 });
  await page.reload();
  await expect(page.getByRole('navigation', { name: 'Apps' })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(windowRegion(page, 'Projects')).toBeVisible();
  await expect(windowRegion(page, 'About Ganesh')).toBeVisible();
});

test('a command sent from Spotlight runs once, not again when Terminal reopens', async ({ page }) => {
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox').fill('skills');
  await page.keyboard.press('Enter');
  const log = page.getByRole('log', { name: 'Terminal output' });
  await expect(log.locator('.gw-term-echo')).toHaveCount(1);
  await page.getByRole('button', { name: 'Close Terminal' }).click();
  await dock(page).getByRole('button', { name: 'Terminal' }).click();
  await expect(log).toContainText('Welcome to Ganesh Workspace');
  await expect(log.locator('.gw-term-echo')).toHaveCount(0);
});
