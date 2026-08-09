import { PaintedOx } from './painted-ox-v2.js';

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

const state = {
  playing: true,
  speed: 1,
  elapsed: 0,
  posePhase: 0,
  poseAccumulator: 0,
  poseFps: 15,
  view: 'scene',
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

const ox = await new PaintedOx().init();
app.stage.addChild(ox.root);
ox.setDepth(state.depth);
ox.setMotionStrength(state.motionStrength);

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
rendererCaption.textContent = `PixiJS · ${backend} · pre-matted oil-paint sprite`;

function layout() {
  ox.layout(app.screen.width, app.screen.height);
}
layout();
new ResizeObserver(layout).observe(mountEl);

function currentIntegrationState() {
  return {
    colorMatch: integrations.colorMatch.checked,
    atmosphere: integrations.atmosphere.checked,
    shadow: integrations.shadow.checked,
    dust: integrations.dust.checked,
  };
}

function applyViewMode() {
  stageEl.dataset.view = state.view;
  document.querySelectorAll('.view-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === state.view);
  });

  if (state.view === 'neutral') {
    modeCaption.textContent = 'Extracted painted sprite on neutral gray';
    ox.setDebugMesh(false);
    ox.setIntegration({ colorMatch: false, atmosphere: false, shadow: false, dust: false });
  } else if (state.view === 'mesh') {
    modeCaption.textContent = 'Deformation mesh inspection';
    ox.setIntegration(currentIntegrationState());
    ox.setDebugMesh(true);
  } else if (state.view === 'source') {
    modeCaption.textContent = 'Rosa Bonheur source painting · A Pair of Oxen';
    ox.setDebugMesh(false);
  } else {
    modeCaption.textContent = 'Scene integration';
    ox.setDebugMesh(false);
    ox.setIntegration(currentIntegrationState());
  }
}

function applyIntegration() {
  if (state.view !== 'neutral' && state.view !== 'source') {
    ox.setIntegration(currentIntegrationState());
  }
  canvasGrain.classList.toggle('off', !integrations.grain.checked);
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
  state.posePhase = 0;
  state.poseAccumulator = 0;
  ox.resetPose();
});

depthInput.addEventListener('input', () => {
  state.depth = Number(depthInput.value) / 100;
  depthOutput.textContent = `${depthInput.value}%`;
  ox.setDepth(state.depth);
  layout();
  applyIntegration();
});

motionInput.addEventListener('input', () => {
  state.motionStrength = Number(motionInput.value) / 100;
  motionOutput.textContent = `${motionInput.value}%`;
  ox.setMotionStrength(state.motionStrength);
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
  state.posePhase = state.elapsed * 2.15;

  const poseInterval = 1 / state.poseFps;
  if (state.poseAccumulator >= poseInterval) {
    state.poseAccumulator %= poseInterval;
    ox.updatePose(state.posePhase);
  }
  ox.updateContinuous(scaledDelta, state.posePhase);
});

applyViewMode();
applyIntegration();
window.__paintedSpriteLab = { app, ox, state };
