import { PaintedOx } from './painted-ox.js';
import { WeightedOxTeamRig } from './weighted-ox-rig.js';

const PIXI = window.PIXI;
const stageEl = document.querySelector('#stage');
const mountEl = document.querySelector('#pixiMount');
const canvasGrain = document.querySelector('#canvasGrain');
const modeCaption = document.querySelector('#modeCaption');
const rendererCaption = document.querySelector('#rendererCaption');
const rendererMetric = document.querySelector('#rendererMetric');
const fpsMetric = document.querySelector('#fpsMetric');
const playPause = document.querySelector('#playPause');
const depthInput = document.querySelector('#depth');
const depthOutput = document.querySelector('#depthOutput');
const motionInput = document.querySelector('#motionStrength');
const motionOutput = document.querySelector('#motionOutput');
const phaseInput = document.querySelector('#phaseOffset');
const phaseOutput = document.querySelector('#phaseOutput');
const rigMetric = document.querySelector('#rigMetric');

const state = {
  playing: true,
  speed: 1,
  elapsed: 0,
  poseAccumulator: 0,
  poseFps: 15,
  view: 'scene',
  mode: 'weighted',
  depth: Number(depthInput.value) / 100,
  motionStrength: Number(motionInput.value) / 100,
  phaseFraction: Number(phaseInput.value) / 100,
};

const integrations = {
  colorMatch: document.querySelector('#colorMatch'),
  atmosphere: document.querySelector('#atmosphere'),
  shadow: document.querySelector('#contactShadow'),
  dust: document.querySelector('#dust'),
  grain: document.querySelector('#grain'),
};

class LegacyOxTeam {
  constructor() {
    this.root = new PIXI.Container();
    this.front = null;
    this.back = null;
    this.poseVersion = 0;
    this.phaseOffset = Math.PI * 0.20;
    this.depth = 0.42;
    this.motionStrength = 0.55;
    this.ready = false;
  }

  async init() {
    this.back = await new PaintedOx().init();
    this.front = await new PaintedOx().init();
    this.back.root.position.set(-58, -26);
    this.back.root.scale.set(0.94);
    this.front.root.position.set(54, 28);
    this.root.addChild(this.back.root, this.front.root);
    this.root.pivot.set(0, 0);
    this.ready = true;
    return this;
  }

  setDepth(value) {
    this.depth = value;
    this.back.setDepth(value);
    this.front.setDepth(value);
  }

  setMotionStrength(value) {
    this.motionStrength = value;
    this.front.setMotionStrength(value);
    this.back.setMotionStrength(value * 0.93);
  }

  setPhaseOffset(radians) {
    this.phaseOffset = radians;
  }

  setIntegration(options) {
    this.front.setIntegration(options);
    this.back.setIntegration(options);
  }

  setDebug(enabled) {
    this.front.setDebugMesh(enabled);
    this.back.setDebugMesh(enabled);
  }

  resetPose() {
    this.updatePose(0);
  }

  updatePose(phase) {
    if (!this.ready) return;
    this.poseVersion += 1;
    this.front.updatePose(phase);
    this.back.updatePose(phase + this.phaseOffset);
  }

  updateContinuous(deltaSeconds, phase) {
    if (!this.ready) return;
    this.front.updateContinuous(deltaSeconds, phase);
    this.back.updateContinuous(deltaSeconds, phase + this.phaseOffset);
  }
}

const app = new PIXI.Application();
await app.init({
  resizeTo: mountEl,
  backgroundAlpha: 0,
  antialias: true,
  autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
});
mountEl.appendChild(app.canvas);

const baseline = await new LegacyOxTeam().init();
const rig = await new WeightedOxTeamRig().init();

// The WeightedOxTeam class uses child-centered pivots. For this comparison page
// the team container itself must remain unpivoted; otherwise the team is offset
// upward a second time. Individual ox contact shadows remain active, so the
// broader prototype team shadow is deliberately disabled here.
rig.root.pivot.set(0, 0);
rig.backOx.root.position.set(-58, -26);
rig.backOx.root.scale.set(0.94);
rig.frontOx.root.position.set(54, 28);
rig.teamShadow.renderable = false;
rig.dustLayer.position.set(-430, -310);

app.stage.addChild(baseline.root, rig.root);
baseline.root.visible = false;

function rendererName() {
  const renderer = app.renderer;
  if (renderer?.gl) return 'WebGL';
  if (renderer?.gpu) return 'WebGPU';
  const raw = renderer?.constructor?.name || '';
  if (/webgpu/i.test(raw)) return 'WebGPU';
  if (/webgl/i.test(raw) || /gl/i.test(raw)) return 'WebGL';
  return 'GPU renderer';
}

const backend = rendererName();
rendererMetric.textContent = `PixiJS 8.19 · ${backend}`;
rendererCaption.textContent = `PixiJS · ${backend} · weighted painterly team`;

function activeActor() {
  return state.mode === 'weighted' ? rig : baseline;
}

function currentIntegrationState() {
  return {
    colorMatch: integrations.colorMatch.checked,
    atmosphere: integrations.atmosphere.checked,
    shadow: integrations.shadow.checked,
    dust: integrations.dust.checked,
  };
}

