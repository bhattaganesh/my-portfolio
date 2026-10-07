import { test as base, expect, type Page } from '@playwright/test';

/**
 * WebKit's message for a same-origin router fetch (a `__next.*` segment or a route payload) cancelled by a navigation.
 * Same-origin requests cannot fail a real access-control check, so only localhost URLs are matched.
 */
const CANCELLED_PREFETCH = /^(Fetch API cannot load )?(https?:)?\/\/?localhost:\d+\/[^ ]* due to access control checks\.$/;

/** Fails any test whose page logged an uncaught error or console error (hydration errors included). */
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => {
        // WebKit reports router prefetches cancelled by a navigation as access-control failures; only those are ignored.
        if (CANCELLED_PREFETCH.test(e.message)) return;
        errors.push(`pageerror: ${e.message}`);
      });
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(`console: ${m.text()}`);
      });
      page.on('dialog', (d) => {
        errors.push(`unexpected dialog: ${d.message()}`);
        void d.dismiss();
      });
      await use(errors);
      expect(errors, 'browser errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const dock = (page: Page) => page.getByRole('navigation', { name: 'Dock' });
export const windowRegion = (page: Page, title: string) => page.getByRole('region', { name: title, exact: true });

/** Bounding box of an element once its animations settle, failing loudly when it is not rendered. */
export async function box(page: Page, selector: string) {
  const target = page.locator(selector).first();
  await target.evaluate((el) => Promise.all(el.closest('section')?.getAnimations().map((a) => a.finished) ?? []));
  const b = await target.boundingBox();
  if (!b) throw new Error(`${selector} is not rendered`);
  return b;
}

/** Waits until no CSS animation is running, so measurements are not taken mid-transition. */
export async function settle(page: Page) {
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
}
