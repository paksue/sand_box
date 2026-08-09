import { chromium } from 'playwright';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function closeAnyResultModal(page) {
  const modal = page.locator('#modal');
  if (!(await modal.evaluate((el) => el.open))) return;
  const first = page.locator('#modal[open] #modalChoices button:not([disabled]):visible').first();
  if (await first.count()) await first.click();
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  assert(response?.ok(), `Game did not load: ${BASE_URL}`);
  await page.waitForSelector('#pixiScene canvas', { state: 'attached' });
  await page.fill('#seedInput', 'CLASSIC-AUTOTRAVEL-TEST');
  await page.click('#startButton');
  await page.waitForSelector('#gameScreen:not(.hidden)');
  await page.waitForFunction(() => window.frontierAutoTravel && state);

  // Remove random events only for this pacing regression so Kansas River is
  // the deterministic interruption. The real daily simulation still runs.
  await page.evaluate(() => { maybeRandomEvent = () => false; });

  const start = await page.evaluate(() => ({ distance: state.distance, date: state.date }));
  await page.getByRole('button', { name: 'Travel' }).click();
  await page.waitForFunction(() => window.frontierAutoTravel.active === true);
  await page.waitForFunction(() => state.distance > 0);

  const afterOneOrMoreDays = await page.evaluate(() => ({ distance: state.distance, date: state.date }));
  assert(afterOneOrMoreDays.distance > start.distance, 'Travel did not advance the wagon');
  assert(afterOneOrMoreDays.date !== start.date, 'Travel did not advance the calendar');
  assert((await page.getByRole('button', { name: 'Stop / Inspect' }).count()) === 1, 'Primary button did not become Stop / Inspect');

  // Manual interruption must freeze the simulation without opening a modal.
  await page.getByRole('button', { name: 'Stop / Inspect' }).click();
  await page.waitForFunction(() => window.frontierAutoTravel.active === false);
  const stopped = await page.evaluate(() => ({ distance: state.distance, date: state.date }));
  await page.waitForTimeout(1400);
  const stillStopped = await page.evaluate(() => ({ distance: state.distance, date: state.date }));
  assert(stillStopped.distance === stopped.distance, `Stop / Inspect failed: distance moved ${stopped.distance} -> ${stillStopped.distance}`);
  assert(stillStopped.date === stopped.date, 'Stop / Inspect failed: date kept advancing');

  // A single second Travel decision should carry the party through multiple
  // days until Kansas River stops the wagon automatically.
  await page.getByRole('button', { name: 'Travel' }).click();
  await page.waitForFunction(() => document.querySelector('#modal').open && document.querySelector('#modalEyebrow').textContent.trim() === 'RIVER CROSSING', null, { timeout: 12000 });
  const atRiver = await page.evaluate(() => ({
    distance: state.distance,
    date: state.date,
    food: state.inventory.food,
    active: window.frontierAutoTravel.active,
  }));
  assert(atRiver.distance === 102, `Expected Kansas River at 102 mi, got ${atRiver.distance}`);
  assert(atRiver.active === false, 'Auto-travel did not stop for the river modal');
  const elapsedDays = Math.round((new Date(atRiver.date) - new Date(start.date)) / 86400000);
  assert(elapsedDays >= 5, `Expected multiple simulated days from two Travel commands, got ${elapsedDays}`);

  // Take the ferry so we can test stationary-day health semantics away from a
  // river interruption.
  const ferry = page.getByRole('button', { name: /Take the ferry/i });
  if (await ferry.isEnabled()) await ferry.click();
  else await page.getByRole('button', { name: /Caulk and float/i }).click();
  await page.waitForFunction(() => document.querySelector('#modalEyebrow').textContent.trim() === 'CROSSING RESULT');
  await closeAnyResultModal(page);

  // Regression: hunting while the selected travel pace is Grueling must not
  // apply Grueling's travel HP penalty on a stationary day.
  await page.evaluate(() => {
    state.pace = 'Grueling';
    state.rations = 'Filling';
    state.inventory.ammo = Math.max(100, state.inventory.ammo);
    state.party.forEach((member) => { if (member.alive) { member.hp = 80; member.statuses = []; } });
    renderGame();
  });
  await page.getByRole('button', { name: 'Hunt' }).click();
  await page.waitForFunction(() => document.querySelector('#modalEyebrow').textContent.trim() === 'HUNT');
  const huntHealth = await page.evaluate(() => averageHealth());
  assert(huntHealth >= 80, `Stationary hunt incorrectly applied travel pace damage; avg health=${huntHealth}`);
  await closeAnyResultModal(page);

  // Same regression for repairs.
  await page.evaluate(() => {
    state.pace = 'Grueling';
    state.rations = 'Filling';
    state.wagonCondition = 40;
    state.party.forEach((member) => { if (member.alive) { member.hp = 80; member.statuses = []; } });
    renderGame();
  });
  await page.getByRole('button', { name: 'Repair' }).click();
  await page.waitForFunction(() => document.querySelector('#modalEyebrow').textContent.trim() === 'REPAIR');
  const repairHealth = await page.evaluate(() => averageHealth());
  assert(repairHealth >= 80, `Stationary repair incorrectly applied travel pace damage; avg health=${repairHealth}`);

  assert(pageErrors.length === 0, `Browser errors: ${pageErrors.join('; ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join('; ')}`);

  console.log(JSON.stringify({
    status: 'pass',
    start,
    firstAdvance: afterOneOrMoreDays,
    stopped,
    atRiver,
    elapsedDays,
    huntHealth,
    repairHealth,
  }, null, 2));

  await context.close();
} finally {
  await browser.close();
}
