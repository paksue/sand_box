import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const outDir = new URL('../test-results-tuning/', import.meta.url);
await fs.mkdir(outDir, { recursive: true });

const seedsByProfession = {
  banker: ['GRADE-BANKER-A', 'GRADE-BANKER-B'],
  carpenter: ['GRADE-CARPENTER-A', 'GRADE-CARPENTER-B'],
  farmer: ['GRADE-FARMER-A', 'GRADE-FARMER-B'],
  hunter: ['GRADE-HUNTER-A', 'GRADE-HUNTER-B'],
  doctor: ['GRADE-DOCTOR-A', 'GRADE-DOCTOR-B'],
};

const currentLoadouts = {
  banker: [{ food: 450, ammo: 80, medicine: 3 }, { food: 500, ammo: 80, medicine: 3 }],
  carpenter: [{ food: 450, ammo: 80, medicine: 3 }, { food: 500, ammo: 80, medicine: 3 }],
  farmer: [{ food: 350, ammo: 60, medicine: 2 }, { food: 350, ammo: 60, medicine: 2 }],
  hunter: [{ food: 450, ammo: 100, medicine: 3 }, { food: 450, ammo: 100, medicine: 3 }],
  doctor: [{ food: 450, ammo: 80, medicine: 3 }, { food: 500, ammo: 80, medicine: 3 }],
};

