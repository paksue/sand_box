import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const outDir = new URL('../test-results-tuning-round3/', import.meta.url);
await fs.mkdir(outDir, { recursive: true });

const profiles = [
  ['banker', 'GRADE-BANKER-A'], ['banker', 'GRADE-BANKER-B'],
  ['carpenter', 'GRADE-CARPENTER-A'], ['carpenter', 'GRADE-CARPENTER-B'],
  ['farmer', 'GRADE-FARMER-A'], ['farmer', 'GRADE-FARMER-B'],
  ['hunter', 'GRADE-HUNTER-A'], ['hunter', 'GRADE-HUNTER-B'],
  ['doctor', 'GRADE-DOCTOR-A'], ['doctor', 'GRADE-DOCTOR-B'],
];

const candidates = [
  {
    id: 'K_faster_late_filling',
    description: 'Ultra-low ox wear, faster late terrain, Filling at 2.5 lb/person, current wagon wear.',
    rations: 'Filling', fillingFood: 2.5, meagerHp: -0.5, reducedWagon: false, loadout: 'classic',
  },
  {
    id: 'L_K_reduced_wagon_wear',
    description: 'K plus reduced pace/weather wagon attrition.',
    rations: 'Filling', fillingFood: 2.5, meagerHp: -0.5, reducedWagon: true, loadout: 'classic',
  },
  {
    id: 'M_meager_gentle',
    description: 'Reduced wagon wear, Meager 2 lb/person with only -0.1 HP/day rather than -0.5.',
    rations: 'Meager', fillingFood: 3.0, meagerHp: -0.1, reducedWagon: true, loadout: 'classic',
  },
  {
    id: 'N_meager_neutral',
    description: 'Reduced wagon wear, Meager 2 lb/person with no deterministic daily HP penalty.',
    rations: 'Meager', fillingFood: 3.0, meagerHp: 0.0, reducedWagon: true, loadout: 'classic',
  },
  {
    id: 'O_meager_gentle_medium_loadout',
    description: 'M rules with 850 lb food / 220 ammo instead of the classic-size loadout.',
    rations: 'Meager', fillingFood: 3.0, meagerHp: -0.1, reducedWagon: true, loadout: 'medium',
  },
];

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  if (!response?.ok()) throw new Error(`Game failed to load: ${BASE_URL}`);
  await page.waitForFunction(() => window.frontierAutoTravel?.setDayDisplayMs);

  const results = await page.evaluate(async ({ profiles, candidates }) => {
    window.frontierAutoTravel.setDayDisplayMs(0);
    saveGame = async () => {};
    renderGame = () => {};
    updateScene = () => {};
    sound = { click: { play() {} }, good: { play() {} }, bad: { play() {} } };

    const modal = document.querySelector('#modal');
    const names = ['You', 'Martha', 'Elias', 'Rose', 'Samuel'];
    const original = {
      region: { ...REGION_BASE_MILES },
      pace: JSON.parse(JSON.stringify(PACE)),
      weather: JSON.parse(JSON.stringify(WEATHER)),
      rations: JSON.parse(JSON.stringify(RATIONS)),
    };

    function restore() {
      Object.assign(REGION_BASE_MILES, original.region);
      for (const [key, value] of Object.entries(original.pace)) Object.assign(PACE[key], value);
      for (const [key, value] of Object.entries(original.weather)) Object.assign(WEATHER[key], value);
      for (const [key, value] of Object.entries(original.rations)) Object.assign(RATIONS[key], value);
      REGION_BASE_MILES.Prairie = 17;
    }

    function apply(candidate) {
      restore();
      Object.assign(REGION_BASE_MILES, {
        Prairie: 17,
        Plains: 16,
        Foothills: 14,
        Mountains: 12,
        'High Desert': 14,
        Columbia: 13,
        Valley: 15,
      });
      PACE.Steady.ox = 0.05;
      WEATHER.Rain.ox = 0.025;
      WEATHER.Storm.ox = 0.075;
      WEATHER.Mud.ox = 0.10;
      WEATHER.Heat.ox = 0.20;
      WEATHER.Snow.ox = 0.15;
      RATIONS.Filling.food = candidate.fillingFood;
      RATIONS.Meager.hp = candidate.meagerHp;
      if (candidate.reducedWagon) {
        PACE.Steady.wagon = 0.05;
        WEATHER.Rain.wagon = 0.15;
        WEATHER.Storm.wagon = 0.30;
        WEATHER.Mud.wagon = 0.40;
        WEATHER.Heat.wagon = 0.05;
        WEATHER.Snow.wagon = 0.25;
      }
    }

    function inventoryFor(candidate) {
      if (candidate.loadout === 'medium') {
        return { food: 850, ammo: 220, medicine: 3, clothing: 10, wheelParts: 2, axleParts: 2, tongueParts: 2, oxen: 6 };
      }
      return { food: 1000, ammo: 300, medicine: 3, clothing: 10, wheelParts: 2, axleParts: 2, tongueParts: 2, oxen: 6 };
    }

    function reset(candidate, profession, seed) {
      if (modal.open) modal.close();
      rng = makeRng(seed);
      const date = new Date(1848, 3, 1, 12).toISOString();
      state = {
        version: 1, seed, profession, date, distance: 0, weather: 'Clear', pace: 'Steady', rations: candidate.rations,
        money: 400, inventory: inventoryFor(candidate), wagonCondition: 100, oxCondition: 100,
        party: names.map((name) => ({ name, hp: 100, alive: true, statuses: [] })),
        visited: ['Independence'], journal: [{ date, text: `Round 3 ${candidate.id}` }], ended: false,
      };
      return date;
    }

    async function resolveModal(stats) {
      if (!modal.open) return 'none';
      const eyebrow = document.querySelector('#modalEyebrow').textContent.trim();
      if (eyebrow === 'JOURNEY COMPLETE' || eyebrow === 'RUN ENDED') return 'terminal';
      if (eyebrow === 'RIVER CROSSING') {
        const landmark = LANDMARKS.find((item) => Math.abs(item.distance - state.distance) < 0.1);
        const method = state.money >= 45 ? 'ferry' : 'float';
        stats.rivers += 1;
        await resolveRiver(landmark, method);
        return 'river';
      }
      if (eyebrow === 'LANDMARK') {
        if (state.inventory.food < 180 && state.money >= 65) {
          state.money -= 65; state.inventory.food += 75; stats.fortFoodBuys += 1; modal.close(); return 'food';
        }
        if (state.inventory.medicine < 2 && state.money >= 35) {
          state.money -= 35; state.inventory.medicine += 1; stats.fortMedicineBuys += 1; modal.close(); return 'medicine';
        }
      }
      modal.close();
      return eyebrow.toLowerCase();
    }

    async function act(stats) {
      const sick = aliveParty().filter((member) => member.statuses.length).sort((a, b) => a.hp - b.hp);
      if (sick.length && state.inventory.medicine > 0 && sick[0].hp < 68 && useMedicine(sick[0])) { stats.treatments += 1; return; }
      if (state.inventory.food < 120 && state.inventory.ammo >= 5) { stats.hunts += 1; await huntDay(); return; }
      if (averageHealth() < 58 && state.inventory.food >= dailyFoodNeed()) { stats.rests += 1; await restDay(); return; }
      if (state.wagonCondition < 48) { stats.repairs += 1; await repairDay(); return; }
      stats.travelCommands += 1; await continueTravel();
    }

    const output = [];
    for (const candidate of candidates) {
      apply(candidate);
      const runs = [];
      for (const [profession, seed] of profiles) {
        const startDate = reset(candidate, profession, seed);
        const stats = { travelCommands: 0, hunts: 0, rests: 0, repairs: 0, treatments: 0, rivers: 0, fortFoodBuys: 0, fortMedicineBuys: 0 };
        let actions = 0;
        while (actions < 180 && !state.ended) {
          if (modal.open) { const result = await resolveModal(stats); if (result === 'terminal') break; continue; }
          await act(stats); actions += 1;
        }
        runs.push({
          profession, seed, actions,
          days: Math.round((new Date(state.date) - new Date(startDate)) / 86400000),
          stats,
          final: { distance: Math.round(state.distance), survivors: aliveParty().length, food: Math.round(state.inventory.food), ammo: Math.round(state.inventory.ammo), wagon: Math.round(state.wagonCondition), ox: Math.round(state.oxCondition), health: Math.round(averageHealth()) },
          completed: state.distance >= TOTAL_DISTANCE,
        });
      }
      const completed = runs.filter((r) => r.completed).length;
      output.push({
        id: candidate.id, description: candidate.description, completed, completionRate: completed / runs.length,
        avgDistance: Math.round(runs.reduce((s, r) => s + r.final.distance, 0) / runs.length),
        avgSurvivors: Number((runs.reduce((s, r) => s + r.final.survivors, 0) / runs.length).toFixed(2)),
        avgActions: Math.round(runs.reduce((s, r) => s + r.actions, 0) / runs.length),
        avgDays: Math.round(runs.reduce((s, r) => s + r.days, 0) / runs.length),
        avgTravelCommands: Number((runs.reduce((s, r) => s + r.stats.travelCommands, 0) / runs.length).toFixed(1)),
        avgHunts: Number((runs.reduce((s, r) => s + r.stats.hunts, 0) / runs.length).toFixed(1)),
        avgRests: Number((runs.reduce((s, r) => s + r.stats.rests, 0) / runs.length).toFixed(1)),
        avgRepairs: Number((runs.reduce((s, r) => s + r.stats.repairs, 0) / runs.length).toFixed(1)),
        oxZeroRuns: runs.filter((r) => r.final.ox <= 0).length,
        foodZeroRuns: runs.filter((r) => r.final.food <= 0).length,
        partyWipes: runs.filter((r) => r.final.survivors === 0).length,
        avgFinalWagon: Math.round(runs.reduce((s, r) => s + r.final.wagon, 0) / runs.length),
        avgFinalOx: Math.round(runs.reduce((s, r) => s + r.final.ox, 0) / runs.length),
        byProfession: Object.fromEntries([...new Set(runs.map((r) => r.profession))].map((profession) => {
          const group = runs.filter((r) => r.profession === profession);
          return [profession, { completed: group.filter((r) => r.completed).length, avgDistance: Math.round(group.reduce((s, r) => s + r.final.distance, 0) / group.length), avgSurvivors: Number((group.reduce((s, r) => s + r.final.survivors, 0) / group.length).toFixed(1)) }];
        })),
        runs,
      });
    }
    restore();
    return output;
  }, { profiles, candidates });

  if (pageErrors.length) throw new Error(`Page errors: ${pageErrors.join('; ')}`);
  if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join('; ')}`);

  console.log('\n=== FRONTIER JOURNEY TUNING ROUND 3 ===');
  for (const row of results) console.log(JSON.stringify({ ...row, runs: undefined }, null, 2));
  await fs.writeFile(new URL('./round3-results.json', outDir), JSON.stringify(results, null, 2));
  await context.close();
} finally {
  await browser.close();
}
