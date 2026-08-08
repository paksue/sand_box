/* Frontier Journey MVP — all simulation and persistence are client-side. */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const TOTAL_DISTANCE = 2040;
const SAVE_ID = 'current';

const PROFESSIONS = {
  banker: {
    name: 'Banker',
    money: 1600,
    description: 'The safest opening purse. Easier to recover from poor purchasing decisions.',
    scoreMultiplier: 0.85,
  },
  carpenter: {
    name: 'Carpenter',
    money: 900,
    description: 'Repairs restore more wagon condition and field fixes are less likely to fail.',
    repairBonus: 18,
    scoreMultiplier: 1.0,
  },
  farmer: {
    name: 'Farmer',
    money: 650,
    description: 'A lean start. Food stretches slightly farther, but every purchase matters.',
    foodEfficiency: 0.9,
    scoreMultiplier: 1.2,
  },
  hunter: {
    name: 'Hunter',
    money: 800,
    description: 'Better hunting outcomes and lower ammunition waste.',
    huntBonus: 22,
    scoreMultiplier: 1.1,
  },
  doctor: {
    name: 'Doctor',
    money: 850,
    description: 'Illness is less severe and rest restores more health.',
    healthBonus: 2,
    scoreMultiplier: 1.05,
  },
};

const STORE_ITEMS = [
  { id: 'food', label: 'Food', detail: 'lb', price: 0.5, step: 25, min: 0, default: 450 },
  { id: 'ammo', label: 'Ammunition', detail: 'rounds', price: 0.2, step: 10, min: 0, default: 80 },
  { id: 'medicine', label: 'Medicine', detail: 'doses', price: 25, step: 1, min: 0, default: 3 },
  { id: 'clothing', label: 'Clothing', detail: 'sets', price: 12, step: 1, min: 0, default: 6 },
  { id: 'wheelParts', label: 'Spare wheels', detail: 'parts', price: 20, step: 1, min: 0, default: 2 },
  { id: 'axleParts', label: 'Spare axles', detail: 'parts', price: 20, step: 1, min: 0, default: 2 },
  { id: 'tongueParts', label: 'Spare tongues', detail: 'parts', price: 18, step: 1, min: 0, default: 1 },
  { id: 'oxen', label: 'Oxen', detail: 'animals', price: 60, step: 1, min: 0, default: 4 },
];

const LANDMARKS = [
  { name: 'Independence', distance: 0, region: 'Prairie' },
  { name: 'Kansas River', distance: 102, region: 'Prairie', river: { width: 620, depth: 2.8, current: 2 } },
  { name: 'Fort Kearny', distance: 304, region: 'Plains', fort: true },
  { name: 'Chimney Rock', distance: 554, region: 'Plains' },
  { name: 'Fort Laramie', distance: 640, region: 'Foothills', fort: true },
  { name: 'Independence Rock', distance: 830, region: 'Foothills' },
  { name: 'South Pass', distance: 1000, region: 'Mountains' },
  { name: 'Fort Hall', distance: 1180, region: 'High Desert', fort: true },
  { name: 'Snake River', distance: 1430, region: 'High Desert', river: { width: 900, depth: 4.1, current: 4 } },
  { name: 'Blue Mountains', distance: 1680, region: 'Mountains' },
  { name: 'The Dalles', distance: 1900, region: 'Columbia', river: { width: 1100, depth: 5.4, current: 4 }, fort: true },
  { name: 'Willamette Valley', distance: TOTAL_DISTANCE, region: 'Valley' },
];

const REGION_BASE_MILES = {
  Prairie: 15,
  Plains: 14,
  Foothills: 11,
  Mountains: 8,
  'High Desert': 12,
  Columbia: 9,
  Valley: 13,
};

const PACE = {
  Steady: { travel: 1.0, hp: 0, wagon: 0.2, ox: 0.4 },
  Strenuous: { travel: 1.22, hp: -1, wagon: 0.6, ox: 0.9 },
  Grueling: { travel: 1.42, hp: -2.5, wagon: 1.1, ox: 1.6 },
};

const RATIONS = {
  Filling: { food: 3, hp: 0.5 },
  Meager: { food: 2, hp: -0.5 },
  'Bare bones': { food: 1, hp: -1.5 },
};

const WEATHER = {
  Clear: { travel: 1.0, wagon: 0, ox: 0, cold: 0 },
  Rain: { travel: 0.92, wagon: 0.3, ox: 0.1, cold: 0 },
  Storm: { travel: 0.75, wagon: 0.6, ox: 0.3, cold: 1 },
  Mud: { travel: 0.7, wagon: 0.8, ox: 0.4, cold: 0 },
  Heat: { travel: 0.88, wagon: 0.1, ox: 0.8, cold: 0 },
  Snow: { travel: 0.65, wagon: 0.5, ox: 0.6, cold: 3 },
};

const DEFAULT_NAMES = ['You', 'Martha', 'Elias', 'Rose', 'Samuel'];

const db = new Dexie('frontierJourney');
db.version(1).stores({ saves: 'id,updatedAt' });

let state = null;
let rng = null;
let pixi = null;
let scene = null;
let sound = {};

