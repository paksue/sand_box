import {
  RATIONALES,
  DISTINCTIONS,
  createInitialState,
  recordDecision,
  createPrincipleFromRationale,
  activeRule,
  predictChoice,
  judgeAgainstPrediction,
  recordDistinction,
  getMutation,
  serializeState,
  deserializeState,
} from './core.mjs';

const PhaserRef = window.Phaser;
if (!PhaserRef) throw new Error('Phaser failed to load.');

const SAVE_KEY = 'the-rule:m1';
const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const dom = {
  shell: document.querySelector('#game-shell'),
  intro: document.querySelector('#intro'),
  begin: document.querySelector('#begin-button'),
  continue: document.querySelector('#continue-button'),
  reset: document.querySelector('#reset-button'),
  sound: document.querySelector('#sound-toggle'),
  story: document.querySelector('#story-panel'),
  eyebrow: document.querySelector('#eyebrow'),
  title: document.querySelector('#story-title'),
  body: document.querySelector('#story-body'),
  choices: document.querySelector('#choice-dock'),
  rulebook: document.querySelector('#rulebook'),
  rulebookContent: document.querySelector('#rulebook-content'),
  comparison: document.querySelector('#comparison'),
  status: document.querySelector('#status'),
};

class AudioDirector {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensure() {
    if (this.muted) return null;
    if (!this.context) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return null;
      this.context = new Context();
    }
    if (this.context.state === 'suspended') this.context.resume();
    return this.context;
  }

  tone(freq, duration = 0.15, type = 'sine', gainValue = 0.045, delay = 0) {
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  clack() {
    this.tone(115, 0.08, 'square', 0.07);
    this.tone(820, 0.045, 'triangle', 0.035, 0.015);
  }

  impact() {
    this.tone(58, 0.55, 'sine', 0.09);
    this.tone(116, 0.23, 'triangle', 0.03, 0.015);
  }

  reveal() {
    this.tone(196, 0.22, 'sine', 0.025);
    this.tone(293.66, 0.28, 'sine', 0.025, 0.07);
  }

  tension() {
    this.tone(73, 0.42, 'sine', 0.018);
  }
}

const audio = new AudioDirector();

class CinematicScene extends PhaserRef.Scene {
  constructor() {
    super('cinematic');
    this.world = null;
    this.train = null;
    this.peopleMain = null;
    this.personSide = null;
    this.bridgeMan = null;
    this.lever = null;
    this.mainY = 0;
    this.sideY = 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#090909');
    this.world = this.add.container(0, 0);
    this.drawAtmosphere();
    this.scale.on('resize', () => this.redrawCurrent?.());
    this.sceneReady = true;
  }

  dimensions() {
    return { w: this.scale.width, h: this.scale.height };
  }

  clearWorld() {
    this.tweens.killAll();
    this.world.removeAll(true);
    this.train = null;
    this.peopleMain = null;
    this.personSide = null;
    this.bridgeMan = null;
    this.lever = null;
  }

  drawAtmosphere() {
    this.clearWorld();
    const { w, h } = this.dimensions();
    const g = this.add.graphics();
    g.fillStyle(0x090909, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0x342d27, 0.16);
    g.fillCircle(w * 0.72, h * 0.3, Math.max(w, h) * 0.32);
    this.world.add(g);
    this.redrawCurrent = () => this.drawAtmosphere();
  }

  drawTrack(y, startX = 0, endX = null, alpha = 0.7) {
    const { w } = this.dimensions();
    const end = endX ?? w;
    const g = this.add.graphics();
    g.lineStyle(3, 0xb7aea2, alpha);
    g.lineBetween(startX, y - 12, end, y - 12);
    g.lineBetween(startX, y + 12, end, y + 12);
    g.lineStyle(1, 0x6e675f, alpha * 0.72);
    for (let x = startX; x < end; x += 32) g.lineBetween(x, y - 24, x + 4, y + 24);
    this.world.add(g);
    return g;
  }

  createPerson(x, y, scale = 1, color = 0xe8dfd2) {
    const c = this.add.container(x, y);
    const body = this.add.rectangle(0, 3 * scale, 14 * scale, 34 * scale, color, 0.94);
    const head = this.add.circle(0, -20 * scale, 7 * scale, color, 0.94);
    c.add([body, head]);
    this.world.add(c);
    return c;
  }

