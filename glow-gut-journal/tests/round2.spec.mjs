import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

async function onboard(page) {
  await page.goto('/');
  const start = page.getByRole('button', { name: 'Start using Glow' });
  if (await start.isVisible().catch(() => false)) await start.click();
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
}

async function allEntries(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('glowGutJournal');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const req = db.transaction('entries', 'readonly').objectStore('entries').getAll();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => { resolve(req.result.map(entry => ({ ...entry, photo: entry.photo ? { size: entry.photo.size, type: entry.photo.type } : null }))); db.close(); };
    };
  }));
}

async function addSimpleMeal(page, description = 'rice + chicken') {
  await page.locator('[data-log="meal"]').click();
  const form = page.locator('form[data-form="meal"]');
  await form.locator('textarea[name="description"]').fill(description);
  await form.getByRole('button', { name: 'Save meal' }).click();
  await expect(page.locator('.entry-title').filter({ hasText: description })).toBeVisible();
}

test('unsaved changes are protected, delete is undoable, and dialog focus is accessible', async ({ page }) => {
  await onboard(page);
  await page.locator('[data-log="meal"]').click();
  const form = page.locator('form[data-form="meal"]');
  await expect(page.locator('.sheet-title')).toBeFocused();
  await form.locator('textarea[name="description"]').fill('toast + yogurt');

  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    await dialog.dismiss();
  });
  await page.locator('[data-sheet-action="close"]').click();
  await expect(form).toBeVisible();

  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-sheet-action="close"]').click();
  await expect(form).toHaveCount(0);

  await addSimpleMeal(page, 'rice + chicken');
  const card = page.locator('[data-entry-id]').filter({ hasText: 'rice + chicken' });
  await card.getByRole('button', { name: 'Entry options' }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-sheet-action="delete-entry"]').click();
  await expect(page.locator('.entry-title').filter({ hasText: 'rice + chicken' })).toHaveCount(0);
  await expect(page.locator('[data-polish-undo]')).toBeVisible();
  await page.locator('[data-polish-undo]').click();
  await expect(page.locator('.entry-title').filter({ hasText: 'rice + chicken' })).toBeVisible();
});

test('period and habit check-in plus safety note persist without defaulting skipped fields', async ({ page }) => {
  await onboard(page);
  await page.locator('[data-log="checkin"]').click();
  const checkin = page.locator('form[data-form="checkin"]');
  await checkin.locator('select[name="periodStartedToday"]').selectOption('yes');
  await checkin.locator('input[name="daysLate"]').fill('3');
  await checkin.locator('select[name="heldPoop"]').selectOption('yes');
  await checkin.locator('select[name="activity"]').selectOption('some');
  await checkin.locator('select[name="stress"]').selectOption('medium');
  await checkin.locator('select[name="urineColor"]').selectOption('pale');
  await checkin.getByRole('button', { name: 'Save daily check-in' }).click();

  await page.locator('[data-tab="more"]').click();
  await page.locator('[data-action="safety"]').click();
  const safety = page.locator('form[data-form="safety"]');
  await safety.locator('[data-multi="safety"][data-value="fever"]').click();
  await safety.getByRole('button', { name: 'Save safety note' }).click();

  const entries = await allEntries(page);
  const daily = entries.find(entry => entry.type === 'checkin');
  expect(daily.periodStartedToday).toBe('yes');
  expect(daily.daysLate).toBe('3');
  expect(daily.heldPoop).toBe('yes');
  expect(daily.activity).toBe('some');
  expect(daily.stress).toBe('medium');
  expect(daily.urineColor).toBe('pale');
  expect(daily.appetite).toBe('');
  const safetyEntry = entries.find(entry => entry.type === 'safety');
  expect(safetyEntry.flags).toContain('fever');
});

