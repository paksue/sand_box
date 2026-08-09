import { PaintedOx } from './painted-ox.js';
import { WeightedPaintedPairRig } from './weighted-ox-rig.js';

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
};

const integrations = {
  colorMatch: document.querySelector('#colorMatch'),
  atmosphere: document.querySelector('#atmosphere'),
  shadow: document.querySelector('#contactShadow'),
  dust: document.querySelector('#dust'),
  grain: document.querySelector('#grain'),
};

const app = new PIXI.Application();
await app.init({
  resizeTo: mountEl,
  backgroundAlpha: 0,
  antialias: true,
  autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
});
mountEl.appendChild(app.canvas);

const baseline = await new PaintedOx().init();
const rig = await new WeightedPaintedPairRig().init();
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
rendererCaption.textContent = `PixiJS · ${backend} · weighted painterly pair`;

function currentIntegrationState() {
  return {
    colorMatch: integrations.colorMatch.checked,
    atmosphere: integrations.atmosphere.checked,
    shadow: integrations.shadow.checked,
    dust: integrations.dust.checked,
  };
}

function layout() {
  // Identical composition for both methods. The only thing being compared is
  // deformation architecture, not placement or source art. The Y position is
  // intentionally grounded on the visible trail instead of hovering over the
  // background wagon, which made earlier QA impossible to judge fairly.
  const targetWidth = app.screen.width * (0.27 - state.depth * 0.025);
  const scale = targetWidth / 800;
  const x = app.screen.width * (0.61 - state.depth * 0.008);
  const y = app.screen.height * (0.815 - state.depth * 0.010);
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
    rigMetric.textContent = '1 pair sprite · weighted 19×13 mesh';
    rendererCaption.textContent = `PixiJS · ${backend} · Spine-style weighted pair rig`;
  } else {
    rigMetric.textContent = '1 pair sprite · whole-mesh 11×7 deformation';
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

  rig.setDebugSkeleton(false);
  baseline.setDebugMesh(false);

  if (state.view === 'neutral') {
    modeCaption.textContent = 'Original painted two-ox sprite on neutral gray';
    rig.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
    baseline.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
  } else if (state.view === 'skeleton') {
    modeCaption.textContent = state.mode === 'weighted' ? 'Virtual weighted-bone fields on the painted pair' : 'Whole-mesh deformation grid';
    rig.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
    baseline.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
    if (state.mode === 'weighted') rig.setDebugSkeleton(true);
    else baseline.setDebugMesh(true);
  } else {
    modeCaption.textContent = state.mode === 'weighted' ? 'Weighted painted pair in scene' : 'Whole-mesh baseline in scene';
    const integration = currentIntegrationState();
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

window.__weightedRigLab = { app, rig, baseline, state };