  createPeopleGroup(x, y, count = 5) {
    const group = this.add.container(0, 0);
    const offsets = [-40, -20, 0, 20, 40];
    for (let i = 0; i < count; i += 1) {
      const c = this.add.container(x + offsets[i], y);
      const body = this.add.rectangle(0, 0, 10, 27, 0xe8dfd2, 0.94);
      const head = this.add.circle(0, -19, 5.5, 0xe8dfd2, 0.94);
      c.add([body, head]);
      group.add(c);
    }
    this.world.add(group);
    return group;
  }

  createTrain(x, y) {
    const train = this.add.container(x, y);
    const shadow = this.add.rectangle(-4, 8, 122, 48, 0x000000, 0.42);
    const body = this.add.rectangle(0, 0, 118, 44, 0x282725, 1);
    const nose = this.add.triangle(70, 0, 0, -22, 0, 22, 42, 15, 0x282725, 1);
    const stripe = this.add.rectangle(-5, 4, 78, 3, 0xb64137, 0.9);
    const light = this.add.circle(61, -7, 6, 0xffe6b3, 0.95);
    const wheel1 = this.add.circle(-35, 25, 10, 0x080808, 1);
    const wheel2 = this.add.circle(30, 25, 10, 0x080808, 1);
    train.add([shadow, body, nose, stripe, light, wheel1, wheel2]);
    this.world.add(train);
    return train;
  }

  createLever(x, y) {
    const lever = this.add.container(x, y);
    const base = this.add.rectangle(0, 0, 34, 18, 0x45413c, 1);
    const handle = this.add.rectangle(0, -34, 7, 68, 0xc9c0b4, 1).setOrigin(0.5, 1);
    const knob = this.add.circle(0, -69, 10, 0xb74137, 1);
    lever.add([base, handle, knob]);
    this.world.add(lever);
    return lever;
  }

  drawTrolley() {
    this.clearWorld();
    const { w, h } = this.dimensions();
    this.mainY = h * 0.63;
    this.sideY = Math.min(h * 0.82, this.mainY + 135);

    const bg = this.add.graphics();
    bg.fillStyle(0x090909, 1);
    bg.fillRect(0, 0, w, h);
    bg.fillStyle(0x4b4036, 0.18);
    bg.fillCircle(w * 0.76, h * 0.38, Math.max(w, h) * 0.28);
    this.world.add(bg);

    this.drawTrack(this.mainY);
    const branch = this.add.graphics();
    branch.lineStyle(3, 0xb7aea2, 0.62);
    branch.beginPath();
    branch.moveTo(w * 0.43, this.mainY + 12);
    branch.lineTo(w * 0.62, this.sideY - 12);
    branch.lineTo(w, this.sideY - 12);
    branch.moveTo(w * 0.43, this.mainY + 36);
    branch.lineTo(w * 0.62, this.sideY + 12);
    branch.lineTo(w, this.sideY + 12);
    branch.strokePath();
    this.world.add(branch);

    this.peopleMain = this.createPeopleGroup(w * 0.82, this.mainY - 40, 5);
    this.personSide = this.createPerson(w * 0.79, this.sideY - 42, 1.05);
    this.train = this.createTrain(Math.max(90, w * 0.08), this.mainY - 27);
    this.lever = this.createLever(w * 0.39, this.mainY - 95);

    const switchMark = this.add.circle(w * 0.44, this.mainY, 7, 0xb74137, 0.9);
    this.world.add(switchMark);

    this.redrawCurrent = () => this.drawTrolley();
  }

  sparkBurst(x, y) {
    const count = reducedMotion ? 4 : 16;
    for (let i = 0; i < count; i += 1) {
      const spark = this.add.circle(x, y, 2 + Math.random() * 2.5, 0xf4c06b, 0.95);
      this.world.add(spark);
      this.tweens.add({
        targets: spark,
        x: x + (Math.random() - 0.25) * 130,
        y: y + (Math.random() - 0.5) * 80,
        alpha: 0,
        scale: 0.2,
        duration: 300 + Math.random() * 350,
        ease: 'Quad.easeOut',
        onComplete: () => spark.destroy(),
      });
    }
  }

