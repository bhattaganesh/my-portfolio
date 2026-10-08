import AxeBuilder from '@axe-core/playwright';
import { dock, expect, settle, test, windowRegion } from './fixtures';

test('the Architecture Lab responds to each setting with consistent numbers and explanations', async ({ page }) => {
  await page.goto('/workspace/');
  await dock(page).getByRole('button', { name: 'Architecture Lab' }).click();
  const lab = windowRegion(page, 'Architecture Lab');
  await expect(lab.getByText('Simulation · made-up numbers')).toBeVisible();
  await expect(lab.getByRole('region', { name: 'What happened' })).toContainText('so a line builds up');
  await expect(lab.getByRole('region', { name: 'What happened' })).toContainText('requests were turned away');

  await lab.getByLabel('On, answers 80%').check();
  await expect(lab.getByRole('region', { name: 'What happened' })).toContainText('within the 50 the workers can handle');
  await expect(lab.getByRole('region', { name: 'What happened' })).toContainText('Every request was answered within the minute.');
  await expect(lab.getByText('No requests failed.')).toBeVisible();

  await lab.getByLabel('Off', { exact: true }).check();
  await lab.getByLabel('Down for 10 s').check();
  await lab.getByLabel('Fail fast').check();
  await expect(lab.getByRole('figure', { name: /Failed requests per second/ })).toBeVisible();

  await lab.getByText('Show the numbers, second by second').click();
  await expect(lab.getByRole('table').locator('tbody tr')).toHaveCount(60);

  await settle(page);
  const { violations } = await new AxeBuilder({ page }).include('.gw').analyze();
  expect(violations.map((v) => `${v.id} ${v.nodes[0]?.target}`)).toEqual([]);
});

test('the Browser can close the current tab from its toolbar', async ({ page }) => {
  await page.goto('/workspace/');
  await dock(page).getByRole('button', { name: 'Browser' }).click();
  const br = windowRegion(page, 'Browser');
  await br.getByRole('button', { name: 'New tab' }).click();
  await expect(br.getByRole('tab')).toHaveCount(2);
  await br.getByRole('button', { name: 'Close this tab' }).click();
  await expect(br.getByRole('tab')).toHaveCount(1);
});
