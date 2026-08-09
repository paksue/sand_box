import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const outDir = new URL('../test-results-v12/', import.meta.url);
await fs.mkdir(outDir, { recursive: true });

const professions = ['banker', 'carpenter', 'farmer', 'hunter', 'doctor'];
const seeds = Array.from({ length: 20 }, (_, i) => `V12-${String(i + 1).padStart(3, '0')}`);

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
  assert(response?.ok(), `Game failed to load: ${BASE_URL}`);
  await page.waitForSelector('#pixiScene canvas', { state: 'attached' });
  await page.waitForFunction(() => window.frontierBalance?.version === '1.2' && window.frontierAutoTravel?.setDayDisplayMs);

  const setup = await page.evaluate(() => ({
    balance: window.frontierBalance,
    store: Object.fromEntries(STORE_ITEMS.map((item) => [item.id, {
      price: item.price,
      default: item.default,
      input: Number(document.querySelector(`#store-${item.id}`).value),
    }])),
    totalText: document.querySelector('#storeTotal').textContent,
    regions: { ...REGION_BASE_MILES },
    pace: JSON.parse(JSON.stringify(PACE)),
    weather: JSON.parse(JSON.stringify(WEATHER)),
    rations: JSON.parse(JSON.stringify(RATIONS)),
  }));

  assert(setup.balance.calibration === 'ox_008', `Unexpected calibration ${setup.balance.calibration}`);
  assert(setup.balance.referenceOutfitCost === 585, `Expected $585 default outfit, got $${setup.balance.referenceOutfitCost}`);
  assert(setup.totalText.includes('585'), `Displayed outfitting total is not $585: ${setup.totalText}`);
  const expectedDefaults = { food:1000, ammo:300, medicine:3, clothing:10, wheelParts:2, axleParts:2, tongueParts:2, oxen:6 };
  for (const [id, expected] of Object.entries(expectedDefaults)) {
    assert(setup.store[id].default === expected, `${id} config default ${setup.store[id].default} != ${expected}`);
    assert(setup.store[id].input === expected, `${id} visible input ${setup.store[id].input} != ${expected}`);
  }
  assert(setup.regions.Prairie === 17 && setup.regions.Mountains === 12 && setup.regions.Columbia === 13, 'V1.2 terrain calibration missing');
  assert(setup.pace.Steady.ox === 0.08 && setup.pace.Steady.wagon === 0.05, 'V1.2 Steady attrition missing');
  assert(setup.rations.Meager.hp === -0.1, `Meager HP is ${setup.rations.Meager.hp}, expected -0.1`);

  await page.selectOption('#professionSelect', 'farmer');
  await page.waitForFunction(() => document.querySelector('#budgetValue').textContent.includes('650'));
  const farmerSetup = await page.evaluate(() => ({
    warning: document.querySelector('#storeWarning').textContent,
    hidden: document.querySelector('#storeWarning').classList.contains('hidden'),
    total: outfittingCost(),
    budget: PROFESSIONS.farmer.money,
  }));
  assert(farmerSetup.total === 585, `Farmer default outfit cost changed: ${farmerSetup.total}`);
  assert(farmerSetup.budget - farmerSetup.total === 65, `Farmer should leave with $65, got $${farmerSetup.budget - farmerSetup.total}`);
  assert(farmerSetup.hidden || !/over budget/i.test(farmerSetup.warning), `Farmer is shown over budget: ${farmerSetup.warning}`);

  const summary = await page.evaluate(async ({ professions, seeds }) => {
    window.frontierAutoTravel.setDayDisplayMs(0);
    saveGame = async () => {};
    renderGame = () => {};
    updateScene = () => {};
    sound = { click:{play(){}}, good:{play(){}}, bad:{play(){}} };

    const modal = document.querySelector('#modal');
    const names = ['You', 'Martha', 'Elias', 'Rose', 'Samuel'];

    function defaultInventory() {
      return Object.fromEntries(STORE_ITEMS.map((item) => [item.id, item.default]));
    }
    function defaultCost() {
      const inventory = defaultInventory();
      return STORE_ITEMS.reduce((sum, item) => sum + inventory[item.id] * item.price, 0);
    }
    function reset(profession, seed) {
      if (modal.open) modal.close();
      const inventory = defaultInventory();
      const cost = defaultCost();
      const date = new Date(1848, 3, 1, 12).toISOString();
      rng = makeRng(`${seed}-${profession}`);
      state = {
        version:1, seed, profession, date, distance:0, weather:'Clear', pace:'Steady',
        rations:'Meager',
        money:Math.round((PROFESSIONS[profession].money - cost) * 100) / 100,
        inventory, wagonCondition:100, oxCondition:100,
        party:names.map((name) => ({ name, hp:100, alive:true, statuses:[] })),
        visited:['Independence'], journal:[{date,text:'V1.2 production grade'}], ended:false,
      };
      return { date, startingMoney: state.money };
    }
    async function resolveModal(stats) {
      if (!modal.open) return 'none';
      const eyebrow = document.querySelector('#modalEyebrow').textContent.trim();
      if (eyebrow === 'JOURNEY COMPLETE' || eyebrow === 'RUN ENDED') return 'terminal';
      if (eyebrow === 'RIVER CROSSING') {
        const landmark = LANDMARKS.find((item) => Math.abs(item.distance - state.distance) < 0.1);
        if (!landmark) throw new Error(`River landmark missing at ${state.distance}`);
        const method = state.money >= 45 ? 'ferry' : 'float';
        stats.rivers += 1;
        stats[method] += 1;
        await resolveRiver(landmark, method);
        return 'river';
      }
      if (eyebrow === 'LANDMARK') {
        if (state.inventory.food < 180 && state.money >= 65) {
          state.money -= 65; state.inventory.food += 75; stats.foodBuys += 1; modal.close(); return 'food';
        }
        if (state.inventory.medicine < 2 && state.money >= 35) {
          state.money -= 35; state.inventory.medicine += 1; stats.medBuys += 1; modal.close(); return 'medicine';
        }
      }
      modal.close();
      return eyebrow.toLowerCase();
    }
    async function act(stats) {
      const sick = aliveParty().filter((member) => member.statuses.length).sort((a,b) => a.hp-b.hp);
      if (sick.length && state.inventory.medicine > 0 && sick[0].hp < 68 && useMedicine(sick[0])) { stats.treatments += 1; return; }
      if (state.inventory.food < 120 && state.inventory.ammo >= 5) { stats.hunts += 1; await huntDay(); return; }
      if (averageHealth() < 58 && state.inventory.food >= dailyFoodNeed()) { stats.rests += 1; await restDay(); return; }
      if (state.wagonCondition < 48) { stats.repairs += 1; await repairDay(); return; }
      stats.travel += 1; await continueTravel();
    }

    const runs = [];
    for (const profession of professions) {
      for (const seed of seeds) {
        const start = reset(profession, seed);
        const stats = { travel:0, hunts:0, rests:0, repairs:0, treatments:0, rivers:0, ferry:0, float:0, foodBuys:0, medBuys:0 };
        let actions = 0;
        while (actions < 180 && !state.ended) {
          if (modal.open) {
            const result = await resolveModal(stats);
            if (result === 'terminal') break;
            continue;
          }
          await act(stats);
          actions += 1;
        }
        runs.push({
          profession, seed, startingMoney:start.startingMoney, actions,
          days:Math.round((new Date(state.date)-new Date(start.date))/86400000),
          completed:state.distance >= TOTAL_DISTANCE,
          stats,
          final:{ distance:Math.round(state.distance), survivors:aliveParty().length, food:Math.round(state.inventory.food), ammo:Math.round(state.inventory.ammo), money:Math.round(state.money), wagon:Math.round(state.wagonCondition), ox:Math.round(state.oxCondition), health:Math.round(averageHealth()) },
        });
      }
    }

    const completed = runs.filter((run) => run.completed).length;
    return {
      balanceVersion:window.frontierBalance.version,
      runCount:runs.length,
      completed,
      completionRate:completed/runs.length,
      avgDistance:Math.round(runs.reduce((s,r)=>s+r.final.distance,0)/runs.length),
      avgSurvivors:Number((runs.reduce((s,r)=>s+r.final.survivors,0)/runs.length).toFixed(2)),
      avgDays:Math.round(runs.reduce((s,r)=>s+r.days,0)/runs.length),
      avgActions:Math.round(runs.reduce((s,r)=>s+r.actions,0)/runs.length),
      avgHunts:Number((runs.reduce((s,r)=>s+r.stats.hunts,0)/runs.length).toFixed(1)),
      avgRepairs:Number((runs.reduce((s,r)=>s+r.stats.repairs,0)/runs.length).toFixed(1)),
      oxZeroRate:runs.filter((r)=>r.final.ox<=0).length/runs.length,
      partyWipeRate:runs.filter((r)=>r.final.survivors===0).length/runs.length,
      foodZeroRate:runs.filter((r)=>r.final.food<=0).length/runs.length,
      byProfession:Object.fromEntries(professions.map((profession) => {
        const group = runs.filter((run)=>run.profession===profession);
        return [profession, {
          startingMoney:group[0].startingMoney,
          completionRate:group.filter((run)=>run.completed).length/group.length,
          avgDistance:Math.round(group.reduce((s,r)=>s+r.final.distance,0)/group.length),
          avgSurvivors:Number((group.reduce((s,r)=>s+r.final.survivors,0)/group.length).toFixed(2)),
          avgDays:Math.round(group.reduce((s,r)=>s+r.days,0)/group.length),
          ferryRate:Number((group.reduce((s,r)=>s+r.stats.ferry,0)/group.length).toFixed(1)),
        }];
      })),
      runs,
    };
  }, { professions, seeds });

  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join('; ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert(summary.runCount === 100, `Expected 100 production runs, got ${summary.runCount}`);

  console.log('\n=== FRONTIER JOURNEY V1.2 PRODUCTION GRADE ===');
  console.log(JSON.stringify({ ...summary, runs: undefined }, null, 2));
  await fs.writeFile(new URL('./summary.json', outDir), JSON.stringify(summary, null, 2));
  await context.close();
} finally {
  await browser.close();
}