  animateTrolley(choice) {
    return new Promise((resolve) => {
      const { w } = this.dimensions();
      if (choice === 'pull' && this.lever) {
        this.tweens.add({ targets: this.lever, angle: 38, duration: reducedMotion ? 40 : 180, ease: 'Back.easeOut' });
        this.sparkBurst(w * 0.44, this.mainY);
      }

      const targetY = choice === 'pull' ? this.sideY - 27 : this.mainY - 27;
      const duration = reducedMotion ? 650 : 2300;
      this.tweens.add({
        targets: this.train,
        x: w * 0.9,
        y: targetY,
        duration,
        ease: 'Quad.easeIn',
        onComplete: () => {
          if (!reducedMotion) this.cameras.main.shake(170, 0.004);
          const victims = choice === 'pull' ? this.personSide : this.peopleMain;
          this.tweens.add({
            targets: victims,
            alpha: 0,
            duration: reducedMotion ? 40 : 180,
            onComplete: resolve,
          });
        },
      });
    });
  }

  drawBridge() {
    this.clearWorld();
    const { w, h } = this.dimensions();
    this.mainY = h * 0.73;
    const bridgeY = h * 0.37;

    const bg = this.add.graphics();
    bg.fillStyle(0x070808, 1);
    bg.fillRect(0, 0, w, h);
    bg.fillStyle(0x26313a, 0.17);
    bg.fillCircle(w * 0.63, h * 0.37, Math.max(w, h) * 0.28);
    this.world.add(bg);

    this.drawTrack(this.mainY);

    const bridge = this.add.graphics();
    bridge.lineStyle(7, 0x8d877e, 0.72);
    bridge.lineBetween(w * 0.22, bridgeY, w * 0.75, bridgeY);
    bridge.lineStyle(2, 0x615d57, 0.72);
    bridge.lineBetween(w * 0.25, bridgeY - 40, w * 0.25, bridgeY + 30);
    bridge.lineBetween(w * 0.72, bridgeY - 40, w * 0.72, bridgeY + 30);
    this.world.add(bridge);

    this.peopleMain = this.createPeopleGroup(w * 0.82, this.mainY - 40, 5);
    this.bridgeMan = this.createPerson(w * 0.57, bridgeY - 32, 1.55, 0xe6ddd0);
    this.train = this.createTrain(Math.max(90, w * 0.08), this.mainY - 27);

    const dropLine = this.add.graphics();
    dropLine.lineStyle(1, 0xb64137, 0.36);
    dropLine.lineBetween(w * 0.57, bridgeY + 6, w * 0.57, this.mainY - 30);
    this.world.add(dropLine);
    this.redrawCurrent = () => this.drawBridge();
  }

  animateBridge(choice) {
    return new Promise((resolve) => {
      const { w } = this.dimensions();
      const duration = reducedMotion ? 650 : 2100;

      const moveTrain = () => {
        this.tweens.add({
          targets: this.train,
          x: w * 0.88,
          duration,
          ease: 'Quad.easeIn',
          onComplete: () => {
            if (!reducedMotion) this.cameras.main.shake(170, 0.004);
            const victims = choice === 'push' ? this.bridgeMan : this.peopleMain;
            this.tweens.add({ targets: victims, alpha: 0, duration: reducedMotion ? 40 : 150, onComplete: resolve });
          },
        });
      };

      if (choice === 'push') {
        this.tweens.add({
          targets: this.bridgeMan,
          y: this.mainY - 54,
          angle: 32,
          duration: reducedMotion ? 120 : 520,
          ease: 'Quad.easeIn',
          onComplete: moveTrain,
        });
      } else {
        moveTrain();
      }
    });
  }

  drawMutation(id) {
    if (id === 'side_effect_switch') return this.drawSideEffect();
    if (id === 'volunteer_bridge') return this.drawVolunteer();
    return this.drawTrapdoor();
  }

  drawTrapdoor() {
    this.drawBridge();
    const { w, h } = this.dimensions();
    const bridgeY = h * 0.37;
    const button = this.add.circle(w * 0.34, bridgeY - 55, 18, 0xb64137, 1);
    const ring = this.add.circle(w * 0.34, bridgeY - 55, 28, 0xeee6d9, 0.15);
    this.world.add([ring, button]);
    if (!reducedMotion) {
      this.tweens.add({ targets: ring, scale: 1.45, alpha: 0, duration: 1200, repeat: -1, ease: 'Sine.easeOut' });
    }
    this.redrawCurrent = () => this.drawTrapdoor();
  }

  drawSideEffect() {
    this.drawTrolley();
    if (this.lever) this.lever.setVisible(false);
    this.redrawCurrent = () => this.drawSideEffect();
  }

  drawVolunteer() {
    this.drawBridge();
    if (this.bridgeMan) {
      const halo = this.add.circle(this.bridgeMan.x, this.bridgeMan.y - 10, 38, 0xd9d2c6, 0.08);
      this.world.add(halo);
    }
    this.redrawCurrent = () => this.drawVolunteer();
  }