const candidates = [
  {
    id: 'A_current_meager',
    description: 'Current live economy/loadouts, Steady + Meager. Reproduces the validated baseline.',
    loadout: 'current',
    rations: 'Meager',
    economy: 'current',
    oxWear: 'current',
  },
  {
    id: 'B_current_filling',
    description: 'Current economy/loadouts, but Filling rations to isolate the continuous Meager health drain.',
    loadout: 'current',
    rations: 'Filling',
    economy: 'current',
    oxWear: 'current',
  },
  {
    id: 'C_classic_loadout_current_wear',
    description: 'Measured 1990-style starting prices/quantities plus medicine, Filling rations; current ox wear retained.',
    loadout: 'classic',
    rations: 'Filling',
    economy: 'classic',
    oxWear: 'current',
  },
  {
    id: 'D_classic_loadout_low_ox_wear',
    description: '1990-style economy/loadout + Filling with substantially lower passive ox wear.',
    loadout: 'classic',
    rations: 'Filling',
    economy: 'classic',
    oxWear: 'lower',
  },
  {
    id: 'E_mid_loadout_low_ox_wear',
    description: 'Smaller modernized starting loadout (800 food/160 ammo) at classic-like prices + Filling + lower ox wear.',
    loadout: 'mid',
    rations: 'Filling',
    economy: 'classic',
    oxWear: 'lower',
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

  const results = await page.evaluate(async ({ candidates, seedsByProfession, currentLoadouts }) => {
    window.frontierAutoTravel.setDayDisplayMs(0);
    saveGame = async () => {};
    renderGame = () => {};
    updateScene = () => {};
    sound = { click: { play() {} }, good: { play() {} }, bad: { play() {} } };

    const modal = document.querySelector('#modal');
    const names = ['You', 'Martha', 'Elias', 'Rose', 'Samuel'];
    const professions = Object.keys(seedsByProfession);

    const originals = {
      store: Object.fromEntries(STORE_ITEMS.map((item) => [item.id, { price: item.price, default: item.default }])),
      pace: JSON.parse(JSON.stringify(PACE)),
      weather: JSON.parse(JSON.stringify(WEATHER)),
    };

    function restoreConstants() {
      for (const item of STORE_ITEMS) {
        item.price = originals.store[item.id].price;
        item.default = originals.store[item.id].default;
      }
      for (const [key, value] of Object.entries(originals.pace)) Object.assign(PACE[key], value);
      for (const [key, value] of Object.entries(originals.weather)) Object.assign(WEATHER[key], value);
    }

    function applyCandidate(candidate) {
      restoreConstants();
      if (candidate.economy === 'classic') {
        const prices = {
          food: 0.20,
          ammo: 0.10,
          medicine: 25,
          clothing: 10,
          wheelParts: 10,
          axleParts: 10,
          tongueParts: 10,
          oxen: 20,
        };
        for (const item of STORE_ITEMS) item.price = prices[item.id];
      }
      if (candidate.oxWear === 'lower') {
        PACE.Steady.ox = 0.15;
        WEATHER.Rain.ox = 0.05;
        WEATHER.Storm.ox = 0.15;
        WEATHER.Mud.ox = 0.20;
        WEATHER.Heat.ox = 0.40;
        WEATHER.Snow.ox = 0.30;
      }
    }

    function loadoutFor(candidate, profession, index) {
      if (candidate.loadout === 'current') {
        return {
          ...currentLoadouts[profession][index],
          clothing: 6,
          wheelParts: 2,
          axleParts: 2,
          tongueParts: 1,
          oxen: 4,
        };
      }
      if (candidate.loadout === 'classic') {
        return {
          food: 1000,
          ammo: 300,
          medicine: 3,
          clothing: 10,
          wheelParts: 2,
          axleParts: 2,
          tongueParts: 2,
          oxen: 6,
        };
      }
      return {
        food: 800,
        ammo: 160,
        medicine: 3,
        clothing: 8,
        wheelParts: 2,
        axleParts: 2,
        tongueParts: 2,
        oxen: 6,
      };
    }

    function costOf(inventory) {
      return STORE_ITEMS.reduce((sum, item) => sum + (inventory[item.id] || 0) * item.price, 0);
    }

    function resetRun(candidate, profession, seed, index) {
      if (modal.open) modal.close();
      const inventory = loadoutFor(candidate, profession, index);
      const cost = costOf(inventory);
      const budget = PROFESSIONS[profession].money;
      if (cost > budget) return { affordable: false, cost, budget };

      rng = makeRng(seed);
      const date = new Date(1848, 3, 1, 12).toISOString();
      state = {
        version: 1,
        seed,
        profession,
        date,
        distance: 0,
        weather: 'Clear',
        pace: 'Steady',
        rations: candidate.rations,
        money: Math.round((budget - cost) * 100) / 100,
        inventory,
        wagonCondition: 100,
        oxCondition: 100,
        party: names.map((name) => ({ name, hp: 100, alive: true, statuses: [] })),
        visited: ['Independence'],
        journal: [{ date, text: `Tuning probe ${candidate.id}.` }],
        ended: false,
      };
      return { affordable: true, cost, budget, startDate: date };
    }

    async function resolveModal(stats) {
      if (!modal.open) return 'none';
      const eyebrow = document.querySelector('#modalEyebrow').textContent.trim();
      if (eyebrow === 'JOURNEY COMPLETE' || eyebrow === 'RUN ENDED') return 'terminal';

      if (eyebrow === 'RIVER CROSSING') {
        const landmark = LANDMARKS.find((item) => Math.abs(item.distance - state.distance) < 0.1);
        if (!landmark) throw new Error(`No river landmark at ${state.distance}`);
        const method = state.money >= 45 ? 'ferry' : 'float';
        stats.rivers += 1;
        await resolveRiver(landmark, method);
        return 'river';
      }

      if (eyebrow === 'LANDMARK') {
        if (state.inventory.food < 180 && state.money >= 65) {
          state.money -= 65;
          state.inventory.food += 75;
          stats.fortFoodBuys += 1;
          modal.close();
          return 'fort-food';
        }
        if (state.inventory.medicine < 2 && state.money >= 35) {
          state.money -= 35;
          state.inventory.medicine += 1;
          stats.fortMedicineBuys += 1;
          modal.close();
          return 'fort-med';
        }
      }

      modal.close();
      return eyebrow.toLowerCase();
    }

    async function strategy(stats) {
      const sick = aliveParty().filter((member) => member.statuses.length).sort((a, b) => a.hp - b.hp);
      if (sick.length && state.inventory.medicine > 0 && sick[0].hp < 68) {
        if (useMedicine(sick[0])) {
          stats.treatments += 1;
          return 'treat';
        }
      }
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

    function finishSnapshot() {
      return {
        distance: Math.round(state.distance),
        ended: state.ended,
        survivors: aliveParty().length,
        food: Math.round(state.inventory.food),
        ammo: state.inventory.ammo,
        money: Math.round(state.money),
        wagon: Math.round(state.wagonCondition),
        ox: Math.round(state.oxCondition),
        avgHealth: Math.round(averageHealth()),
        date: state.date,
      };
    }

    const candidateResults = [];
    const maxActions = 220;

    for (const candidate of candidates) {
      applyCandidate(candidate);
      const runs = [];

      for (const profession of professions) {
        for (let index = 0; index < seedsByProfession[profession].length; index += 1) {
          const seed = seedsByProfession[profession][index];
          const setup = resetRun(candidate, profession, seed, index);
          if (!setup.affordable) {
            runs.push({ profession, seed, affordable: false, cost: setup.cost, budget: setup.budget });
            continue;
          }

          const stats = { travelCommands: 0, hunts: 0, rests: 0, repairs: 0, treatments: 0, rivers: 0, fortFoodBuys: 0, fortMedicineBuys: 0 };
          let actions = 0;
          while (actions < maxActions && !state.ended) {
            if (modal.open) {
              const outcome = await resolveModal(stats);
              if (outcome === 'terminal') break;
              continue;
            }
            await strategy(stats);
            actions += 1;
          }

          const final = finishSnapshot();
          const calendarDays = Math.round((new Date(final.date) - new Date(setup.startDate)) / 86400000);
          runs.push({
            profession,
            seed,
            affordable: true,
            startingCost: Math.round(setup.cost),
            actions,
            calendarDays,
            stats,
            final,
          });
        }
      }

      const affordableRuns = runs.filter((run) => run.affordable);
      const completions = affordableRuns.filter((run) => run.final.distance >= TOTAL_DISTANCE);
      candidateResults.push({
        id: candidate.id,
        description: candidate.description,
        affordableRuns: affordableRuns.length,
        unaffordableRuns: runs.length - affordableRuns.length,
        completed: completions.length,
        completionRate: affordableRuns.length ? completions.length / affordableRuns.length : null,
        avgDistance: affordableRuns.length ? Math.round(affordableRuns.reduce((sum, run) => sum + run.final.distance, 0) / affordableRuns.length) : 0,
        avgSurvivors: affordableRuns.length ? Number((affordableRuns.reduce((sum, run) => sum + run.final.survivors, 0) / affordableRuns.length).toFixed(2)) : 0,
        avgActions: affordableRuns.length ? Math.round(affordableRuns.reduce((sum, run) => sum + run.actions, 0) / affordableRuns.length) : 0,
        avgCalendarDays: affordableRuns.length ? Math.round(affordableRuns.reduce((sum, run) => sum + run.calendarDays, 0) / affordableRuns.length) : 0,
        avgTravelCommands: affordableRuns.length ? Number((affordableRuns.reduce((sum, run) => sum + run.stats.travelCommands, 0) / affordableRuns.length).toFixed(1)) : 0,
        avgHunts: affordableRuns.length ? Number((affordableRuns.reduce((sum, run) => sum + run.stats.hunts, 0) / affordableRuns.length).toFixed(1)) : 0,
        avgRests: affordableRuns.length ? Number((affordableRuns.reduce((sum, run) => sum + run.stats.rests, 0) / affordableRuns.length).toFixed(1)) : 0,
        avgRepairs: affordableRuns.length ? Number((affordableRuns.reduce((sum, run) => sum + run.stats.repairs, 0) / affordableRuns.length).toFixed(1)) : 0,
        oxZeroRuns: affordableRuns.filter((run) => run.final.ox <= 0).length,
        foodZeroRuns: affordableRuns.filter((run) => run.final.food <= 0).length,
        partyWipeRuns: affordableRuns.filter((run) => run.final.survivors === 0).length,
        byProfession: Object.fromEntries(professions.map((profession) => {
          const group = affordableRuns.filter((run) => run.profession === profession);
          return [profession, {
            runs: group.length,
            completed: group.filter((run) => run.final.distance >= TOTAL_DISTANCE).length,
            avgDistance: group.length ? Math.round(group.reduce((sum, run) => sum + run.final.distance, 0) / group.length) : 0,
            avgSurvivors: group.length ? Number((group.reduce((sum, run) => sum + run.final.survivors, 0) / group.length).toFixed(1)) : 0,
          }];
        })),
        runs,
      });
    }

    restoreConstants();
    return candidateResults;
  }, { candidates, seedsByProfession, currentLoadouts });

  if (pageErrors.length) throw new Error(`Page errors: ${pageErrors.join('; ')}`);
  if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join('; ')}`);

  console.log('\n=== FRONTIER JOURNEY TUNING PROBE ===');
  for (const candidate of results) {
    console.log(JSON.stringify({
      id: candidate.id,
      completionRate: candidate.completionRate,
      completed: candidate.completed,
      affordableRuns: candidate.affordableRuns,
      unaffordableRuns: candidate.unaffordableRuns,
      avgDistance: candidate.avgDistance,
      avgSurvivors: candidate.avgSurvivors,
      avgActions: candidate.avgActions,
      avgCalendarDays: candidate.avgCalendarDays,
      avgTravelCommands: candidate.avgTravelCommands,
      avgHunts: candidate.avgHunts,
      avgRests: candidate.avgRests,
      avgRepairs: candidate.avgRepairs,
      oxZeroRuns: candidate.oxZeroRuns,
      foodZeroRuns: candidate.foodZeroRuns,
      partyWipeRuns: candidate.partyWipeRuns,
      byProfession: candidate.byProfession,
    }, null, 2));
  }
  await fs.writeFile(new URL('./tuning-results.json', outDir), JSON.stringify(results, null, 2));

  await context.close();
} finally {
  await browser.close();
}
