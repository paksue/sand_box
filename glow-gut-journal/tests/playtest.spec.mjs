import { test, expect } from '@playwright/test';

async function entries(page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('glowGutJournal');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const req = db.transaction('entries', 'readonly').objectStore('entries').getAll();
      req.onerror = () => reject(req.error);
      req.onsuccess = () => { resolve(req.result); db.close(); };
    };
  }));
}

async function onboard(page) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start using Glow' })).toBeVisible();
  await page.getByRole('button', { name: 'Start using Glow' }).click();
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
}

test('teen core logging keeps unknown values unknown and supports correction', async ({ page }) => {
  await onboard(page);

  await page.locator('[data-log="meal"]').click();
  const meal = page.locator('form[data-form="meal"]');
  await expect(meal.locator('.qa-choice-grid').first()).toBeVisible();
  await meal.locator('input[name="time"]').fill('19:00');
  await meal.locator('input[name="time"]').press('Tab');
  await expect(meal.locator('.qa-choice[data-value="dinner"]')).toHaveClass(/selected/);
  await meal.locator('textarea[name="description"]').fill('rice + chicken + vegetables');
  await meal.getByRole('button', { name: 'Save meal' }).click();
  await expect(page.locator('.entry-title').filter({ hasText: 'Dinner · rice + chicken + vegetables' })).toBeVisible();

  await page.locator('[data-log="poop"]').click();
  await page.getByRole('button', { name: /TYPE 4/i }).click();
  const poop = page.locator('form[data-form="poop"]');
  await expect(poop.locator('.qa-score-clear')).toHaveClass(/selected/);
  await poop.getByRole('button', { name: 'Save poop' }).click();

  let saved = await entries(page);
  const poopEntry = saved.find(e => e.type === 'poop');
  expect(poopEntry.bristol).toBe(4);
  expect(Object.hasOwn(poopEntry, 'amount')).toBeFalsy();
  expect(Object.hasOwn(poopEntry, 'pain')).toBeFalsy();
  expect(Object.hasOwn(poopEntry, 'blood')).toBeFalsy();

  await page.locator('[data-log="drink"]').click();
  const drink = page.locator('form[data-form="drink"]');
  await expect(drink.locator('.qa-choice[data-value="fewSips"]')).toBeVisible();
  await drink.locator('.qa-choice[data-value="fewSips"]').click();
  await drink.getByRole('button', { name: 'Add drink' }).click();
  saved = await entries(page);
  const drinkEntry = saved.find(e => e.type === 'drink');
  expect(drinkEntry.estimate).toBe('fewSips');
  expect(Object.hasOwn(drinkEntry, 'estimatedOz')).toBeFalsy();
  await expect(page.locator('[data-entry-id]').filter({ hasText: 'Qualitative amount: few sips' })).toBeVisible();

  const mealCard = page.locator('[data-entry-id]').filter({ hasText: 'Dinner · rice + chicken + vegetables' });
  await mealCard.getByRole('button', { name: 'Entry options' }).click();
  await page.getByRole('button', { name: /Edit entry/i }).click();
  const edit = page.locator('#qa-edit-form');
  await expect(edit).toBeVisible();
  await edit.locator('textarea[name="description"]').fill('rice + chicken + broccoli');
  await edit.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.locator('.entry-title').filter({ hasText: 'Dinner · rice + chicken + broccoli' })).toBeVisible();
});

test('7-day summary follows tracking start and distinguishes missing from confirmed no-poop', async ({ page }) => {
  await onboard(page);

  await page.locator('[data-action="open-wrap"]').click();
  const wrap = page.locator('form[data-form="wrap"]');
  await expect(wrap.locator('select[name="worstBloat"]')).toHaveValue('');
  await wrap.locator('select[name="poopSummary"]').selectOption('none');
  await wrap.getByRole('button', { name: 'Finish today' }).click();

  let saved = await entries(page);
  const wrapEntry = saved.find(e => e.type === 'wrap');
  expect(wrapEntry.poopSummary).toBe('none');
  expect(Object.hasOwn(wrapEntry, 'worstBloat')).toBeFalsy();

  await page.locator('[data-tab="insights"]').click();
  const bowelMetric = page.locator('.metric').filter({ hasText: 'Bowel movements' });
  await expect(bowelMetric.locator('.settled-metric-foot')).toContainText('1 confirmed no-poop');
  await expect(page.locator('#qa-tracking-note')).toContainText('Missing entries are not treated as “no poop.”');

  await page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('glowGutJournal');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const get = store.get('preferences');
      get.onsuccess = () => {
        store.put({ key: 'preferences', value: { ...(get.result?.value || {}), onboarded: true, startDate: '2020-01-02' } });
      };
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => reject(tx.error);
    };
  }));
  await page.reload();
  await page.locator('[data-tab="insights"]').click();
  await expect(page.locator('.hero .subtle')).toContainText('Jan 2');
  await expect(page.locator('.hero .subtle')).toContainText('Jan 8');
  await expect(page.locator('.hero .subtle')).toContainText('tracking period');
});