  drawSurgeonTease() {
    this.clearWorld();
    const { w, h } = this.dimensions();
    const g = this.add.graphics();
    g.fillStyle(0x081012, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0xb5e8ec, 0.07);
    g.fillRect(w * 0.52, 0, w * 0.48, h);
    g.lineStyle(2, 0x95cdd1, 0.28);
    for (let i = 0; i < 5; i += 1) {
      const y = h * 0.28 + i * Math.min(70, h * 0.09);
      g.lineBetween(w * 0.62, y, w * 0.87, y);
      g.lineBetween(w * 0.62, y, w * 0.62, y + 22);
    }
    this.world.add(g);
    this.createPerson(w * 0.82, h * 0.68, 1.45, 0xe6f0ef);
    this.redrawCurrent = () => this.drawSurgeonTease();
  }
}

const phaser = new PhaserRef.Game({
  type: PhaserRef.WEBGL,
  parent: 'canvas-host',
  transparent: true,
  render: { antialias: true, roundPixels: false },
  scale: {
    mode: PhaserRef.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [CinematicScene],
});

let state = loadState();
let scene = null;
let scenePoll = window.setInterval(() => {
  const candidate = phaser.scene.getScene('cinematic');
  if (candidate?.sceneReady) {
    scene = candidate;
    window.clearInterval(scenePoll);
    scenePoll = null;
  }
}, 40);

function loadState() {
  try {
    return deserializeState(localStorage.getItem(SAVE_KEY));
  } catch {
    return createInitialState();
  }
}

function saveState() {
  try { localStorage.setItem(SAVE_KEY, serializeState(state)); } catch { /* storage can be unavailable */ }
}

function clearSavedState() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

function announce(message) {
  dom.status.textContent = message;
}

function setStory(eyebrow, title, body = '') {
  dom.eyebrow.textContent = eyebrow;
  dom.title.textContent = title;
  dom.body.textContent = body;
  dom.story.classList.remove('fade-in');
  void dom.story.offsetWidth;
  dom.story.classList.add('fade-in');
  announce([eyebrow, title, body].filter(Boolean).join('. '));
}

function clearChoices() {
  dom.choices.replaceChildren();
  dom.choices.classList.remove('is-list');
}

function setChoices(items, handler, list = false) {
  clearChoices();
  dom.choices.classList.toggle('is-list', list);
  for (const item of items) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `choice${item.danger ? ' danger' : ''}`;
    const strong = document.createElement('strong');
    strong.textContent = item.title;
    button.append(strong);
    if (item.detail) {
      const small = document.createElement('small');
      small.textContent = item.detail;
      button.append(small);
    }
    button.addEventListener('click', () => handler(item.id), { once: true });
    dom.choices.append(button);
  }
}

function setRulebook(predicting = false) {
  const rule = activeRule(state);
  if (!rule) {
    dom.rulebook.hidden = true;
    dom.rulebookContent.replaceChildren();
    return;
  }

  dom.rulebook.hidden = false;
  const card = document.createElement('div');
  card.className = `rule-card${predicting ? ' is-predicting' : ''}`;
  const label = document.createElement('span');
  label.textContent = 'RULE 01';
  const p = document.createElement('p');
  p.textContent = rule.statement;
  card.append(label, p);
  dom.rulebookContent.replaceChildren(card);
}

function waitForScene() {
  if (scene) return Promise.resolve(scene);
  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      if (scene) {
        window.clearInterval(timer);
        resolve(scene);
      }
    }, 30);
  });
}

function trolleyChoiceInState() {
  return state.decisions.find((d) => d.scenarioId === 'trolley_switch')?.choice ?? null;
}

function bridgeChoiceInState() {
  return state.decisions.find((d) => d.scenarioId === 'bridge')?.choice ?? null;
}

function hideIntro() {
  dom.intro.classList.add('is-hidden');
}

function showIntro() {
  dom.intro.classList.remove('is-hidden');
}

async function newRun() {
  audio.ensure();
  state = createInitialState();
  clearSavedState();
  setRulebook(false);
  dom.comparison.hidden = true;
  hideIntro();
  await showTrolleyCase();
}