test('photo preview, complete backup, clear, and restore preserve the local photo', async ({ page }, testInfo) => {
  await onboard(page);
  await page.locator('[data-log="meal"]').click();
  const meal = page.locator('form[data-form="meal"]');
  await meal.locator('textarea[name="description"]').fill('photo meal');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
  await meal.locator('input[name="photo"]').setInputFiles({ name: 'meal.png', mimeType: 'image/png', buffer: png });
  await expect(meal.locator('.polish-photo-preview img')).toBeVisible();
  await meal.getByRole('button', { name: 'Save meal' }).click();

  let entries = await allEntries(page);
  expect(entries.find(entry => entry.type === 'meal')?.photo?.size).toBeGreaterThan(0);

  await page.locator('[data-tab="more"]').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export-json"]').click();
  const download = await downloadPromise;
  const backupPath = testInfo.outputPath('glow-backup.json');
  await download.saveAs(backupPath);
  const backup = JSON.parse(await fs.readFile(backupPath, 'utf8'));
  expect(backup.entries.find(entry => entry.type === 'meal')?.photo).toMatch(/^data:image\/png;base64,/);

  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-action="clear-data"]').click();
  entries = await allEntries(page);
  expect(entries).toHaveLength(0);

  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-file').setInputFiles(backupPath);
  await expect(page.getByText('Backup restored')).toBeVisible();
  entries = await allEntries(page);
  expect(entries.find(entry => entry.type === 'meal')?.photo?.size).toBeGreaterThan(0);
});

test('doctor report requires an explicit choice to include period information and prints cleanly', async ({ page }) => {
  await onboard(page);
  await page.locator('[data-tab="more"]').click();
  await page.locator('[data-action="doctor-report"]').click();
  await expect(page.locator('#polish-report-controls')).toBeVisible();
  const periodHeading = page.locator('#doctor-report h2').filter({ hasText: /^Period$/ });
  await expect(periodHeading).toBeHidden();
  const toggle = page.locator('[data-report-toggle="period"]');
  await expect(toggle).not.toBeChecked();
  await toggle.check();
  await expect(periodHeading).toBeVisible();
  await toggle.uncheck();
  await expect(periodHeading).toBeHidden();

  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#polish-report-controls')).toBeHidden();
  await expect(page.locator('#doctor-report')).toBeVisible();
  const pdf = await page.pdf({ format: 'A4' });
  expect(pdf.length).toBeGreaterThan(3000);
});

test('PWA shell supports mobile safe areas, camera capture, manifest, and offline reload', async ({ page, context }) => {
  await onboard(page);
  const manifest = await page.evaluate(() => fetch('manifest.webmanifest').then(response => response.json()));
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toBe('./');
  const css = await page.evaluate(() => fetch('styles.css').then(response => response.text()));
  expect(css).toContain('safe-area-inset-bottom');
  expect(css).toContain('safe-area-inset-top');
  expect(await page.locator('meta[name="glow-build"]').getAttribute('content')).toBe('round2');

  await page.locator('[data-log="meal"]').click();
  const photo = page.locator('form[data-form="meal"] input[name="photo"]');
  await expect(photo).toHaveAttribute('accept', 'image/*');
  await expect(photo).toHaveAttribute('capture', 'environment');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-sheet-action="close"]').click();

  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBeTruthy();
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
  await context.setOffline(false);
});

test('capture mobile screenshots for visual review', async ({ page }, testInfo) => {
  await onboard(page);
  await addSimpleMeal(page, 'rice + chicken + vegetables');
  await testInfo.attach('today-mobile', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });

  await page.locator('[data-log="poop"]').click();
  await testInfo.attach('bristol-mobile', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await page.locator('[data-bristol="4"]').click();
  await page.locator('form[data-form="poop"]').getByRole('button', { name: 'Save poop' }).click();

  await page.locator('[data-tab="insights"]').click();
  await testInfo.attach('insights-mobile', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await page.locator('[data-tab="more"]').click();
  await page.locator('[data-action="doctor-report"]').click();
  await testInfo.attach('doctor-report-mobile', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});
