import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const outDir = new URL('../test-results-tuning-round4/', import.meta.url);
await fs.mkdir(outDir, { recursive: true });

const candidates = [
  { id: 'ox_005', steady: 0.05, scale: 1.00 },
  { id: 'ox_006', steady: 0.06, scale: 1.20 },
  { id: 'ox_007', steady: 0.07, scale: 1.40 },
  { id: 'ox_008', steady: 0.08, scale: 1.60 },
];
const professions = ['banker', 'carpenter', 'farmer', 'hunter', 'doctor'];
const seeds = Array.from({ length: 20 }, (_, i) => `CALIBRATE-${String(i + 1).padStart(3, '0')}`);

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  if (!response?.ok()) throw new Error('Game did not load');
  await page.waitForFunction(() => window.frontierAutoTravel?.setDayDisplayMs);

  const results = await page.evaluate(async ({ candidates, professions, seeds }) => {
    window.frontierAutoTravel.setDayDisplayMs(0);
    saveGame = async () => {};
    renderGame = () => {};
    updateScene = () => {};
    sound = { click: { play() {} }, good: { play() {} }, bad: { play() {} } };
    const modal = document.querySelector('#modal');
    const names = ['You', 'Martha', 'Elias', 'Rose', 'Samuel'];
    const original = {
      region: { ...REGION_BASE_MILES }, pace: JSON.parse(JSON.stringify(PACE)),
      weather: JSON.parse(JSON.stringify(WEATHER)), rations: JSON.parse(JSON.stringify(RATIONS)),
    };
    const baseWeatherOx = { Rain: 0.025, Storm: 0.075, Mud: 0.10, Heat: 0.20, Snow: 0.15 };

    function restore() {
      Object.assign(REGION_BASE_MILES, original.region);
      for (const [k,v] of Object.entries(original.pace)) Object.assign(PACE[k], v);
      for (const [k,v] of Object.entries(original.weather)) Object.assign(WEATHER[k], v);
      for (const [k,v] of Object.entries(original.rations)) Object.assign(RATIONS[k], v);
      REGION_BASE_MILES.Prairie = 17;
    }
    function apply(c) {
      restore();
      Object.assign(REGION_BASE_MILES, { Prairie:17, Plains:16, Foothills:14, Mountains:12, 'High Desert':14, Columbia:13, Valley:15 });
      PACE.Steady.ox = c.steady;
      for (const [weather, wear] of Object.entries(baseWeatherOx)) WEATHER[weather].ox = wear * c.scale;
      PACE.Steady.wagon = 0.05;
      Object.assign(WEATHER.Rain, { wagon:0.15 });
      Object.assign(WEATHER.Storm, { wagon:0.30 });
      Object.assign(WEATHER.Mud, { wagon:0.40 });
      Object.assign(WEATHER.Heat, { wagon:0.05 });
      Object.assign(WEATHER.Snow, { wagon:0.25 });
      RATIONS.Meager.hp = -0.1;
    }
    function reset(profession, seed) {
      if (modal.open) modal.close();
      rng = makeRng(`${seed}-${profession}`);
      const date = new Date(1848,3,1,12).toISOString();
      state = {
        version:1, seed, profession, date, distance:0, weather:'Clear', pace:'Steady', rations:'Meager', money:400,
        inventory:{ food:1000, ammo:300, medicine:3, clothing:10, wheelParts:2, axleParts:2, tongueParts:2, oxen:6 },
        wagonCondition:100, oxCondition:100,
        party:names.map(name => ({ name, hp:100, alive:true, statuses:[] })),
        visited:['Independence'], journal:[{date,text:'Calibration run'}], ended:false,
      };
      return date;
    }
    async function resolveModal(stats) {
      if (!modal.open) return 'none';
      const eyebrow = document.querySelector('#modalEyebrow').textContent.trim();
      if (eyebrow === 'JOURNEY COMPLETE' || eyebrow === 'RUN ENDED') return 'terminal';
      if (eyebrow === 'RIVER CROSSING') {
        const landmark = LANDMARKS.find(x => Math.abs(x.distance - state.distance) < 0.1);
        await resolveRiver(landmark, state.money >= 45 ? 'ferry' : 'float'); stats.rivers++; return 'river';
      }
      if (eyebrow === 'LANDMARK') {
        if (state.inventory.food < 180 && state.money >= 65) { state.money -=65; state.inventory.food +=75; stats.foodBuys++; modal.close(); return 'food'; }
        if (state.inventory.medicine < 2 && state.money >=35) { state.money -=35; state.inventory.medicine++; stats.medBuys++; modal.close(); return 'med'; }
      }
      modal.close(); return eyebrow.toLowerCase();
    }
    async function act(stats) {
      const sick = aliveParty().filter(m => m.statuses.length).sort((a,b)=>a.hp-b.hp);
      if (sick.length && state.inventory.medicine > 0 && sick[0].hp < 68 && useMedicine(sick[0])) { stats.treatments++; return; }
      if (state.inventory.food < 120 && state.inventory.ammo >= 5) { stats.hunts++; await huntDay(); return; }
      if (averageHealth() < 58 && state.inventory.food >= dailyFoodNeed()) { stats.rests++; await restDay(); return; }
      if (state.wagonCondition < 48) { stats.repairs++; await repairDay(); return; }
      stats.travel++; await continueTravel();
    }

    const output = [];
    for (const c of candidates) {
      apply(c);
      const runs = [];
      for (const profession of professions) {
        for (const seed of seeds) {
          const start = reset(profession, seed);
          const stats = { travel:0, hunts:0, rests:0, repairs:0, treatments:0, rivers:0, foodBuys:0, medBuys:0 };
          let actions=0;
          while (actions < 180 && !state.ended) {
            if (modal.open) { const r = await resolveModal(stats); if (r === 'terminal') break; continue; }
            await act(stats); actions++;
          }
          runs.push({ profession, completed:state.distance>=TOTAL_DISTANCE, distance:Math.round(state.distance), survivors:aliveParty().length,
            days:Math.round((new Date(state.date)-new Date(start))/86400000), actions, stats, ox:Math.round(state.oxCondition), wagon:Math.round(state.wagonCondition), food:Math.round(state.inventory.food) });
        }
      }
      const completed = runs.filter(r=>r.completed).length;
      const pct = (fn) => runs.filter(fn).length / runs.length;
      output.push({
        id:c.id, runs:runs.length, completed, completionRate:completed/runs.length,
        avgDistance:Math.round(runs.reduce((s,r)=>s+r.distance,0)/runs.length),
        avgSurvivors:Number((runs.reduce((s,r)=>s+r.survivors,0)/runs.length).toFixed(2)),
        avgDays:Math.round(runs.reduce((s,r)=>s+r.days,0)/runs.length),
        avgActions:Math.round(runs.reduce((s,r)=>s+r.actions,0)/runs.length),
        avgHunts:Number((runs.reduce((s,r)=>s+r.stats.hunts,0)/runs.length).toFixed(1)),
        avgRepairs:Number((runs.reduce((s,r)=>s+r.stats.repairs,0)/runs.length).toFixed(1)),
        oxZeroRate:pct(r=>r.ox<=0), partyWipeRate:pct(r=>r.survivors===0), foodZeroRate:pct(r=>r.food<=0),
        byProfession:Object.fromEntries(professions.map(p=>{ const g=runs.filter(r=>r.profession===p); return [p,{ completionRate:g.filter(r=>r.completed).length/g.length, avgDistance:Math.round(g.reduce((s,r)=>s+r.distance,0)/g.length), avgSurvivors:Number((g.reduce((s,r)=>s+r.survivors,0)/g.length).toFixed(2)) }]; })),
      });
    }
    restore(); return output;
  }, { candidates, professions, seeds });

  if (errors.length) throw new Error(errors.join('; '));
  console.log('\n=== 400-RUN OX CALIBRATION ===');
  for (const row of results) console.log(JSON.stringify(row, null, 2));
  await fs.writeFile(new URL('./round4-results.json', outDir), JSON.stringify(results, null, 2));
  await context.close();
} finally { await browser.close(); }