async function showTrolleyCase() {
  await waitForScene();
  scene.drawTrolley();
  setRulebook(false);
  setStory('CASE 01 · THE LEVER', 'Five people are going to die.', 'The trolley has no brakes. You can divert it. One person stands on the side track.');
  setChoices([
    { id: 'pull', title: 'PULL THE LEVER', detail: 'Divert the trolley. One person dies.', danger: true },
    { id: 'stay', title: 'DO NOTHING', detail: 'Stay out of it. Five people die.' },
  ], handleTrolleyChoice);
}

async function handleTrolleyChoice(choice) {
  clearChoices();
  state = recordDecision(state, 'trolley_switch', choice);
  saveState();
  setStory('DECISION LOCKED', choice === 'pull' ? 'You intervened.' : 'You did nothing.', 'Watch what your choice does.');
  if (choice === 'pull') audio.clack(); else audio.tension();
  await scene.animateTrolley(choice);
  audio.impact();
  setStory('CONSEQUENCE', choice === 'pull' ? 'One person died. Five people lived.' : 'Five people died. One person lived.', 'Now tell me why.');
  setChoices([{ id: 'continue', title: 'WHY DID I CHOOSE THAT?' }], () => showRationales(choice));
}

function showRationales(choice = trolleyChoiceInState()) {
  const options = Object.entries(RATIONALES)
    .filter(([, rationale]) => rationale.appliesTo === choice)
    .map(([id, rationale]) => ({ id, title: rationale.label }));
  setStory('COMMIT YOUR REASON', 'Why?', 'Choose the reason closest to what actually drove your decision. “I don’t know” is allowed.');
  setChoices(options, handleRationale, true);
}

function handleRationale(rationaleId) {
  state = createPrincipleFromRationale(state, rationaleId);
  saveState();
  clearChoices();
  setRulebook(false);
  audio.reveal();
  setStory('RULE 01 CREATED', 'You have given me a rule.', 'A reason becomes interesting when it has to survive somewhere else.');
  setChoices([{ id: 'test', title: 'TEST THE RULE', danger: true }], () => showBridgeCase());
}

async function showBridgeCase() {
  await waitForScene();
  dom.comparison.hidden = true;
  scene.drawBridge();
  const prediction = predictChoice(state, 'bridge');
  setRulebook(true);
  audio.tension();
  const predictedWord = prediction?.choice === 'push' ? 'PUSH HIM' : 'REFUSE';
  setStory('CASE 02 · THE BRIDGE', `Your rule says: ${predictedWord}.`, 'One man beside you is heavy enough to stop the trolley if he falls onto the track. He will die. The five will live.');
  setChoices([
    { id: 'push', title: 'PUSH HIM', detail: 'One dies. Five live.', danger: true },
    { id: 'refuse', title: 'REFUSE', detail: 'Five die. He lives.' },
  ], handleBridgeChoice);
}

async function handleBridgeChoice(choice) {
  clearChoices();
  const result = judgeAgainstPrediction(state, 'bridge', choice);
  state = result.state;
  saveState();
  setRulebook(false);
  setStory('DECISION LOCKED', choice === 'push' ? 'You pushed him.' : 'You refused.', 'Watch what your choice does.');
  if (choice === 'push') audio.clack(); else audio.tension();
  await scene.animateBridge(choice);
  audio.impact();

  if (result.contradiction) {
    showContradiction();
  } else {
    showConsistency();
  }
}

function showContradiction() {
  setStory('', '', '');
  dom.story.style.visibility = 'hidden';
  dom.comparison.hidden = false;
  audio.reveal();
  const first = trolleyChoiceInState();
  const second = bridgeChoiceInState();
  const cards = dom.comparison.querySelectorAll('article b');
  cards[0].textContent = first === 'pull' ? 'YOU INTERVENED' : 'YOU REFUSED TO INTERVENE';
  cards[1].textContent = second === 'push' ? 'YOU INTERVENED' : 'YOU REFUSED';
  const comparisonText = dom.comparison.querySelector(':scope > p');
  comparisonText.textContent = 'Same arithmetic. Different answer.';
  setChoices([{ id: 'changed', title: 'WHAT CHANGED?', danger: true }], () => showDistinctions());
}

function showDistinctions() {
  dom.comparison.hidden = true;
  dom.story.style.visibility = '';
  setStory('YOUR RULE IS MISSING SOMETHING', 'What changed?', 'Name the difference that mattered. I will remove or isolate it and ask you again.');
  const items = Object.entries(DISTINCTIONS).map(([id, distinction]) => ({ id, title: distinction.label }));
  setChoices(items, handleDistinction, true);
}

