import { test, expect } from '@playwright/test';

const baseURL = process.env.THE_RULE_URL || 'http://127.0.0.1:4179';

function captureErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test('golden contradiction path', async ({ page }) => {
  const errors = captureErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/the-rule/`, { waitUntil: 'networkidle' });

  await expect(page.getByRole('button', { name: 'BEGIN' })).toBeVisible();
  await page.getByRole('button', { name: 'BEGIN' }).click();
  await expect(page.getByText('Five people are going to die.')).toBeVisible();
  await page.screenshot({ path: 'test-results/01-trolley.png', fullPage: true });

  await page.getByRole('button', { name: /PULL THE LEVER/ }).click();
  await expect(page.getByText('One person died. Five people lived.')).toBeVisible({ timeout: 6000 });
  await page.getByRole('button', { name: /WHY DID I CHOOSE THAT/ }).click();

  await page.getByRole('button', { name: 'If someone must die, fewer deaths is better.' }).click();
  await expect(page.getByText('You have given me a rule.')).toBeVisible();
  await expect(page.getByText('RULE 01')).toBeVisible();
  await page.getByRole('button', { name: /TEST THE RULE/ }).click();

  await expect(page.getByText('Your rule says: PUSH HIM.')).toBeVisible();
  await page.screenshot({ path: 'test-results/02-bridge-rule.png', fullPage: true });
  await page.getByRole('button', { name: /^REFUSE/ }).click();

  await expect(page.getByText('YOUR RULE DID NOT PREDICT YOU')).toBeVisible({ timeout: 6000 });
  await expect(page.getByText('Same arithmetic. Different answer.')).toBeVisible();
  await page.screenshot({ path: 'test-results/03-contradiction.png', fullPage: true });

  await page.getByRole('button', { name: 'WHAT CHANGED?' }).click();
  await page.getByRole('button', { name: 'I had to physically push him.' }).click();
  await expect(page.getByText('The Button')).toBeVisible();
  await expect(page.getByText('VARIABLE REMOVED: PHYSICAL CONTACT')).toBeVisible();
  await page.screenshot({ path: 'test-results/04-mutation.png', fullPage: true });

  expect(errors, errors.join('\n')).toEqual([]);
});

test('phone portrait primary controls stay usable', async ({ page }) => {
  const errors = captureErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/the-rule/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'BEGIN' }).click();

  const pull = page.getByRole('button', { name: /PULL THE LEVER/ });
  const stay = page.getByRole('button', { name: /DO NOTHING/ });
  await expect(pull).toBeVisible();
  await expect(stay).toBeVisible();

  const pullBox = await pull.boundingBox();
  const stayBox = await stay.boundingBox();
  expect(pullBox?.width ?? 0).toBeGreaterThan(300);
  expect(pullBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(stayBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  await page.screenshot({ path: 'test-results/05-phone.png', fullPage: true });

  expect(errors, errors.join('\n')).toEqual([]);
});
