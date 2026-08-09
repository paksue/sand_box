import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const outDir = new URL('../test-results-fast/', import.meta.url);
await fs.mkdir(outDir, { recursive: true });

const profiles = [
  { profession: 'banker', seed: 'GRADE-BANKER-A', food: 450, ammo: 80, medicine: 3 },
  { profession: 'banker', seed: 'GRADE-BANKER-B', food: 500, ammo: 80, medicine: 3 },
  { profession: 'carpenter', seed: 'GRADE-CARPENTER-A', food: 450, ammo: 80, medicine: 3 },
  { profession: 'carpenter', seed: 'GRADE-CARPENTER-B', food: 500, ammo: 80, medicine: 3 },
  { profession: 'farmer', seed: 'GRADE-FARMER-A', food: 350, ammo: 60, medicine: 2 },
  { profession: 'farmer', seed: 'GRADE-FARMER-B', food: 350, ammo: 60, medicine: 2 },
  { profession: 'hunter', seed: 'GRADE-HUNTER-A', food: 450, ammo: 100, medicine: 3 },
  { profession: 'hunter', seed: 'GRADE-HUNTER-B', food: 450, ammo: 100, medicine: 3 },
  { profession: 'doctor', seed: 'GRADE-DOCTOR-A', food: 450, ammo: 80, medicine: 3 },
  { profession: 'doctor', seed: 'GRADE-DOCTOR-B', food: 500, ammo: 80, medicine: 3 }
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function stateSnapshot(page) {
  return page.evaluate(() => ({
    ended: state.ended,
    distance: Math.round(state.distance),
    date: state.date,
    money: Math.round(state.money * 100) / 100,
    food: Math.round(state.inventory.food),
    ammo: Math.round(state.inventory.ammo),
    medicine: state.inventory.medicine,
    wagon: Math.round(state.wagonCondition),
    ox: Math.round(state.oxCondition),
    survivors: state.party.filter((m) => m.alive).length,
    avgHealth: Math.round(averageHealth()),
    sick: state.party.filter((m) => m.alive && m.statuses.length).length,
    visited: [...state.visited],
    journal: state.journal.map((entry) => entry.text),
    party: state.party.map((m) => ({ name: m.name, alive: m.alive, hp: Math.round(m.hp), statuses: m.statuses.map((s) => s.name) })),
  }));
}

async function handleOpenModal(page) {
  return page.evaluate(async () => {
    const modal = document.querySelector('#modal');
    if (!modal.open) return 'none';
    const eyebrow = document.querySelector('#modalEyebrow').textContent.trim();

    if (eyebrow === 'JOURNEY COMPLETE' || eyebrow === 'RUN ENDED') return 'terminal';

    if (eyebrow === 'RIVER CROSSING') {
      const landmark = LANDMARKS.find((item) => Math.abs(item.distance - state.distance) < 0.1);
      if (!landmark) throw new Error(`No river landmark at ${state.distance}`);
      const method = state.money >= 45 ? 'ferry' : 'float';
      await resolveRiver(landmark, method);
      return `river:${method}`;
    }

    if (eyebrow === 'LANDMARK') {
      const buttons = [...document.querySelectorAll('#modalChoices button')];
      const foodButton = buttons.find((b) => b.textContent.includes('Buy 75 lb food'));
      const medButton = buttons.find((b) => b.textContent.includes('Buy one medicine'));
      if (state.inventory.food < 180 && foodButton && !foodButton.disabled) {
        foodButton.click();
        return 'fort-food';
      }
      if (state.inventory.medicine < 2 && medButton && !medButton.disabled) {
        medButton.click();
        return 'fort-medicine';
      }
      closeModal();
      return 'landmark';
    }

    closeModal();
    return eyebrow.toLowerCase();
  });
}

async function performStrategyAction(page) {
  return page.evaluate(async () => {
    const living = aliveParty();
    const sick = living.filter((m) => m.statuses.length > 0).sort((a, b) => a.hp - b.hp);

    if (sick.length && state.inventory.medicine > 0 && sick[0].hp < 68) {
      if (useMedicine(sick[0])) {
        await saveGame();
        renderGame();
        return 'treat';
      }
    }
    if (averageHealth() < 58) {
      await restDay();
      return 'rest';
    }
    if (state.wagonCondition < 48) {
      await repairDay();
      return 'repair';
    }
    if (state.inventory.food < 120 && state.inventory.ammo >= 5) {
      await huntDay();
      return 'hunt';
    }
    await continueTravel();
    return 'continue';
  });
}

function countAction(stats, action) {
  if (action === 'continue') stats.travelDays += 1;
  if (action === 'rest') stats.rests += 1;
  if (action === 'hunt') stats.hunts += 1;
  if (action === 'repair') stats.repairs += 1;
  if (action === 'treat') stats.treatments += 1;
  if (action?.startsWith('river:')) stats.rivers += 1;
  if (action === 'fort-food') stats.fortFoodBuys += 1;
  if (action === 'fort-medicine') stats.fortMedicineBuys += 1;
}

async function playProfile(browser, profile, index) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  assert(response?.ok(), `HTTP failure loading ${BASE_URL}`);
  await page.waitForSelector('#pixiScene canvas', { state: 'attached' });

  await page.selectOption('#professionSelect', profile.profession);
  await page.fill('#seedInput', profile.seed);
  await page.fill('#store-food', String(profile.food));
  await page.fill('#store-ammo', String(profile.ammo));
  await page.fill('#store-medicine', String(profile.medicine));
  await page.click('#startButton');
  await page.waitForFunction(() => state !== null && !document.querySelector('#gameScreen').classList.contains('hidden'));
  await page.waitForSelector('#pixiScene canvas', { state: 'visible' });

  if (index === 0) {
    await page.evaluate(() => {
      state.party[1].hp = 65;
      state.party[1].statuses.push({ name: 'Test fever', days: 4, damage: 2 });
      renderGame();
    });
    const before = await page.evaluate(() => state.inventory.medicine);
    await page.click('button[data-action="treat"]');
    await page.getByRole('button', { name: /^Martha/ }).click();
    await page.waitForFunction((beforeValue) => state.inventory.medicine < beforeValue, before);
    await page.evaluate(() => closeModal());
    const afterTreatment = await stateSnapshot(page);
    assert(afterTreatment.party[1].hp >= 71, 'Treatment UI did not improve Martha health');

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('#resumeButton:not(.hidden)');
    await page.click('#resumeButton');
    await page.waitForFunction(() => state !== null && !document.querySelector('#gameScreen').classList.contains('hidden'));
    const resumed = await stateSnapshot(page);
    assert(resumed.party[1].hp >= 71, 'IndexedDB resume lost treatment state');
  }

  await page.evaluate(() => { state.pace = 'Steady'; state.rations = 'Meager'; renderGame(); });

  const stats = { travelDays: 0, rests: 0, hunts: 0, repairs: 0, treatments: 0, rivers: 0, fortFoodBuys: 0, fortMedicineBuys: 0 };
  const maxActions = 520;
  let actions = 0;

  while (actions < maxActions) {
    if (await page.evaluate(() => state.ended)) break;

    if (await page.locator('#modal').evaluate((el) => el.open)) {
      const result = await handleOpenModal(page);
      if (result === 'terminal') break;
      countAction(stats, result);
      await page.waitForTimeout(3);
      continue;
    }

    const action = await performStrategyAction(page);
    countAction(stats, action);
    actions += 1;
    await page.waitForTimeout(3);
  }

  const final = await stateSnapshot(page);
  if (index === 0) await page.screenshot({ path: new URL('./representative-game.png', outDir).pathname, fullPage: true });

  const result = { profile, actions, stats, final, consoleErrors, pageErrors };
  await context.close();
  return result;
}

