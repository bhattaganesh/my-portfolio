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
