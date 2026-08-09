import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const outDir = new URL('../test-results-inpage/', import.meta.url);
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
  { profession: 'doctor', seed: 'GRADE-DOCTOR-B', food: 500, ammo: 80, medicine: 3 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
  await page.waitForFunction(() => window.frontierAutoTravel?.setDayDisplayMs);

  const summary = await page.evaluate(async (profiles) => {
    // This is the balance layer, not the UI regression. The separate
    // classic-autotravel browser test exercises Pixi, controls, save/resume,
    // and visible pacing. Here we keep the real game functions and DOM modals
    // but remove repaint/storage/audio costs after the page has booted.
    window.frontierAutoTravel.setDayDisplayMs(0);
    saveGame = async () => {};
    renderGame = () => {};
    updateScene = () => {};
    sound = {
      click: { play() {} },
      good: { play() {} },
      bad: { play() {} },
    };

    const modal = document.querySelector('#modal');
    const names = ['You', 'Martha', 'Elias', 'Rose', 'Samuel'];

    function closeOpenModal() {
      if (modal.open) modal.close();
    }

    function makeInventory(profile) {
      return {
        food: profile.food,
        ammo: profile.ammo,
        medicine: profile.medicine,
        clothing: 6,
        wheelParts: 2,
        axleParts: 2,
        tongueParts: 1,
        oxen: 4,
      };
    }

    function inventoryCost(inventory) {
      return STORE_ITEMS.reduce((sum, item) => sum + (inventory[item.id] || 0) * item.price, 0);
    }

    function resetRun(profile) {
      closeOpenModal();
      const inventory = makeInventory(profile);
      const profession = PROFESSIONS[profile.profession];
      const cost = inventoryCost(inventory);
      if (cost > profession.money) throw new Error(`${profile.seed} outfitting exceeds ${profile.profession} budget`);

      rng = makeRng(profile.seed);
      state = {
        version: 1,
        seed: profile.seed,
        profession: profile.profession,
        date: new Date(1848, 3, 1, 12).toISOString(),
        distance: 0,
        weather: 'Clear',
        pace: 'Steady',
        rations: 'Meager',
        money: Math.round((profession.money - cost) * 100) / 100,
        inventory,
        wagonCondition: 100,
        oxCondition: 100,
        party: names.map((name) => ({ name, hp: 100, alive: true, statuses: [] })),
        visited: ['Independence'],
        journal: [{ date: new Date(1848, 3, 1, 12).toISOString(), text: 'Balance simulation started.' }],
        ended: false,
      };
      return state.date;
    }

    async function resolveCurrentModal(stats) {
      if (!modal.open) return 'none';
      const eyebrow = document.querySelector('#modalEyebrow').textContent.trim();

      if (eyebrow === 'JOURNEY COMPLETE' || eyebrow === 'RUN ENDED') return 'terminal';

      if (eyebrow === 'RIVER CROSSING') {
        const landmark = LANDMARKS.find((item) => Math.abs(item.distance - state.distance) < 0.1);
        if (!landmark) throw new Error(`No river landmark at ${state.distance}`);
        const method = state.money >= 45 ? 'ferry' : 'float';
        stats.rivers += 1;
        await resolveRiver(landmark, method);
        return `river:${method}`;
      }

      if (eyebrow === 'LANDMARK') {
        // Match the conservative browser player's priority: food first, then
        // medicine, otherwise leave. A purchase ends this visit.
        if (state.inventory.food < 180 && state.money >= 65) {
          state.money -= 65;
          state.inventory.food += 75;
          stats.fortFoodBuys += 1;
          closeOpenModal();
          return 'fort-food';
        }
        if (state.inventory.medicine < 2 && state.money >= 35) {
          state.money -= 35;
          state.inventory.medicine += 1;
          stats.fortMedicineBuys += 1;
          closeOpenModal();
          return 'fort-medicine';
        }
        closeOpenModal();
        return 'landmark';
      }

      closeOpenModal();
      return eyebrow.toLowerCase();
    }

    async function strategyAction(stats) {
      const living = aliveParty();
      const sick = living.filter((member) => member.statuses.length > 0).sort((a, b) => a.hp - b.hp);

      if (sick.length && state.inventory.medicine > 0 && sick[0].hp < 68) {
        if (useMedicine(sick[0])) {
          stats.treatments += 1;
          return 'treat';
        }
      }

      // Avoid the old starvation-rest loop: recover food before resting, and
      // do not rest if the party cannot feed itself for the rest day.
      if (state.inventory.food < 120 && state.inventory.ammo >= 5) {
        stats.hunts += 1;
        await huntDay();
        return 'hunt';
      }
      if (averageHealth() < 58 && state.inventory.food >= dailyFoodNeed()) {
        stats.rests += 1;
        await restDay();
        return 'rest';
      }
      if (state.wagonCondition < 48) {
        stats.repairs += 1;
        await repairDay();
        return 'repair';
      }

      stats.travelCommands += 1;
      await continueTravel();
      return 'travel';
    }

    function snapshot() {
      return {
        ended: state.ended,
        distance: Math.round(state.distance),
        date: state.date,
        money: Math.round(state.money * 100) / 100,
        food: Math.round(state.inventory.food),
        ammo: Math.round(state.inventory.ammo),
        medicine: state.inventory.medicine,
        wagon: Math.round(state.wagonCondition),
        ox: Math.round(state.oxCondition),
        survivors: state.party.filter((member) => member.alive).length,
        avgHealth: Math.round(averageHealth()),
        sick: state.party.filter((member) => member.alive && member.statuses.length).length,
        visited: [...state.visited],
        party: state.party.map((member) => ({
          name: member.name,
          hp: Math.round(member.hp),
          alive: member.alive,
          statuses: member.statuses.map((status) => status.name),
        })),
      };
    }

    const runs = [];
    const maxActions = 220;

    for (const profile of profiles) {
      const startDate = resetRun(profile);
      const stats = {
        travelCommands: 0,
        rests: 0,
        hunts: 0,
        repairs: 0,
        treatments: 0,
        rivers: 0,
        fortFoodBuys: 0,
        fortMedicineBuys: 0,
      };
      let actions = 0;

      while (actions < maxActions && !state.ended) {
        if (modal.open) {
          const result = await resolveCurrentModal(stats);
          if (result === 'terminal') break;
          continue;
        }

        await strategyAction(stats);
        actions += 1;
      }

      const final = snapshot();
      const calendarDays = Math.max(0, Math.round((new Date(final.date) - new Date(startDate)) / 86400000));
      runs.push({
        profile,
        actions,
        calendarDays,
        hitActionCap: actions >= maxActions && !final.ended,
        stats,
        final,
      });
    }

    const completions = runs.filter((run) => run.final.distance >= TOTAL_DISTANCE);
    const professions = [...new Set(runs.map((run) => run.profile.profession))];

    return {
      totalRuns: runs.length,
      completed: completions.length,
      completionRate: completions.length / runs.length,
      actionCapHits: runs.filter((run) => run.hitActionCap).length,
      avgDistance: Math.round(runs.reduce((sum, run) => sum + run.final.distance, 0) / runs.length),
      avgSurvivors: Number((runs.reduce((sum, run) => sum + run.final.survivors, 0) / runs.length).toFixed(2)),
      avgMeaningfulActions: Math.round(runs.reduce((sum, run) => sum + run.actions, 0) / runs.length),
      avgCalendarDays: Math.round(runs.reduce((sum, run) => sum + run.calendarDays, 0) / runs.length),
      avgTravelCommands: Number((runs.reduce((sum, run) => sum + run.stats.travelCommands, 0) / runs.length).toFixed(1)),
      avgHunts: Number((runs.reduce((sum, run) => sum + run.stats.hunts, 0) / runs.length).toFixed(1)),
      avgRepairs: Number((runs.reduce((sum, run) => sum + run.stats.repairs, 0) / runs.length).toFixed(1)),
      avgRests: Number((runs.reduce((sum, run) => sum + run.stats.rests, 0) / runs.length).toFixed(1)),
      byProfession: Object.fromEntries(professions.map((profession) => {
        const group = runs.filter((run) => run.profile.profession === profession);
        return [profession, {
          completed: group.filter((run) => run.final.distance >= TOTAL_DISTANCE).length,
          runs: group.length,
          actionCapHits: group.filter((run) => run.hitActionCap).length,
          avgDistance: Math.round(group.reduce((sum, run) => sum + run.final.distance, 0) / group.length),
          avgSurvivors: Number((group.reduce((sum, run) => sum + run.final.survivors, 0) / group.length).toFixed(1)),
          avgActions: Math.round(group.reduce((sum, run) => sum + run.actions, 0) / group.length),
          avgCalendarDays: Math.round(group.reduce((sum, run) => sum + run.calendarDays, 0) / group.length),
        }];
      })),
      runs,
    };
  }, profiles);

  assert(pageErrors.length === 0, `Browser page errors: ${pageErrors.join('; ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert(summary.runs.every((run) => run.final.distance > 0), 'At least one simulation never moved');

  console.log('\n=== FRONTIER JOURNEY IN-PAGE BALANCE GRADE ===');
  console.log(JSON.stringify(summary, null, 2));
  await fs.writeFile(new URL('./summary.json', outDir), JSON.stringify(summary, null, 2));

  await context.close();
} finally {
  await browser.close();
}
