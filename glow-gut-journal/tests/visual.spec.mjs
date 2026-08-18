import { test, expect } from '@playwright/test';

async function onboard(page) {
  await page.goto('/');
  const start = page.getByRole('button', { name: 'Start using Glow' });
  if (await start.isVisible().catch(() => false)) await start.click();
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
}

async function addMeal(page) {
  await page.locator('[data-log="meal"]').click();
  const form = page.locator('form[data-form="meal"]');
  await form.locator('textarea[name="description"]').fill('rice + chicken + vegetables');
  await form.getByRole('button', { name: 'Save meal' }).click();
}

test('persist iPhone-size UI review screenshots', async ({ page }, testInfo) => {
  await onboard(page);
  await addMeal(page);
  await page.screenshot({ path: testInfo.outputPath('today-mobile.png'), fullPage: true });

  await page.locator('[data-log="poop"]').click();
  await page.screenshot({ path: testInfo.outputPath('bristol-mobile.png'), fullPage: true });
  await page.locator('[data-bristol="4"]').click();
  await page.locator('form[data-form="poop"]').getByRole('button', { name: 'Save poop' }).click();

  await page.locator('[data-tab="insights"]').click();
  await page.screenshot({ path: testInfo.outputPath('insights-mobile.png'), fullPage: true });

  await page.locator('[data-tab="more"]').click();
  await page.locator('[data-action="doctor-report"]').click();
  await expect(page.locator('#polish-report-controls')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('doctor-report-mobile.png'), fullPage: true });
});