function layout() {
  // Both methods deliberately receive the exact same stage transform. The team
  // should read as a trail-scale subject inside the painting, not as a giant UI
  // demonstration object.
  const targetWidth = app.screen.width * (0.30 - state.depth * 0.035);
  const scale = targetWidth / 930;
  const x = app.screen.width * (0.61 - state.depth * 0.01);
  const y = app.screen.height * (0.735 - state.depth * 0.025);
  for (const actor of [rig, baseline]) {
    actor.root.scale.set(scale);
    actor.root.x = x;
    actor.root.y = y;
  }
}

function applyDepthAndMotion() {
  for (const actor of [rig, baseline]) {
    actor.setDepth(state.depth);
    actor.setMotionStrength(state.motionStrength);
    actor.setPhaseOffset(state.phaseFraction * Math.PI * 2);
  }
  layout();
}

function applyMode() {
  rig.root.visible = state.mode === 'weighted';
  baseline.root.visible = state.mode === 'baseline';
  document.querySelectorAll('.mode-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === state.mode);
  });

  if (state.mode === 'weighted') {
    rigMetric.textContent = '2 skeletons · weighted 17×11 meshes';
    rendererCaption.textContent = `PixiJS · ${backend} · Spine-style weighted rig`;
  } else {
    rigMetric.textContent = '2 whole-sprite deformation meshes';
    rendererCaption.textContent = `PixiJS · ${backend} · whole-mesh baseline`;
  }
  applyViewMode();
}

function applyViewMode() {
  const neutralLike = state.view === 'neutral' || state.view === 'skeleton';
  stageEl.dataset.view = neutralLike ? 'neutral' : 'scene';
  document.querySelectorAll('.view-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === state.view);
  });

  const integration = currentIntegrationState();
  rig.setDebugSkeleton(false);
  baseline.setDebug(false);

  if (state.view === 'neutral') {
    modeCaption.textContent = 'Painted team on neutral gray';
    rig.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
    baseline.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
  } else if (state.view === 'skeleton') {
    modeCaption.textContent = state.mode === 'weighted' ? 'Weighted-bone rig inspection' : 'Baseline deformation-grid inspection';
    rig.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
    baseline.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
    if (state.mode === 'weighted') rig.setDebugSkeleton(true);
    else baseline.setDebug(true);
  } else {
    modeCaption.textContent = state.mode === 'weighted' ? 'Weighted rig in scene' : 'Whole-mesh baseline in scene';
    rig.setIntegration(integration);
    baseline.setIntegration(integration);
  }
}

function applyIntegration() {
  if (state.view === 'scene') {
    const integration = currentIntegrationState();
    rig.setIntegration(integration);
    baseline.setIntegration(integration);
  }
  canvasGrain.classList.toggle('off', !integrations.grain.checked);
}

layout();
new ResizeObserver(layout).observe(mountEl);
applyDepthAndMotion();
applyMode();
applyIntegration();

for (const button of document.querySelectorAll('.mode-button')) {
  button.addEventListener('click', () => {
    state.mode = button.dataset.mode;
    applyMode();
  });
}

for (const button of document.querySelectorAll('.view-button')) {
  button.addEventListener('click', () => {
    state.view = button.dataset.view;
    applyViewMode();
  });
}

for (const button of document.querySelectorAll('.speed-button')) {
  button.addEventListener('click', () => {
    state.speed = Number(button.dataset.speed);
    document.querySelectorAll('.speed-button').forEach((candidate) => {
      candidate.classList.toggle('active', candidate === button);
    });
  });
}

playPause.addEventListener('click', () => {
  state.playing = !state.playing;
  playPause.textContent = state.playing ? 'Pause' : 'Play';
});

document.querySelector('#resetPose').addEventListener('click', () => {
  state.elapsed = 0;
  state.poseAccumulator = 0;
  rig.resetPose();
  baseline.resetPose();
});

depthInput.addEventListener('input', () => {
  state.depth = Number(depthInput.value) / 100;
  depthOutput.textContent = `${depthInput.value}%`;
  applyDepthAndMotion();
  applyIntegration();
});

motionInput.addEventListener('input', () => {
  state.motionStrength = Number(motionInput.value) / 100;
  motionOutput.textContent = `${motionInput.value}%`;
  applyDepthAndMotion();
});

phaseInput.addEventListener('input', () => {
  state.phaseFraction = Number(phaseInput.value) / 100;
  phaseOutput.textContent = `${phaseInput.value}% cycle`;
  applyDepthAndMotion();
});

Object.values(integrations).forEach((input) => input.addEventListener('change', applyIntegration));

let fpsFrames = 0;
let fpsElapsed = 0;
app.ticker.maxFPS = 60;
app.ticker.add((ticker) => {
  const deltaSeconds = Math.min(ticker.elapsedMS / 1000, 0.05);
  fpsFrames += 1;
  fpsElapsed += deltaSeconds;
  if (fpsElapsed >= 0.75) {
    fpsMetric.textContent = `${Math.round(fpsFrames / fpsElapsed)} fps`;
    fpsFrames = 0;
    fpsElapsed = 0;
  }

  if (!state.playing) return;
  const scaledDelta = deltaSeconds * state.speed;
  state.elapsed += scaledDelta;
  state.poseAccumulator += scaledDelta;
  const phase = state.elapsed * 2.15;

  const poseInterval = 1 / state.poseFps;
  if (state.poseAccumulator >= poseInterval) {
    state.poseAccumulator %= poseInterval;
    rig.updatePose(phase);
    baseline.updatePose(phase);
  }
  rig.updateContinuous(scaledDelta, phase);
  baseline.updateContinuous(scaledDelta, phase);
});

window.__weightedRigLab = { app, rig, baseline, state, activeActor };
