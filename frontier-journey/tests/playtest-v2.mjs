import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const resultsDir = new URL('../test-results/', import.meta.url);
await fs.mkdir(resultsDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function settle(page, ms = 90) {
  await page.waitForTimeout(ms);
}

async function clickAndSettle(locator, page, ms = 90) {
  await locator.click();
  await settle(page, ms);
}

async function dismissModal(page, preference = {}) {
  const dialog = page.locator('#modal');
  if (!(await dialog.evaluate((el) => el.open))) return false;

  const eyebrow = (await page.locator('#modalEyebrow').textContent() || '').trim();
  const title = (await page.locator('#modalTitle').textContent() || '').trim();

  if (!(await dialog.evaluate((el) => el.open))) return false;

  if (eyebrow === 'RIVER CROSSING') {
    const ferry = page.getByRole('button', { name: /Take the ferry/i });
    if (await ferry.isEnabled().catch(() => false)) await clickAndSettle(ferry, page, 130);
    else await clickAndSettle(page.getByRole('button', { name: /Caulk and float/i }), page, 130);
    return { eyebrow, title, choice: 'safe crossing' };
  }

  if (eyebrow === 'LANDMARK') {
    if (preference.foodLow) {
      const food = page.getByRole('button', { name: /Buy 75 lb food/i });
      if (await food.isEnabled().catch(() => false)) {
        await clickAndSettle(food, page, 120);
        return { eyebrow, title, choice: 'buy food' };
      }
    }
    if (preference.medicineLow) {
      const med = page.getByRole('button', { name: /Buy one medicine/i });
      if (await med.isEnabled().catch(() => false)) {
        await clickAndSettle(med, page, 120);
        return { eyebrow, title, choice: 'buy medicine' };
      }
    }
    await clickAndSettle(page.getByRole('button', { name: /Continue on the trail/i }), page, 120);
    return { eyebrow, title, choice: 'continue' };
  }

  if (eyebrow === 'MEDICINE') {
    const visibleChoice = page.locator('#modal[open] #modalChoices button:not([disabled]):visible').first();
    if (await visibleChoice.count()) await clickAndSettle(visibleChoice, page, 120);
    return { eyebrow, title, choice: 'treat first candidate' };
  }

  if (eyebrow === 'RUN ENDED' || eyebrow === 'JOURNEY COMPLETE') {
    return { eyebrow, title, terminal: true };
  }

  const firstVisible = page.locator('#modal[open] #modalChoices button:not([disabled]):visible').first();
  if (!(await firstVisible.count())) return false;
  await clickAndSettle(firstVisible, page, 100);
  return { eyebrow, title, choice: 'first enabled' };
}

async function snapshot(page) {
  return page.evaluate(() => ({
    ended: state?.ended ?? false,
    distance: state?.distance ?? 0,
    date: state?.date ?? null,
    weather: state?.weather ?? null,
    pace: state?.pace ?? null,
    rations: state?.rations ?? null,
    money: state?.money ?? 0,
    food: state?.inventory?.food ?? 0,
    ammo: state?.inventory?.ammo ?? 0,
    medicine: state?.inventory?.medicine ?? 0,
    wagon: state?.wagonCondition ?? 0,
    ox: state?.oxCondition ?? 0,
    survivors: state?.party?.filter((m) => m.alive).length ?? 0,
    avgHealth: state ? Math.round(averageHealth()) : 0,
    sick: state?.party?.filter((m) => m.alive && m.statuses.length > 0).length ?? 0,
    journalCount: state?.journal?.length ?? 0,
    visited: state?.visited?.slice() ?? [],
    party: state?.party?.map((m) => ({ name: m.name, hp: Math.round(m.hp), alive: m.alive, statuses: m.statuses.map((s) => s.name) })) ?? [],
  }));
}

async function chooseRations(page, name) {
  await clickAndSettle(page.locator('.action-panel button[data-action="rations"]'), page);
  await clickAndSettle(page.getByRole('button', { name: new RegExp(`^${name}`) }), page, 140);
  await page.waitForFunction(() => !document.querySelector('#modal').open, null, { timeout: 5000 });
}

async function runJourney(browser, seed, { verifyPersistence = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  assert(response?.ok(), `Game HTTP response was not OK for ${BASE_URL}`);
  await page.waitForSelector('#startButton');
  await page.waitForSelector('#pixiScene canvas', { state: 'attached' });
  assert((await page.locator('h1').textContent()).includes('FRONTIER JOURNEY'), 'Game title missing');

  await page.selectOption('#professionSelect', 'banker');
  await page.fill('#seedInput', seed);
  await clickAndSettle(page.getByRole('button', { name: 'Begin the journey' }), page, 140);
  await page.waitForSelector('#gameScreen:not(.hidden)');
  await page.waitForSelector('#pixiScene canvas', { state: 'visible' });

  const medicineBefore = await page.evaluate(() => state.inventory.medicine);
  await page.evaluate(() => {
    state.party[1].hp = 65;
    state.party[1].statuses.push({ name: 'Test fever', days: 4, damage: 2 });
    renderGame();
  });
  await clickAndSettle(page.getByRole('button', { name: 'Treat' }), page);
  await clickAndSettle(page.getByRole('button', { name: /^Martha/ }), page, 130);
  await dismissModal(page);
  const treatmentState = await snapshot(page);
  assert(treatmentState.medicine === medicineBefore - 1, 'Treatment did not consume medicine');
  assert(treatmentState.party[1].hp >= 71, 'Treatment did not improve health');

  if (verifyPersistence) {
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('#resumeButton:not(.hidden)');
    await clickAndSettle(page.getByRole('button', { name: 'Resume saved run' }), page, 140);
    await page.waitForSelector('#gameScreen:not(.hidden)');
    await page.waitForSelector('#pixiScene canvas', { state: 'visible' });
    const resumed = await snapshot(page);
    assert(resumed.party[1].hp >= 71, 'Saved treatment state did not survive reload/resume');
  }

  await chooseRations(page, 'Meager');

  const events = [];
  let actions = 0;
  let terminalModal = null;
  const maxActions = 360;

  while (actions < maxActions) {
    const s = await snapshot(page);
    if (s.ended) break;

    const dialog = page.locator('#modal');
    if (await dialog.evaluate((el) => el.open)) {
      const event = await dismissModal(page, { foodLow: s.food < 180, medicineLow: s.medicine < 2 });
      if (event) events.push(event);
      if (event?.terminal) {
        terminalModal = event;
        break;
      }
      continue;
    }

    const sickHps = s.party.filter((m) => m.alive && m.statuses.length).map((m) => m.hp);
    const lowestSickHp = sickHps.length ? Math.min(...sickHps) : 101;

    if (s.sick > 0 && s.medicine > 0 && lowestSickHp < 68) {
      await clickAndSettle(page.getByRole('button', { name: 'Treat' }), page);
    } else if (s.avgHealth < 58) {
      await clickAndSettle(page.locator('.action-panel button[data-action="rest"]'), page, 120);
    } else if (s.wagon < 48) {
      await clickAndSettle(page.locator('.action-panel button[data-action="repair"]'), page, 120);
    } else if (s.food < 120 && s.ammo >= 5) {
      await clickAndSettle(page.locator('.action-panel button[data-action="hunt"]'), page, 120);
    } else {
      await clickAndSettle(page.locator('.action-panel button[data-action="continue"]'), page, 120);
    }
    actions += 1;
  }

  if (!terminalModal && await page.locator('#modal').evaluate((el) => el.open)) {
    const eyebrow = (await page.locator('#modalEyebrow').textContent() || '').trim();
    const title = (await page.locator('#modalTitle').textContent() || '').trim();
    if (eyebrow === 'RUN ENDED' || eyebrow === 'JOURNEY COMPLETE') terminalModal = { eyebrow, title };
  }

  const final = await snapshot(page);
  await page.screenshot({ path: new URL(`./${seed}.png`, resultsDir).pathname, fullPage: true });

  const result = {
    seed,
    actions,
    final,
    terminalModal,
    eventCount: events.length,
    riverCrossings: events.filter((e) => e.eyebrow === 'RIVER CROSSING').length,
    landmarks: events.filter((e) => e.eyebrow === 'LANDMARK').length,
    consoleErrors,
    pageErrors,
  };

  await context.close();
  return result;
}

const browser = await chromium.launch({ headless: true });
try {
  const runs = [];
  runs.push(await runJourney(browser, 'GRADE-1848-A', { verifyPersistence: true }));
  runs.push(await runJourney(browser, 'GRADE-1848-B'));
  runs.push(await runJourney(browser, 'GRADE-1848-C'));

  for (const run of runs) {
    assert(run.pageErrors.length === 0, `${run.seed} had browser page errors: ${run.pageErrors.join('; ')}`);
    assert(run.consoleErrors.length === 0, `${run.seed} had console errors: ${run.consoleErrors.join('; ')}`);
    assert(run.final.distance > 0, `${run.seed} never advanced on the trail`);
    assert(run.riverCrossings >= 1 || run.final.distance < 102, `${run.seed} reached river territory without recording a crossing interaction`);
  }

  const completed = runs.filter((r) => r.final.distance >= 2040).length;
  const summary = {
    completed,
    totalRuns: runs.length,
    completionRate: completed / runs.length,
    averageDistance: Math.round(runs.reduce((sum, r) => sum + r.final.distance, 0) / runs.length),
    averageSurvivors: Number((runs.reduce((sum, r) => sum + r.final.survivors, 0) / runs.length).toFixed(2)),
    averageActions: Math.round(runs.reduce((sum, r) => sum + r.actions, 0) / runs.length),
    runs,
  };

  console.log('\n=== FRONTIER JOURNEY PLAYTEST SUMMARY ===');
  console.log(JSON.stringify(summary, null, 2));
  await fs.writeFile(new URL('./summary.json', resultsDir), JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