async function handleDistinction(id) {
  state = recordDistinction(state, id);
  saveState();
  clearChoices();
  const mutation = getMutation(state);
  await waitForScene();
  scene.drawMutation(mutation.id);
  setRulebook(false);
  audio.reveal();
  setStory(mutation.eyebrow, mutation.title, mutation.body);
  setChoices([
    { id: 'act', title: mutation.primary, danger: true },
    { id: 'refuse', title: mutation.secondary },
  ], (choice) => finishMutation(choice));
}

function finishMutation(choice) {
  state = recordDecision(state, state.mutation, choice);
  saveState();
  clearChoices();
  const distinction = state.distinctions.at(-1);
  const changed = choice === 'act';
  setStory('THE TEST CONTINUES', changed ? 'You changed the mechanism. Did your rule change too?' : 'You refused again.', distinction ? `You said “${distinction.label}” mattered. The next case will test whether it really does.` : 'The next case will make the pressure worse.');
  setChoices([
    { id: 'next', title: 'END MILESTONE 1' },
    { id: 'restart', title: 'REPLAY FROM THE START' },
  ], (id) => {
    if (id === 'restart') newRun();
    else showMilestoneEnd();
  });
}

function showConsistency() {
  setRulebook(true);
  audio.reveal();
  setStory('NO CONTRADICTION', 'Consistent.', 'You followed your rule even when the mechanism became personal. So I need a harder case.');
  setChoices([{ id: 'harder', title: 'MAKE IT HARDER', danger: true }], () => showSurgeonTease());
}

async function showSurgeonTease() {
  await waitForScene();
  scene.drawSurgeonTease();
  const rule = activeRule(state);
  const prediction = predictChoice(state, 'surgeon');
  setRulebook(true);
  setStory('NEXT TEST · THE SURGEON', 'Five patients need five organs.', `One healthy person is in the next room. ${prediction?.choice === 'harvest' ? 'Your rule points toward killing one to save five.' : 'Your rule points toward refusing the sacrifice.'}`);
  setChoices([{ id: 'end', title: 'END MILESTONE 1' }], showMilestoneEnd);
}

function showMilestoneEnd() {
  clearChoices();
  setRulebook(false);
  setStory('MILESTONE 1 COMPLETE', 'You changed your answer. Change the rule too.', 'This is only the first pressure test. The full game will keep every rule, every exception and every unresolved conflict.');
  setChoices([{ id: 'restart', title: 'PLAY AGAIN' }], () => newRun());
}

async function resumeRun() {
  audio.ensure();
  hideIntro();
  const rule = activeRule(state);
  const trolley = trolleyChoiceInState();
  const bridge = bridgeChoiceInState();

  if (!trolley) return showTrolleyCase();
  if (!rule) {
    await waitForScene();
    scene.drawTrolley();
    return showRationales(trolley);
  }
  if (!bridge) return showBridgeCase();
  if (state.mutation) return handleResumeMutation();
  if (state.contradictions.length) {
    await waitForScene();
    scene.drawBridge();
    return showContradiction();
  }
  await waitForScene();
  scene.drawSurgeonTease();
  return showConsistency();
}

async function handleResumeMutation() {
  await waitForScene();
  const mutation = getMutation(state);
  scene.drawMutation(mutation.id);
  setRulebook(false);
  setStory(mutation.eyebrow, mutation.title, mutation.body);
  setChoices([
    { id: 'act', title: mutation.primary, danger: true },
    { id: 'refuse', title: mutation.secondary },
  ], (choice) => finishMutation(choice));
}

function resetGame() {
  state = createInitialState();
  clearSavedState();
  clearChoices();
  setRulebook(false);
  dom.comparison.hidden = true;
  dom.story.style.visibility = '';
  if (scene) scene.drawAtmosphere();
  showIntro();
  dom.continue.hidden = true;
}

dom.begin.addEventListener('click', newRun);
dom.continue.addEventListener('click', resumeRun);
dom.reset.addEventListener('click', resetGame);
dom.sound.addEventListener('click', () => {
  audio.muted = !audio.muted;
  dom.sound.setAttribute('aria-pressed', String(!audio.muted));
  dom.sound.textContent = audio.muted ? 'MUTED' : 'SOUND';
  dom.sound.setAttribute('aria-label', audio.muted ? 'Unmute sound' : 'Mute sound');
  if (!audio.muted) audio.reveal();
});

if (state.decisions.length || state.principles.length) {
  dom.continue.hidden = false;
}