function hashSeed(text) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seedText) {
  let a = hashSeed(seedText) || 1;
  return () => {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(items) {
  return items[Math.floor(rng() * items.length)];
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function money(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDate(iso) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}

function addDays(iso, days) {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function aliveParty() {
  return state.party.filter((member) => member.alive);
}

function averageHealth() {
  const living = aliveParty();
  if (!living.length) return 0;
  return living.reduce((sum, member) => sum + member.hp, 0) / living.length;
}

function currentProfession() {
  return PROFESSIONS[state.profession];
}

function currentRegion() {
  let region = LANDMARKS[0].region;
  for (const landmark of LANDMARKS) {
    if (state.distance >= landmark.distance) region = landmark.region;
    else break;
  }
  return region;
}

function nextLandmark() {
  return LANDMARKS.find((landmark) => landmark.distance > state.distance + 0.01) || LANDMARKS.at(-1);
}

function healthLabel(hp, alive = true) {
  if (!alive) return 'Dead';
  if (hp > 80) return 'Healthy';
  if (hp > 60) return 'Tired';
  if (hp > 40) return 'Poor';
  if (hp > 20) return 'Ill';
  return 'Critical';
}

function generateToneBlob(frequency = 440, duration = 0.08, volume = 0.12) {
  const rate = 8000;
  const samples = Math.floor(rate * duration);
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const write = (offset, value) => [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  write(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, samples * 2, true);
  for (let i = 0; i < samples; i += 1) {
    const envelope = 1 - i / samples;
    const sample = Math.sin((i / rate) * frequency * Math.PI * 2) * envelope * volume;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }
  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

function initSound() {
  sound.click = new Howl({ src: [generateToneBlob(420, 0.045, 0.08)], volume: 0.4 });
  sound.good = new Howl({ src: [generateToneBlob(660, 0.09, 0.1)], volume: 0.45 });
  sound.bad = new Howl({ src: [generateToneBlob(170, 0.13, 0.12)], volume: 0.5 });
}

async function initPixi() {
  const container = $('#pixiScene');
  pixi = new PIXI.Application();
  await pixi.init({ resizeTo: container, backgroundAlpha: 0, antialias: true });
  container.appendChild(pixi.canvas);

  const root = new PIXI.Container();
  pixi.stage.addChild(root);

  const sky = new PIXI.Graphics().rect(0, 0, 1400, 600).fill(0x94b6c2);
  const sun = new PIXI.Graphics().circle(1080, 100, 44).fill(0xf1d690);
  const farHills = new PIXI.Graphics()
    .moveTo(0, 320).lineTo(140, 205).lineTo(290, 310).lineTo(455, 170).lineTo(650, 315)
    .lineTo(820, 215).lineTo(1010, 310).lineTo(1200, 190).lineTo(1400, 300).lineTo(1400, 600).lineTo(0, 600)
    .fill(0x6f7657);
  const ground = new PIXI.Graphics().rect(0, 330, 1400, 270).fill(0xa88a56);
  const trail = new PIXI.Graphics()
    .moveTo(0, 520).lineTo(1400, 455).lineTo(1400, 565).lineTo(0, 600).fill(0xc8ad78);

  const wagon = new PIXI.Container();
  const cover = new PIXI.Graphics().roundRect(65, 20, 165, 95, 45).fill(0xe7dcc0).stroke({ color: 0x493225, width: 5 });
  const body = new PIXI.Graphics().rect(55, 93, 195, 52).fill(0x765038).stroke({ color: 0x3f2a1f, width: 4 });
  const wheel1 = new PIXI.Graphics().circle(93, 150, 30).stroke({ color: 0x3d2a1e, width: 7 });
  const wheel2 = new PIXI.Graphics().circle(215, 150, 30).stroke({ color: 0x3d2a1e, width: 7 });
  const axle = new PIXI.Graphics().rect(88, 145, 132, 6).fill(0x3d2a1e);
  const tongue = new PIXI.Graphics().rect(245, 112, 125, 7).fill(0x5b3b29);
  const ox = new PIXI.Graphics()
    .ellipse(405, 112, 55, 28).fill(0x705f4b)
    .circle(455, 104, 20).fill(0x705f4b)
    .rect(382, 130, 8, 35).fill(0x4f4336)
    .rect(426, 130, 8, 35).fill(0x4f4336);
  wagon.addChild(cover, body, axle, wheel1, wheel2, tongue, ox);
  wagon.x = 520;
  wagon.y = 275;
  wagon.scale.set(0.9);

  const tufts = [];
  for (let i = 0; i < 18; i += 1) {
    const tuft = new PIXI.Graphics().moveTo(0, 18).lineTo(8, 0).lineTo(12, 18).lineTo(20, 4).stroke({ color: 0x586145, width: 3 });
    tuft.x = i * 85;
    tuft.y = 420 + (i % 4) * 35;
    tuft.scale.set(0.8 + (i % 3) * 0.2);
    tufts.push(tuft);
  }

  const rain = new PIXI.Container();
  for (let i = 0; i < 90; i += 1) {
    const drop = new PIXI.Graphics().moveTo(0, 0).lineTo(-8, 20).stroke({ color: 0xdcecf2, width: 2, alpha: 0.6 });
    drop.x = (i * 67) % 1400;
    drop.y = (i * 43) % 600;
    rain.addChild(drop);
  }
  rain.visible = false;

  root.addChild(sky, sun, farHills, ground, trail, ...tufts, wagon, rain);
  scene = { wagon, wheel1, wheel2, tufts, rain, farHills, sky, sun };

  let tick = 0;
  pixi.ticker.add((ticker) => {
    tick += ticker.deltaTime;
    const traveling = state && !$('#gameScreen').classList.contains('hidden') && !$('#modal').open;
    if (traveling) {
      scene.wheel1.rotation += 0.025 * ticker.deltaTime;
      scene.wheel2.rotation += 0.025 * ticker.deltaTime;
      for (const tuft of scene.tufts) {
        tuft.x -= 0.7 * ticker.deltaTime;
        if (tuft.x < -30) tuft.x = pixi.renderer.width + 30;
      }
      scene.farHills.x = Math.sin(tick / 500) * 3;
      scene.wagon.y = 275 + Math.sin(tick / 22) * 1.5;
    }
    if (scene.rain.visible) {
      for (const drop of scene.rain.children) {
        drop.y += 7 * ticker.deltaTime;
        drop.x -= 2 * ticker.deltaTime;
        if (drop.y > pixi.renderer.height + 20) {
          drop.y = -20;
          drop.x = Math.random() * pixi.renderer.width;
        }
      }
    }
  });
}

function updateScene() {
  if (!scene || !state) return;
  scene.rain.visible = ['Rain', 'Storm', 'Snow'].includes(state.weather);
  if (state.weather === 'Snow') {
    scene.sky.tint = 0xdfe5df;
    scene.sun.visible = false;
  } else if (state.weather === 'Storm') {
    scene.sky.tint = 0x778995;
    scene.sun.visible = false;
  } else {
    scene.sky.tint = 0xffffff;
    scene.sun.visible = true;
  }
}

function renderSetup() {
  const professionSelect = $('#professionSelect');
  professionSelect.innerHTML = Object.entries(PROFESSIONS).map(([id, p]) => `<option value="${id}">${p.name}</option>`).join('');

  $('#partyInputs').innerHTML = DEFAULT_NAMES.map((name, index) => `
    <div class="party-row">
      <span class="party-number">${index + 1}</span>
      <input class="party-name" maxlength="18" value="${name}" aria-label="Party member ${index + 1} name" />
    </div>`).join('');

  $('#storeRows').innerHTML = STORE_ITEMS.map((item) => `
    <div class="store-row">
      <div><strong>${item.label}</strong><br><small>${money(item.price)} / ${item.detail}</small></div>
      <input id="store-${item.id}" type="number" min="${item.min}" step="${item.step}" value="${item.default}" aria-label="${item.label}" />
      <div id="cost-${item.id}" class="store-price"></div>
    </div>`).join('');

  professionSelect.addEventListener('change', updateOutfitting);
  for (const item of STORE_ITEMS) $(`#store-${item.id}`).addEventListener('input', updateOutfitting);
  updateOutfitting();
}

function storeValues() {
  return Object.fromEntries(STORE_ITEMS.map((item) => [item.id, Math.max(0, Number($(`#store-${item.id}`).value) || 0)]));
}

function outfittingCost() {
  const values = storeValues();
  return STORE_ITEMS.reduce((sum, item) => sum + values[item.id] * item.price, 0);
}

function updateOutfitting() {
  const profession = PROFESSIONS[$('#professionSelect').value];
  $('#professionCard').innerHTML = `<strong>${profession.name} — ${money(profession.money)}</strong><span>${profession.description}</span>`;
  $('#budgetValue').textContent = money(profession.money);
  const values = storeValues();
  for (const item of STORE_ITEMS) $(`#cost-${item.id}`).textContent = money(values[item.id] * item.price);
  const cost = outfittingCost();
  $('#storeTotal').textContent = money(cost);
  const warning = $('#storeWarning');
  if (cost > profession.money) {
    warning.textContent = `You are ${money(cost - profession.money)} over budget.`;
    warning.classList.remove('hidden');
  } else if (values.food < 250 || values.oxen < 3 || values.clothing < 5) {
    warning.textContent = 'Risky outfit: low food, oxen, or clothing can become expensive later.';
    warning.classList.remove('hidden');
  } else {
    warning.classList.add('hidden');
  }
}

function randomSeedText() {
  const words = ['BUFFALO', 'PRAIRIE', 'WAGON', 'RIVER', 'LANTERN', 'TRAIL', 'OXEN', 'SAGE'];
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${words[Math.floor(Math.random() * words.length)]}-${rand}`;
}

async function startNewRun() {
  const professionId = $('#professionSelect').value;
  const profession = PROFESSIONS[professionId];
  const inventory = storeValues();
  const cost = outfittingCost();
  const names = $$('.party-name').map((input) => input.value.trim()).filter(Boolean);
  if (names.length !== 5) return showInfo('Party incomplete', 'Give all five travelers a name before leaving.');
  if (new Set(names.map((n) => n.toLowerCase())).size !== 5) return showInfo('Names must be unique', 'Give each traveler a distinct name so the journal can track them clearly.');
  if (cost > profession.money) return showInfo('Over budget', 'Reduce your purchases before leaving Independence.');
  if (inventory.oxen < 2) return showInfo('Not enough oxen', 'You need at least two oxen to pull the wagon.');

  const month = Number($('#departureSelect').value);
  const seed = ($('#seedInput').value.trim() || randomSeedText()).toUpperCase();
  rng = makeRng(seed);
  state = {
    version: 1,
    seed,
    profession: professionId,
    date: new Date(1848, month - 1, 1, 12).toISOString(),
    distance: 0,
    weather: 'Clear',
    pace: 'Steady',
    rations: 'Filling',
    money: Math.round((profession.money - cost) * 100) / 100,
    inventory,
    wagonCondition: 100,
    oxCondition: 100,
    party: names.map((name) => ({ name, hp: 100, alive: true, statuses: [] })),
    visited: ['Independence'],
    journal: [{ date: new Date(1848, month - 1, 1, 12).toISOString(), text: `Left Independence with ${money(profession.money - cost)} in reserve.` }],
    ended: false,
  };
  await saveGame();
  showGame();
  sound.good?.play();
}

async function saveGame() {
  if (!state) return;
  await db.saves.put({ id: SAVE_ID, updatedAt: Date.now(), state: clone(state) });
  $('#resumeButton').classList.remove('hidden');
}

async function resumeGame() {
  const save = await db.saves.get(SAVE_ID);
  if (!save?.state) return;
  state = save.state;
  rng = makeRng(`${state.seed}:${state.journal.length}:${Math.round(state.distance)}`);
  showGame();
}

async function clearRun() {
  await db.saves.delete(SAVE_ID);
  state = null;
  $('#gameScreen').classList.add('hidden');
  $('#setupScreen').classList.remove('hidden');
  $('#newRunButton').classList.add('hidden');
  $('#resumeButton').classList.add('hidden');
}

function showGame() {
  $('#setupScreen').classList.add('hidden');
  $('#gameScreen').classList.remove('hidden');
  $('#newRunButton').classList.remove('hidden');
  renderGame();
}

function renderGame() {
  if (!state) return;
  const landmark = nextLandmark();
  $('#dateValue').textContent = formatDate(state.date);
  $('#distanceValue').textContent = `${Math.round(state.distance)} / ${TOTAL_DISTANCE} mi`;
  $('#landmarkValue').textContent = state.distance >= TOTAL_DISTANCE ? 'Journey complete' : `${landmark.name} · ${Math.max(0, Math.round(landmark.distance - state.distance))} mi`;
  $('#weatherValue').textContent = state.weather;
  $('#seedValue').textContent = state.seed;
  $('#professionBadge').textContent = currentProfession().name;

  $('#partyStatus').innerHTML = state.party.map((member) => `
    <div class="member-card ${member.alive ? '' : 'dead'}">
      <div class="member-top"><strong>${escapeHtml(member.name)}</strong><small>${healthLabel(member.hp, member.alive)}</small></div>
      <div class="health-track"><i style="width:${member.alive ? clamp(member.hp, 0, 100) : 0}%"></i></div>
      ${member.statuses.length ? `<div class="status-effect">${member.statuses.map((s) => escapeHtml(s.name)).join(', ')}</div>` : ''}
    </div>`).join('');

  const resources = [
    ['Food', `${Math.round(state.inventory.food)} lb`],
    ['Money', money(state.money)],
    ['Ammo', Math.round(state.inventory.ammo)],
    ['Medicine', state.inventory.medicine],
    ['Clothing', state.inventory.clothing],
    ['Oxen', state.inventory.oxen],
    ['Wheels', state.inventory.wheelParts],
    ['Axles', state.inventory.axleParts],
    ['Tongues', state.inventory.tongueParts],
  ];
  $('#resourceList').innerHTML = resources.map(([label, value]) => `<div class="resource-item"><span>${label}</span><strong>${value}</strong></div>`).join('');
  $('#wagonConditionValue').textContent = `${Math.round(state.wagonCondition)}%`;
  $('#wagonMeter').style.width = `${clamp(state.wagonCondition, 0, 100)}%`;
  $('#oxConditionValue').textContent = `${Math.round(state.oxCondition)}%`;
  $('#oxMeter').style.width = `${clamp(state.oxCondition, 0, 100)}%`;
  $('#paceValue').textContent = state.pace;
  $('#rationsValue').textContent = state.rations;
  $('#sceneCaption').textContent = sceneCaption();
  updateScene();

  const disableActions = state.ended || aliveParty().length === 0;
  $$('.action-button').forEach((button) => { button.disabled = disableActions; });
}

function sceneCaption() {
  const region = currentRegion();
  const health = Math.round(averageHealth());
  if (state.weather === 'Storm') return `A storm closes in over the ${region.toLowerCase()}. Average party health: ${health}%.`;
  if (state.weather === 'Snow') return `Snow slows the wagon in the ${region.toLowerCase()}. Clothing matters now.`;
  if (state.wagonCondition < 35) return `The wagon groans over the ${region.toLowerCase()}. Its condition is becoming dangerous.`;
  if (state.inventory.food < 80) return `Food is running low. The next decision may be whether to hunt or keep moving.`;
  return `The wagon moves through the ${region.toLowerCase()}. Average party health: ${health}%.`;
}

function rollWeather() {
  const month = new Date(state.date).getMonth() + 1;
  const region = currentRegion();
  const roll = rng();
  if (month >= 10 && ['Mountains', 'Columbia', 'Valley'].includes(region) && roll < 0.28) return 'Snow';
  if (region === 'High Desert' && roll < 0.18) return 'Heat';
  if (roll < 0.11) return 'Storm';
  if (roll < 0.23) return 'Rain';
  if (roll < 0.30) return 'Mud';
  return 'Clear';
}

function dailyFoodNeed() {
  const efficiency = currentProfession().foodEfficiency || 1;
  return aliveParty().length * RATIONS[state.rations].food * efficiency;
}

function applyDailyHealth({ resting = false } = {}) {
  const paceHp = resting ? 0 : PACE[state.pace].hp;
  const rationHp = RATIONS[state.rations].hp;
  const weather = WEATHER[state.weather];
  const clothingNeeded = weather.cold > 0 ? aliveParty().length + Math.max(0, weather.cold - 1) : 0;
  const underClothed = state.inventory.clothing < clothingNeeded;

  for (const member of aliveParty()) {
    let delta = resting ? 4 + (currentProfession().healthBonus || 0) : paceHp + rationHp;
    if (underClothed) delta -= weather.cold * 1.2;
    for (const status of member.statuses) delta -= status.damage;
    member.hp = clamp(member.hp + delta, 0, 100);

    member.statuses = member.statuses
      .map((status) => ({ ...status, days: status.days - 1 }))
      .filter((status) => status.days > 0);

    if (member.hp <= 0 && member.alive) killMember(member, 'exposure and illness');
  }
}

function consumeFood() {
  const needed = dailyFoodNeed();
  if (state.inventory.food >= needed) {
    state.inventory.food -= needed;
    return false;
  }
  state.inventory.food = 0;
  for (const member of aliveParty()) member.hp = clamp(member.hp - 4, 0, 100);
  logEntry('Food ran out for the day. Everyone weakened.');
  return true;
}

function advanceDateOnly({ resting = false } = {}) {
  state.date = addDays(state.date, 1);
  state.weather = rollWeather();
  consumeFood();
  applyDailyHealth({ resting });
}

async function continueTravel() {
  if (!state || state.ended) return;
  state.weather = rollWeather();
  const region = currentRegion();
  const weather = WEATHER[state.weather];
  const pace = PACE[state.pace];
  const base = REGION_BASE_MILES[region] || 11;
  const oxMultiplier = 0.65 + (state.oxCondition / 100) * 0.5;
  const wagonMultiplier = 0.75 + (state.wagonCondition / 100) * 0.25;
  const miles = Math.max(2, Math.round(base * pace.travel * oxMultiplier * wagonMultiplier * weather.travel));

  consumeFood();
  applyDailyHealth();
  state.wagonCondition = clamp(state.wagonCondition - (region === 'Mountains' ? 1.2 : 0.4) - pace.wagon - weather.wagon, 0, 100);
  state.oxCondition = clamp(state.oxCondition - pace.ox - weather.ox, 0, 100);
  state.date = addDays(state.date, 1);

  const targetDistance = Math.min(TOTAL_DISTANCE, state.distance + miles);
  const reached = LANDMARKS.find((landmark) => landmark.distance > state.distance && landmark.distance <= targetDistance);
  state.distance = reached ? reached.distance : targetDistance;

  if (state.wagonCondition <= 0) {
    logEntry('The wagon failed completely. The party could go no farther.');
    return endRun(false, 'The wagon collapsed beyond repair.');
  }
  if (state.oxCondition <= 0 || state.inventory.oxen <= 0) {
    logEntry('The oxen could no longer pull the wagon.');
    return endRun(false, 'Without working oxen, the journey ended on the trail.');
  }
  if (!aliveParty().length) return endRun(false, 'No one survived to continue the journey.');

  if (reached) {
    await saveGame();
    renderGame();
    if (reached.distance >= TOTAL_DISTANCE) return endRun(true, 'The survivors reached the Willamette Valley.');
    if (reached.river && !state.visited.includes(reached.name)) return showRiverCrossing(reached);
    if (!state.visited.includes(reached.name)) return showLandmark(reached);
  }

  const eventTriggered = maybeRandomEvent();
  await saveGame();
  renderGame();
  if (!eventTriggered) sound.click?.play();
}

function maybeRandomEvent() {
  const hazardChance = 0.20 + (averageHealth() < 55 ? 0.05 : 0) + (state.wagonCondition < 45 ? 0.05 : 0);
  if (rng() < hazardChance) {
    triggerHazard();
    return true;
  }
  if (rng() < 0.09) {
    triggerOpportunity();
    return true;
  }
  return false;
}

function randomLivingMember() {
  const living = aliveParty();
  return living.length ? pick(living) : null;
}

function triggerHazard() {
  const events = ['illness', 'breakdown', 'spoilage', 'injury', 'oxen', 'theft'];
  const type = pick(events);
  let title = 'Trouble on the trail';
  let body = '';

  if (type === 'illness') {
    const member = randomLivingMember();
    if (!member) return;
    const severity = currentProfession().name === 'Doctor' ? 1.5 : 2.5;
    member.statuses.push({ name: pick(['Fever', 'Stomach illness', 'Infection']), days: randomInt(3, 6), damage: severity });
    member.hp = clamp(member.hp - randomInt(3, 8), 0, 100);
    title = `${member.name} is sick`;
    body = `A sudden illness leaves ${escapeHtml(member.name)} weak. Rest and medicine can keep a bad week from becoming a fatal one.`;
    logEntry(`${member.name} became ill.`);
  } else if (type === 'breakdown') {
    const loss = randomInt(6, 14);
    state.wagonCondition = clamp(state.wagonCondition - loss, 0, 100);
    title = 'A hard crack under the wagon';
    body = `Rough ground damaged the wagon. Condition fell by ${loss}%.`;
    logEntry(`Wagon damage cost ${loss}% condition.`);
  } else if (type === 'spoilage') {
    const loss = Math.min(state.inventory.food, randomInt(15, 38));
    state.inventory.food -= loss;
    title = 'Food spoiled';
    body = `${Math.round(loss)} lb of food was ruined by damp, pests, and poor storage.`;
    logEntry(`${Math.round(loss)} lb of food spoiled.`);
  } else if (type === 'injury') {
    const member = randomLivingMember();
    if (!member) return;
    const loss = randomInt(7, 15);
    member.hp = clamp(member.hp - loss, 0, 100);
    title = `${member.name} was injured`;
    body = `A trail accident cost ${escapeHtml(member.name)} ${loss} health.`;
    logEntry(`${member.name} was injured.`);
    if (member.hp <= 0) killMember(member, 'a trail accident');
  } else if (type === 'oxen') {
    const loss = randomInt(7, 14);
    state.oxCondition = clamp(state.oxCondition - loss, 0, 100);
    title = 'The oxen are struggling';
    body = `One animal came up lame. Ox condition fell by ${loss}%.`;
    logEntry(`The oxen lost ${loss}% condition.`);
  } else {
    if (state.inventory.ammo > 15 && rng() < 0.5) {
      const loss = Math.min(state.inventory.ammo, randomInt(8, 20));
      state.inventory.ammo -= loss;
      body = `${loss} rounds of ammunition disappeared during the night.`;
      logEntry(`${loss} rounds were stolen.`);
    } else {
      const loss = Math.min(state.inventory.food, randomInt(10, 25));
      state.inventory.food -= loss;
      body = `${Math.round(loss)} lb of food disappeared during the night.`;
      logEntry(`${Math.round(loss)} lb of food was stolen.`);
    }
    title = 'Supplies missing';
  }
  sound.bad?.play();
  renderGame();
  saveGame();
  showModal('TRAIL EVENT', title, body, [{ label: 'Continue', onClick: closeModal }]);
}

function triggerOpportunity() {
  const type = pick(['food', 'money', 'weather', 'repair']);
  let title = 'A fortunate break';
  let body = '';
  if (type === 'food') {
    const gain = randomInt(15, 35);
    state.inventory.food += gain;
    body = `The party found edible plants and usable provisions worth ${gain} lb of food.`;
    logEntry(`Found ${gain} lb of food.`);
  } else if (type === 'money') {
    const gain = randomInt(8, 22);
    state.money += gain;
    body = `A favorable trade with another wagon party added ${money(gain)} to your reserve.`;
    logEntry(`Made ${money(gain)} in a favorable trade.`);
  } else if (type === 'weather') {
    for (const member of aliveParty()) member.hp = clamp(member.hp + 2, 0, 100);
    body = 'A mild day and an easy stretch of road gives everyone a little strength back.';
    logEntry('A calm day restored the party.');
  } else {
    const gain = randomInt(4, 9);
    state.wagonCondition = clamp(state.wagonCondition + gain, 0, 100);
    body = `A helpful traveler spots a loose fitting and improves the wagon by ${gain}%.`;
    logEntry(`A traveler helped repair the wagon by ${gain}%.`);
  }
  sound.good?.play();
  renderGame();
  saveGame();
  showModal('GOOD FORTUNE', title, body, [{ label: 'Continue', onClick: closeModal }]);
}

function killMember(member, cause) {
  if (!member.alive) return;
  member.alive = false;
  member.hp = 0;
  member.statuses = [];
  logEntry(`${member.name} died from ${cause}.`);
}

async function restDay() {
  if (!state || state.ended) return;
  advanceDateOnly({ resting: true });
  for (const member of aliveParty()) member.hp = clamp(member.hp + 1, 0, 100);
  state.oxCondition = clamp(state.oxCondition + 1.5, 0, 100);
  logEntry('The party rested for one day.');
  await saveGame();
  renderGame();
  sound.good?.play();
  showModal('CAMP', 'A day of rest', 'The wagon did not move. Food was consumed, but the party and oxen recovered some strength.', [{ label: 'Break camp', onClick: closeModal }]);
}

async function huntDay() {
  if (state.inventory.ammo < 5) return showInfo('Not enough ammunition', 'You need at least 5 rounds to make a serious hunting attempt.');
  const ammoUsed = Math.min(state.inventory.ammo, randomInt(currentProfession().huntBonus ? 4 : 6, currentProfession().huntBonus ? 8 : 11));
  state.inventory.ammo -= ammoUsed;
  advanceDateOnly();
  const regionBonus = currentRegion() === 'Plains' ? 10 : currentRegion() === 'Mountains' ? -6 : 0;
  const weatherPenalty = ['Storm', 'Snow'].includes(state.weather) ? -15 : 0;
  const score = 40 + (currentProfession().huntBonus || 0) + regionBonus + weatherPenalty + randomInt(0, 40);
  let food = 0;
  if (score >= 90) food = randomInt(100, 120);
  else if (score >= 60) food = randomInt(55, 95);
  else if (score >= 30) food = randomInt(20, 48);
  state.inventory.food += food;
  logEntry(`Hunted for a day: used ${ammoUsed} rounds and brought back ${food} lb of food.`);
  await saveGame();
  renderGame();
  const className = food >= 55 ? 'result-good' : food === 0 ? 'result-bad' : '';
  showModal('HUNT', food ? 'The hunt brought food' : 'The hunt failed', `<p class="${className}">${food ? `+${food} lb food` : 'No usable game found'}</p><p>${ammoUsed} rounds used. One day passed.</p>`, [{ label: 'Return to the wagon', onClick: closeModal }], true);
}

async function repairDay() {
  const partKeys = ['wheelParts', 'axleParts', 'tongueParts'];
  const available = partKeys.find((key) => state.inventory[key] > 0);
  const professionBonus = currentProfession().repairBonus || 0;
  let gain;
  let partText;
  if (available) {
    state.inventory[available] -= 1;
    gain = randomInt(14, 22) + professionBonus;
    partText = `A spare ${available === 'wheelParts' ? 'wheel' : available === 'axleParts' ? 'axle' : 'tongue'} was used.`;
  } else {
    gain = randomInt(4, 9) + Math.round(professionBonus / 2);
    partText = 'No spare part was available, so the repair was improvised.';
  }
  advanceDateOnly();
  state.wagonCondition = clamp(state.wagonCondition + gain, 0, 100);
  logEntry(`Spent a day repairing the wagon (+${gain}% condition).`);
  await saveGame();
  renderGame();
  showModal('REPAIR', 'The wagon is patched', `${partText}<br><br>Wagon condition improved by <strong>${gain}%</strong>.`, [{ label: 'Continue', onClick: closeModal }], true);
}

function changePace() {
  showModal('TRAVEL POLICY', 'Choose a pace', 'Faster travel gains distance but harms people, oxen, and the wagon.', Object.keys(PACE).map((pace) => ({
    label: `${pace}${state.pace === pace ? ' — current' : ''}`,
    onClick: async () => { state.pace = pace; logEntry(`Pace changed to ${pace}.`); await saveGame(); renderGame(); closeModal(); },
  })));
}

function changeRations() {
  showModal('FOOD POLICY', 'Choose daily rations', 'Filling meals protect health. Cutting rations preserves food but weakens the party.', Object.keys(RATIONS).map((ration) => ({
    label: `${ration}${state.rations === ration ? ' — current' : ''}`,
    onClick: async () => { state.rations = ration; logEntry(`Rations changed to ${ration}.`); await saveGame(); renderGame(); closeModal(); },
  })));
}

function showMap() {
  const rows = LANDMARKS.map((landmark) => {
    const passed = state.distance >= landmark.distance;
    const current = Math.abs(state.distance - landmark.distance) < 0.1;
    return `<li class="${current ? 'current' : ''}">${passed ? '●' : '○'} ${escapeHtml(landmark.name)} — ${landmark.distance} mi${landmark.river ? ' · river' : ''}</li>`;
  }).join('');
  showModal('ROUTE', 'Trail map', `<p>You have traveled <strong>${Math.round(state.distance)} miles</strong>. ${Math.max(0, TOTAL_DISTANCE - Math.round(state.distance))} remain.</p><ul class="map-list">${rows}</ul>`, [{ label: 'Back to trail', onClick: closeModal }], true);
}

function showJournal() {
  const rows = [...state.journal].reverse().slice(0, 40).map((entry) => `<li><strong>${formatDate(entry.date)}</strong><br>${escapeHtml(entry.text)}</li>`).join('');
  showModal('RUN HISTORY', 'Trail journal', `<ul class="journal-list">${rows}</ul>`, [{ label: 'Back to trail', onClick: closeModal }], true);
}

function showLandmark(landmark) {
  state.visited.push(landmark.name);
  logEntry(`Reached ${landmark.name}.`);
  const choices = [{ label: 'Continue on the trail', onClick: async () => { await saveGame(); closeModal(); } }];
  if (landmark.fort) {
    choices.unshift({
      label: 'Buy 75 lb food for $65',
      disabled: state.money < 65,
      onClick: async () => {
        if (state.money >= 65) {
          state.money -= 65;
          state.inventory.food += 75;
          logEntry(`Bought 75 lb of food at ${landmark.name}.`);
          await saveGame(); renderGame();
        }
        closeModal();
      },
    });
    choices.unshift({
      label: 'Buy one medicine dose for $35',
      disabled: state.money < 35,
      onClick: async () => {
        if (state.money >= 35) {
          state.money -= 35;
          state.inventory.medicine += 1;
          logEntry(`Bought medicine at ${landmark.name}.`);
          await saveGame(); renderGame();
        }
        closeModal();
      },
    });
  }
  showModal('LANDMARK', landmark.name, `<p>The party reaches <strong>${escapeHtml(landmark.name)}</strong> after ${Math.round(state.distance)} miles.</p><p>${landmark.fort ? 'Supplies are available, but trail prices are higher than they were in Independence.' : 'The familiar landmark confirms that the wagon is still moving west.'}</p>`, choices, true);
}

function riverRisk(landmark, method) {
  const river = landmark.river;
  const depthScore = river.depth * 12;
  const currentScore = river.current * 8;
  const wagonPenalty = state.wagonCondition < 50 ? 8 : 0;
  const oxPenalty = state.oxCondition < 50 ? 6 : 0;
  const weatherPenalty = ['Rain', 'Storm'].includes(state.weather) ? 10 : 0;
  if (method === 'ford') return depthScore + currentScore + wagonPenalty + oxPenalty + weatherPenalty;
  if (method === 'float') return currentScore * 1.15 + wagonPenalty + weatherPenalty + Math.max(0, river.depth - 3) * 4;
  return 8;
}

function showRiverCrossing(landmark) {
  const river = landmark.river;
  const stats = `<div class="stat-grid"><div><span>Width</span><strong>${river.width} ft</strong></div><div><span>Depth</span><strong>${river.depth.toFixed(1)} ft</strong></div><div><span>Current</span><strong>${['', 'calm', 'moderate', 'strong', 'dangerous', 'violent'][river.current]}</strong></div></div>`;
  showModal('RIVER CROSSING', landmark.name, `${stats}<p>Choose between cost, delay, and risk. Current weather: <strong>${state.weather}</strong>.</p>`, [
    { label: 'Ford the river — free, highest depth risk', onClick: () => resolveRiver(landmark, 'ford') },
    { label: 'Caulk and float — free, current matters most', onClick: () => resolveRiver(landmark, 'float') },
    { label: 'Take the ferry — $45, safest', disabled: state.money < 45, onClick: () => resolveRiver(landmark, 'ferry') },
    { label: 'Wait one day — conditions may change', onClick: async () => { advanceDateOnly({ resting: true }); logEntry(`Waited one day at ${landmark.name}.`); await saveGame(); renderGame(); closeModal(); showRiverCrossing(landmark); } },
  ], true);
}

async function resolveRiver(landmark, method) {
  let risk = riverRisk(landmark, method);
  if (method === 'ferry') {
    state.money -= 45;
    risk = 6;
  }
  const roll = randomInt(0, 20);
  const outcome = risk + roll;
  let message;
  let bad = false;

  if (outcome < 35) {
    message = 'The wagon reaches the opposite bank safely.';
  } else if (outcome < 52) {
    const foodLoss = Math.min(state.inventory.food, randomInt(12, 35));
    state.inventory.food -= foodLoss;
    state.wagonCondition = clamp(state.wagonCondition - randomInt(2, 7), 0, 100);
    message = `The crossing was rough. ${Math.round(foodLoss)} lb of food was soaked or lost.`;
    bad = true;
  } else if (outcome < 70) {
    const foodLoss = Math.min(state.inventory.food, randomInt(35, 70));
    state.inventory.food -= foodLoss;
    state.wagonCondition = clamp(state.wagonCondition - randomInt(8, 16), 0, 100);
    const member = randomLivingMember();
    if (member) member.hp = clamp(member.hp - randomInt(8, 18), 0, 100);
    message = `The wagon nearly overturned. ${Math.round(foodLoss)} lb of food was lost and the party took injuries.`;
    bad = true;
  } else {
    const foodLoss = Math.min(state.inventory.food, randomInt(60, 120));
    state.inventory.food -= foodLoss;
    state.wagonCondition = clamp(state.wagonCondition - randomInt(15, 28), 0, 100);
    if (state.inventory.oxen > 2 && rng() < 0.55) state.inventory.oxen -= 1;
    const member = randomLivingMember();
    if (member && rng() < 0.28) killMember(member, `an accident crossing ${landmark.name}`);
    message = `The crossing became a disaster. Supplies were swept away, the wagon was damaged, and lives were at risk.`;
    bad = true;
  }

  if (!state.visited.includes(landmark.name)) state.visited.push(landmark.name);
  logEntry(`${method === 'ferry' ? 'Took the ferry' : method === 'ford' ? 'Forded' : 'Floated across'} ${landmark.name}. ${bad ? 'The crossing caused losses.' : 'Crossed safely.'}`);
  await saveGame();
  renderGame();
  bad ? sound.bad?.play() : sound.good?.play();
  showModal('CROSSING RESULT', bad ? 'The river took its price' : 'Across safely', `<p class="${bad ? 'result-bad' : 'result-good'}">${message}</p>`, [{ label: 'Continue west', onClick: closeModal }], true);
}

function useMedicine(member) {
  if (state.inventory.medicine <= 0 || !member.alive) return false;
  state.inventory.medicine -= 1;
  member.hp = clamp(member.hp + 6, 0, 100);
  member.statuses = member.statuses.map((status) => ({ ...status, days: Math.max(1, status.days - 2) }));
  logEntry(`Used medicine on ${member.name}.`);
  return true;
}

function showInfo(title, body) {
  showModal('FRONTIER JOURNEY', title, body, [{ label: 'OK', onClick: closeModal }]);
}

function showModal(eyebrow, title, body, choices = [], rawHtml = false) {
  const modal = $('#modal');
  $('#modalEyebrow').textContent = eyebrow;
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = rawHtml ? body : `<p>${body}</p>`;
  const container = $('#modalChoices');
  container.innerHTML = '';
  for (const choice of choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `button ${choice.primary ? 'primary' : ''}`;
    button.textContent = choice.label;
    button.disabled = Boolean(choice.disabled);
    button.addEventListener('click', choice.onClick);
    container.appendChild(button);
  }
  if (!modal.open) modal.showModal();
}

function closeModal() {
  if ($('#modal').open) $('#modal').close();
  renderGame();
}

function logEntry(text) {
  state.journal.push({ date: state.date, text });
  if (state.journal.length > 180) state.journal.shift();
}

async function endRun(success, reason) {
  state.ended = true;
  const survivors = aliveParty().length;
  const profession = currentProfession();
  const scoreBase = survivors * 150 + state.money / 5 + state.inventory.food / 4 + state.inventory.medicine * 15 + Math.max(0, state.inventory.oxen) * 30;
  const score = Math.round(scoreBase * profession.scoreMultiplier);
  logEntry(success ? 'Reached the Willamette Valley.' : `Journey ended: ${reason}`);
  await saveGame();
  renderGame();
  success ? sound.good?.play() : sound.bad?.play();
  const dead = state.party.filter((member) => !member.alive).map((member) => member.name);
  showModal(success ? 'JOURNEY COMPLETE' : 'RUN ENDED', success ? 'You reached the valley' : 'The trail won this time', `
    <p>${escapeHtml(reason)}</p>
    <div class="stat-grid">
      <div><span>Survivors</span><strong>${survivors}/5</strong></div>
      <div><span>Arrival</span><strong>${formatDate(state.date)}</strong></div>
      <div><span>Score</span><strong>${score.toLocaleString()}</strong></div>
    </div>
    <p>${dead.length ? `Lost on the trail: <strong>${dead.map(escapeHtml).join(', ')}</strong>.` : 'Every member of the party survived.'}</p>
  `, [
    { label: 'Review journal', onClick: () => { closeModal(); showJournal(); } },
    { label: 'Start a new run', onClick: async () => { closeModal(); await clearRun(); } },
  ], true);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function bindActions() {
  $('#startButton').addEventListener('click', startNewRun);
  $('#randomSeedButton').addEventListener('click', () => { $('#seedInput').value = randomSeedText(); });
  $('#resumeButton').addEventListener('click', resumeGame);
  $('#newRunButton').addEventListener('click', () => {
    showModal('NEW RUN', 'Abandon the current journey?', 'Your current saved run will be removed.', [
      { label: 'Keep current run', onClick: closeModal },
      { label: 'Abandon and start over', onClick: async () => { closeModal(); await clearRun(); } },
    ]);
  });

  $$('.action-button').forEach((button) => button.addEventListener('click', () => {
    sound.click?.play();
    const action = button.dataset.action;
    if (action === 'continue') continueTravel();
    if (action === 'rest') restDay();
    if (action === 'hunt') huntDay();
    if (action === 'repair') repairDay();
    if (action === 'pace') changePace();
    if (action === 'rations') changeRations();
    if (action === 'map') showMap();
    if (action === 'journal') showJournal();
  }));
}

async function boot() {
  renderSetup();
  bindActions();
  initSound();
  await initPixi();
  const save = await db.saves.get(SAVE_ID);
  if (save?.state) $('#resumeButton').classList.remove('hidden');
}

boot().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML('afterbegin', `<div class="warning" style="margin:12px">Frontier Journey failed to start: ${escapeHtml(error.message)}</div>`);
});
