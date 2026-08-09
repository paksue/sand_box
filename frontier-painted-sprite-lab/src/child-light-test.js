import { ChildLightOxRig } from './child-light-rig.js';

const PIXI = window.PIXI;
const stageEl = document.querySelector('#stage');
const mountEl = document.querySelector('#pixiMount');
const canvasGrain = document.querySelector('#canvasGrain');
const modeCaption = document.querySelector('#modeCaption');
const rendererCaption = document.querySelector('#rendererCaption');
const rendererMetric = document.querySelector('#rendererMetric');
const fpsMetric = document.querySelector('#fpsMetric');
const playPause = document.querySelector('#playPause');
const motionInput = document.querySelector('#motionStrength');
const motionOutput = document.querySelector('#motionOutput');
const scaleInput = document.querySelector('#actorScale');
const scaleOutput = document.querySelector('#scaleOutput');

const foregroundToggle = document.querySelector('#foreground');
const dustToggle = document.querySelector('#dust');
const grainToggle = document.querySelector('#grain');
const focusToggle = document.querySelector('#focus');

const state = {
  playing: true,
  speed: 1,
  elapsed: 0,
  travel: 'in-place',
  view: 'scene',
  motionStrength: Number(motionInput.value) / 100,
  actorScale: Number(scaleInput.value) / 100,
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

const backGrass = new PIXI.Graphics();
const frontGrass = new PIXI.Graphics();
const rig = await new ChildLightOxRig().init();
app.stage.addChild(backGrass, rig.root, frontGrass);

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
rendererCaption.textContent = `PixiJS · ${backend} · layered painted raster actor`;

function drawGrassLayer(graphics, foreground) {
  const w = app.screen.width;
  const h = app.screen.height;
  graphics.clear();
  const count = foreground ? 44 : 34;
  const yBase = h * (foreground ? 0.825 : 0.76);
  const spread = h * (foreground ? 0.13 : 0.085);
  for (let i = 0; i < count; i += 1) {
    const x = ((i * 137.3 + 41) % 997) / 997 * w;
    const seed = ((i * 53) % 101) / 101;
    const y = yBase + seed * spread;
    const height = (foreground ? 16 : 9) + ((i * 17) % 13);
    const lean = ((i % 5) - 2) * (foreground ? 2.5 : 1.5);
    graphics.moveTo(x, y).quadraticCurveTo(x + lean * .35, y - height * .55, x + lean, y - height);
    if (i % 2 === 0) {
      graphics.moveTo(x + 3, y + 1).quadraticCurveTo(x + 4 + lean * .25, y - height * .4, x + 7 + lean, y - height * .76);
    }
  }
  graphics.stroke({
    width: foreground ? 2.2 : 1.35,
    color: foreground ? 0x75603b : 0x967a49,
    alpha: foreground ? 0.56 : 0.34,
  });
}

function layoutScene() {
  rig.setActorScale(state.actorScale);
  rig.layout(app.screen.width, app.screen.height);
  drawGrassLayer(backGrass, false);
  drawGrassLayer(frontGrass, true);
  updateRootTravel();
}

function updateRootTravel() {
  const w = app.screen.width;
  if (state.travel === 'in-place') {
    // Keep the quality-test actor away from the prominent historical wagon in
    // the background so the silhouette and ground contact are easy to judge.
    rig.root.x = w * 0.66;
  } else {
    const progress = (state.elapsed * 0.12) % 1;
    rig.root.x = w * (0.82 - progress * 0.54);
  }
}

function applyView() {
  stageEl.dataset.view = state.view;
  document.querySelectorAll('.view-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === state.view);
  });
  const scene = state.view === 'scene';
  backGrass.visible = scene;
  frontGrass.visible = scene && foregroundToggle.checked;
  rig.setDebugRig(state.view === 'rig');
  rig.setHeroFocus(scene ? focusToggle.checked : false);
  rig.setDustEnabled(scene && dustToggle.checked);
  canvasGrain.classList.toggle('off', !grainToggle.checked || !scene);
  modeCaption.textContent = state.view === 'rig'
    ? 'Painted limb pivots → animated hoof endpoints'
    : state.view === 'neutral'
      ? 'Painterly reusable raster parts on neutral gray'
      : state.travel === 'in-place'
        ? 'Walk in place · no root translation'
        : 'Walk through scene · foreground occlusion active';
}

function applyTravelMode() {
  document.querySelectorAll('.travel-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.travel === state.travel);
  });
  updateRootTravel();
  applyView();
}

function applyMotion() {
  rig.setMotionStrength(state.motionStrength);
  rig.setActorScale(state.actorScale);
  layoutScene();
}

rig.setMotionStrength(state.motionStrength);
rig.setActorScale(state.actorScale);
layoutScene();
applyTravelMode();
applyView();

new ResizeObserver(layoutScene).observe(mountEl);

for (const button of document.querySelectorAll('.travel-button')) {
  button.addEventListener('click', () => {
    state.travel = button.dataset.travel;
    state.elapsed = 0;
    applyTravelMode();
  });
}

for (const button of document.querySelectorAll('.view-button')) {
  button.addEventListener('click', () => {
    state.view = button.dataset.view;
    applyView();
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
  rig.resetPose();
  updateRootTravel();
});

motionInput.addEventListener('input', () => {
  state.motionStrength = Number(motionInput.value) / 100;
  motionOutput.textContent = `${motionInput.value}%`;
  applyMotion();
});

scaleInput.addEventListener('input', () => {
  state.actorScale = Number(scaleInput.value) / 100;
  scaleOutput.textContent = `${scaleInput.value}%`;
  applyMotion();
});

foregroundToggle.addEventListener('change', applyView);
dustToggle.addEventListener('change', applyView);
grainToggle.addEventListener('change', applyView);
focusToggle.addEventListener('change', applyView);

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
  const phase = state.elapsed * 2.65;
  rig.updatePose(phase);
  rig.updateContinuous(scaledDelta);
  updateRootTravel();
});

window.__childLightLab = {
  app,
  rig,
  state,
  getSceneState() {
    return {
      travel: state.travel,
      view: state.view,
      rootX: rig.root.x,
      actorScale: state.actorScale,
      foregroundVisible: frontGrass.visible,
    };
  },
};
