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

async function openGame(page, viewport = { width: 1440, height: 900 }) {
  const errors = captureErrors(page);
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${baseURL}/the-rule/`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('button', { name: 'BEGIN' })).toBeVisible();
  return errors;
}

async function beginAtTrolley(page) {
  await page.getByRole('button', { name: 'BEGIN' }).click();
  await expect(page.getByText('Five people are going to die.')).toBeVisible();
  await expect(page.getByRole('button', { name: /PULL THE LEVER/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /DO NOTHING/ })).toBeVisible();
}

async function pullAndReachRationale(page) {
  await page.getByRole('button', { name: /PULL THE LEVER/ }).click();
  await expect(page.getByText('One person died. Five people lived.')).toBeVisible({ timeout: 4000 });
  await page.getByRole('button', { name: /WHY DID I CHOOSE THAT/ }).click();
  await expect(page.getByText('COMMIT YOUR REASON')).toBeVisible();
}

async function createRuleAndReachBridge(page) {
  await page.getByRole('button', { name: 'If someone must die, fewer deaths is better.' }).click();
  await expect(page.getByText('You have given me a rule.')).toBeVisible();
  await expect(page.getByText('RULE 01')).toBeVisible();
  await page.getByRole('button', { name: /TEST THE RULE/ }).click();
  await expect(page.getByText('Your rule says: PUSH HIM.')).toBeVisible();
}

test('[stage-1] boot, trolley choice and consequence', async ({ page }) => {
  const errors = await openGame(page);
  await beginAtTrolley(page);
  await page.screenshot({ path: 'test-results/01-trolley.png', fullPage: true });
  await page.getByRole('button', { name: /PULL THE LEVER/ }).click();
  await expect(page.getByText('One person died. Five people lived.')).toBeVisible({ timeout: 4000 });
  expect(errors, errors.join('\n')).toEqual([]);
});

test('[stage-2] rationale creates rule and predicts bridge choice', async ({ page }) => {
  const errors = await openGame(page);
  await beginAtTrolley(page);
  await pullAndReachRationale(page);
  await createRuleAndReachBridge(page);
  await page.screenshot({ path: 'test-results/02-bridge-rule.png', fullPage: true });
  expect(errors, errors.join('\n')).toEqual([]);
});

test('[stage-3] contradiction exposes mismatch and mutates the case', async ({ page }) => {
  const errors = await openGame(page);
  await beginAtTrolley(page);
  await pullAndReachRationale(page);
  await createRuleAndReachBridge(page);

  await page.getByRole('button', { name: /^REFUSE/ }).click();
  await expect(page.getByText('YOUR RULE DID NOT PREDICT YOU')).toBeVisible({ timeout: 4000 });
  await expect(page.getByText('Same arithmetic. Different answer.')).toBeVisible();
  await page.screenshot({ path: 'test-results/03-contradiction.png', fullPage: true });

  await page.getByRole('button', { name: 'WHAT CHANGED?' }).click();
  await page.getByRole('button', { name: 'I had to physically push him.' }).click();
  await expect(page.getByText('The Button')).toBeVisible();
  await expect(page.getByText('VARIABLE REMOVED: PHYSICAL CONTACT')).toBeVisible();
  await page.screenshot({ path: 'test-results/04-mutation.png', fullPage: true });
  expect(errors, errors.join('\n')).toEqual([]);
});

test('[stage-4] phone portrait primary controls stay usable', async ({ page }) => {
  const errors = await openGame(page, { width: 390, height: 844 });
  await beginAtTrolley(page);

  const pull = page.getByRole('button', { name: /PULL THE LEVER/ });
  const stay = page.getByRole('button', { name: /DO NOTHING/ });
  const pullBox = await pull.boundingBox();
  const stayBox = await stay.boundingBox();
  expect(pullBox?.width ?? 0).toBeGreaterThan(300);
  expect(pullBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(stayBox?.height ?? 0).toBeGreaterThanOrEqual(44);
  await page.screenshot({ path: 'test-results/05-phone.png', fullPage: true });
  expect(errors, errors.join('\n')).toEqual([]);
});
