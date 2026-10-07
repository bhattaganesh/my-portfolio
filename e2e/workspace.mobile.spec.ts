import { box, expect, settle, test, windowRegion } from './fixtures';

/** Minimum touch target for workspace controls on phones (plan: 44 CSS px). */
const TOUCH_TARGET = 44;

test('touch: launcher → full-screen panel → back, with focus returning to the tile', async ({ page }) => {
  await page.goto('/workspace/');
  const launcher = page.getByRole('navigation', { name: 'Apps' });
  await launcher.getByRole('button', { name: /Projects/ }).tap();

  const projects = windowRegion(page, 'Projects');
  await expect(projects).toHaveAttribute('data-mode', 'panel');
  const viewport = page.viewportSize()!;
  const panel = await box(page, 'section.gw-window:not([hidden])');
  expect(panel.width).toBeCloseTo(viewport.width, 0);

  await projects.getByRole('button', { name: 'All projects' }).tap();
  await projects.getByRole('button', { name: 'Everest Forms' }).tap();
  await expect(projects.getByRole('heading', { name: 'Everest Forms', level: 3 })).toBeVisible();

  await projects.getByRole('button', { name: 'Apps', exact: true }).tap();
  await expect(projects).toBeHidden();
  await expect(launcher.getByRole('button', { name: /Projects/ })).toBeFocused();

  await launcher.getByRole('button', { name: /Terminal/ }).tap();
  const terminal = windowRegion(page, 'Terminal');
  await terminal.getByRole('button', { name: 'about', exact: true }).tap();
  await expect(page.getByRole('log', { name: 'Terminal output' })).toContainText('Senior full-stack engineer');
  await terminal.getByRole('button', { name: 'Close', exact: true }).tap();
  await expect(terminal).toHaveCount(0);
  await expect(launcher.getByRole('button', { name: /Terminal/ })).toBeFocused();
});

test('a full-screen panel keeps keyboard focus off the covered launcher and covered panels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/workspace/');
  const launcher = page.getByRole('navigation', { name: 'Apps' });

  const sweep = async (visibleTitle: string) => {
    const leaks: string[] = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const where = await page.evaluate((title) => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        if (el.closest('.gw-launcher')) return `launcher: ${el.textContent?.trim().slice(0, 30)}`;
        const section = el.closest('section.gw-window');
        const label = section?.querySelector('h2')?.textContent;
        return section && label !== title ? `covered ${label}: ${el.textContent?.trim().slice(0, 30)}` : null;
      }, visibleTitle);
      if (where) leaks.push(where);
    }
    return leaks;
  };

  await launcher.getByRole('button', { name: /Projects/ }).tap();
  await expect(windowRegion(page, 'Projects')).toHaveAttribute('data-mode', 'panel');
  expect(await sweep('Projects')).toEqual([]);
  await expect(launcher).toHaveAttribute('inert', '');

  await windowRegion(page, 'Projects').getByRole('button', { name: 'Apps', exact: true }).tap();
  await expect(launcher.getByRole('button', { name: /Projects/ })).toBeFocused();
  await expect(launcher).not.toHaveAttribute('inert');

  await launcher.getByRole('button', { name: /Terminal/ }).tap();
  await page.locator('#gw-term-field').fill('projects spectra');
  await page.locator('#gw-term-field').press('Enter');
  await expect(windowRegion(page, 'Projects').getByRole('heading', { name: 'Spectra', level: 3 })).toBeVisible();
  expect(await sweep('Projects')).toEqual([]);

  await windowRegion(page, 'Projects').getByRole('button', { name: 'Close', exact: true }).tap();
  await expect(page.locator('#gw-term-field')).toBeFocused();
  await windowRegion(page, 'Terminal').getByRole('button', { name: 'Close', exact: true }).tap();
  await expect(launcher.getByRole('button', { name: /Terminal/ })).toBeFocused();
});

test('touch targets in the launcher and panels are at least 44px', async ({ page }) => {
  await page.goto('/workspace/');
  const small: string[] = [];
  const measure = async (selector: string) => {
    await settle(page);
    for (const el of await page.locator(selector).all()) {
      if (!(await el.isVisible())) continue;
      const b = (await el.boundingBox())!;
      if (b.height < TOUCH_TARGET) small.push(`${selector} "${(await el.innerText()).trim()}" ${b.width}×${b.height}`);
    }
  };
  await measure('.gw-launcher button');
  await measure('.gw-menubar-link');
  await page.getByRole('navigation', { name: 'Apps' }).getByRole('button', { name: /Terminal/ }).tap();
  await measure('.gw-panelbar button');
  await measure('.gw-term-chips button');
  expect(small).toEqual([]);
});

test('the browser Back button closes a panel back to the apps, and a link can open an app directly', async ({ page }) => {
  await page.goto('/workspace/');
  const launcher = page.getByRole('navigation', { name: 'Apps' });
  await launcher.getByRole('button', { name: /About Ganesh/ }).tap();
  await expect(page).toHaveURL(/#about$/);
  await expect(windowRegion(page, 'About Ganesh')).toBeVisible();

  await page.goBack();
  await expect(windowRegion(page, 'About Ganesh')).toBeHidden();
  await expect(page).toHaveURL(/\/workspace\/$/);
  await expect(launcher.getByRole('button', { name: /About Ganesh/ })).toBeFocused();

  await launcher.getByRole('button', { name: /Settings/ }).tap();
  await windowRegion(page, 'Settings').getByRole('button', { name: 'Apps', exact: true }).tap();
  await expect(page).toHaveURL(/\/workspace\/$/);
  await expect(launcher.getByRole('button', { name: /Settings/ })).toBeFocused();

  await page.goto('/workspace/#projects');
  await expect(windowRegion(page, 'Projects')).toHaveAttribute('data-mode', 'panel');
  await expect(page.locator('#gw-title-projects')).toBeFocused();
});