const browser = await chromium.launch({ headless: true });
try {
  const runs = [];
  for (let i = 0; i < profiles.length; i += 1) runs.push(await playProfile(browser, profiles[i], i));

  for (const run of runs) {
    assert(run.pageErrors.length === 0, `${run.profile.seed}: ${run.pageErrors.join('; ')}`);
    assert(run.consoleErrors.length === 0, `${run.profile.seed} console errors: ${run.consoleErrors.join('; ')}`);
    assert(run.final.distance > 0, `${run.profile.seed} never moved`);
  }

  const completions = runs.filter((run) => run.final.distance >= 2040);
  const summary = {
    totalRuns: runs.length,
    completed: completions.length,
    completionRate: completions.length / runs.length,
    avgDistance: Math.round(runs.reduce((s, r) => s + r.final.distance, 0) / runs.length),
    avgSurvivors: Number((runs.reduce((s, r) => s + r.final.survivors, 0) / runs.length).toFixed(2)),
    avgTravelDays: Math.round(runs.reduce((s, r) => s + r.stats.travelDays, 0) / runs.length),
    avgHunts: Number((runs.reduce((s, r) => s + r.stats.hunts, 0) / runs.length).toFixed(1)),
    avgRepairs: Number((runs.reduce((s, r) => s + r.stats.repairs, 0) / runs.length).toFixed(1)),
    avgRests: Number((runs.reduce((s, r) => s + r.stats.rests, 0) / runs.length).toFixed(1)),
    byProfession: Object.fromEntries([...new Set(runs.map((r) => r.profile.profession))].map((profession) => {
      const group = runs.filter((r) => r.profile.profession === profession);
      return [profession, {
        completed: group.filter((r) => r.final.distance >= 2040).length,
        runs: group.length,
        avgDistance: Math.round(group.reduce((s, r) => s + r.final.distance, 0) / group.length),
        avgSurvivors: Number((group.reduce((s, r) => s + r.final.survivors, 0) / group.length).toFixed(1)),
      }];
    })),
    runs,
  };

  console.log('\n=== FRONTIER JOURNEY FAST GRADE ===');
  console.log(JSON.stringify(summary, null, 2));
  await fs.writeFile(new URL('./summary.json', outDir), JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
