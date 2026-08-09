import { SOURCES, VisualStateStore, SharedVisualClock } from './scene-state.js';
import { BabylonPaintingRenderer } from './babylon-renderer.js';
import { Painting2DRenderer } from './painting2d-renderer.js';

const $ = (selector) => document.querySelector(selector);
const store = new VisualStateStore();
const clock = new SharedVisualClock(store);
const rendererA = new BabylonPaintingRenderer();
const rendererB = new Painting2DRenderer();

const compareGrid = $('#compareGrid');
const panelA = $('#panelA');
const panelB = $('#panelB');
const blinkDeck = $('#blinkDeck');
const blinkViewport = $('#blinkViewport');
let blinkSide = 'a';
let ready = false;
let metricsTimer = 0;

function setPaintingSource(sourceId) {
  const source = SOURCES[sourceId] || SOURCES.bierstadt;
  document.documentElement.style.setProperty('--painting-url', `url("${source.image}")`);
  document.documentElement.dataset.source = sourceId;
}

function applyStateToDocument(state) {
  document.body.dataset.time = state.timeOfDay;
  document.body.dataset.weather = state.weather;
  setPaintingSource(state.source);
  $('#pauseButton').textContent = state.paused ? 'Resume' : 'Pause';
  $('#clockReadout').textContent = `${state.elapsed.toFixed(1)}s`;

  const glows = document.querySelectorAll('.painting-glow');
  const glowOpacity = state.timeOfDay === 'golden' ? .94 : state.timeOfDay === 'dawn' ? .65 : state.timeOfDay === 'dusk' ? .48 : .34;
  glows.forEach((glow) => {
    glow.style.opacity = String(glowOpacity * (.55 + state.atmosphere * .6));
  });
}

function syncControls(state) {
  $('#sourceSelect').value = state.source;
  $('#timeSelect').value = state.timeOfDay;
  $('#weatherSelect').value = state.weather;
  $('#speedRange').value = state.travelSpeed;
  $('#windRange').value = state.wind;
  $('#atmosphereRange').value = state.atmosphere;
}

function bindControls() {
  $('#sourceSelect').addEventListener('change', (event) => store.set({ source: event.target.value }));
  $('#timeSelect').addEventListener('change', (event) => store.set({ timeOfDay: event.target.value }));
  $('#weatherSelect').addEventListener('change', (event) => store.set({ weather: event.target.value }));
  $('#speedRange').addEventListener('input', (event) => store.set({ travelSpeed: Number(event.target.value) }));
  $('#windRange').addEventListener('input', (event) => store.set({ wind: Number(event.target.value) }));
  $('#atmosphereRange').addEventListener('input', (event) => store.set({ atmosphere: Number(event.target.value) }));
  $('#pauseButton').addEventListener('click', () => store.set({ paused: !store.state.paused }));
  $('#swapButton').addEventListener('click', () => compareGrid.classList.toggle('swapped'));
  $('#resetButton').addEventListener('click', () => {
    store.reset();
    syncControls(store.state);
  });
  $('#blinkButton').addEventListener('click', openBlink);
  $('#blinkA').addEventListener('click', () => setBlinkSide('a'));
  $('#blinkB').addEventListener('click', () => setBlinkSide('b'));
  $('#blinkExit').addEventListener('click', closeBlink);
}

function openBlink() {
  blinkDeck.classList.remove('hidden');
  blinkViewport.append(panelA, panelB);
  setBlinkSide('a');
  requestAnimationFrame(resizeBoth);
}

function closeBlink() {
  blinkDeck.classList.add('hidden');
  compareGrid.append(panelA, panelB);
  panelA.classList.remove('blink-hidden');
  panelB.classList.remove('blink-hidden');
  requestAnimationFrame(resizeBoth);
}

function setBlinkSide(side) {
  blinkSide = side;
  panelA.classList.toggle('blink-hidden', side !== 'a');
  panelB.classList.toggle('blink-hidden', side !== 'b');
  $('#blinkA').classList.toggle('active', side === 'a');
  $('#blinkB').classList.toggle('active', side === 'b');
}

function updateBackdropMotion(state) {
  const backdrop = panelA.querySelector('.painting-backdrop');
  if (backdrop) {
    const travel = state.paused ? 0 : state.elapsed * state.travelSpeed;
    const wind = Math.sin(state.elapsed * .17) * state.wind;
    backdrop.style.transform = `scale(1.07) translate3d(${(-travel * .42 + wind * 2.5).toFixed(2)}px,${Math.sin(state.elapsed * .09) * .55}px,0)`;
  }

  if (state.weather === 'storm') {
    const flash = Math.pow(Math.max(0, Math.sin(state.elapsed * 2.31 - 1.8)), 22);
    document.querySelectorAll('.painting-glow').forEach((glow) => {
      glow.style.filter = `brightness(${1 + flash * 3.8})`;
    });
  } else {
    document.querySelectorAll('.painting-glow').forEach((glow) => { glow.style.filter = ''; });
  }
}

function metricText(metric, extraLabel) {
  if (!metric) return 'initializing…';
  const fps = metric.fps ? metric.fps.toFixed(0) : '—';
  const cpu = Number.isFinite(metric.cpuMs) ? metric.cpuMs.toFixed(2) : '—';
  const count = metric.meshes ?? metric.objects ?? '—';
  return `${metric.backend}\n${fps} fps · ${cpu} ms\n${extraLabel}: ${count}`;
}

function updateMetrics(force = false) {
  const now = performance.now();
  if (!force && now - metricsTimer < 450) return;
  metricsTimer = now;
  const a = rendererA.getMetrics();
  const b = rendererB.getMetrics();
  $('#metricA').textContent = metricText(a, 'meshes');
  $('#metricB').textContent = metricText(b, 'objects');
  $('#backendBadge').textContent = `Babylon · ${a.backend}`;
}

function resizeBoth() {
  rendererA.resize();
  rendererB.resize();
}

async function init() {
  bindControls();
  syncControls(store.state);
  applyStateToDocument(store.state);

  const resizeObserver = new ResizeObserver(() => resizeBoth());
  resizeObserver.observe(panelA.querySelector('.painting-stage'));
  resizeObserver.observe(panelB.querySelector('.painting-stage'));

  const [aResult, bResult] = await Promise.allSettled([
    rendererA.init($('#babylonCanvas')),
    rendererB.init($('#pixiLab')),
  ]);

  if (aResult.status === 'rejected') {
    console.error('Option A failed to initialize:', aResult.reason);
    $('#metricA').textContent = 'FAILED TO INITIALIZE';
  }
  if (bResult.status === 'rejected') {
    console.error('Option B failed to initialize:', bResult.reason);
    $('#metricB').textContent = 'FAILED TO INITIALIZE';
  }

  store.addEventListener('change', (event) => applyStateToDocument(event.detail));
  clock.subscribe((delta, state) => {
    if (aResult.status === 'fulfilled') rendererA.update(delta, state);
    if (bResult.status === 'fulfilled') rendererB.update(delta, state);
    applyStateToDocument(state);
    updateBackdropMotion(state);
    updateMetrics();
  });
  clock.start();
  ready = aResult.status === 'fulfilled' && bResult.status === 'fulfilled';
  updateMetrics(true);

  window.frontierVisualLab = {
    get ready() { return ready; },
    get state() { return store.snapshot; },
    get blinkSide() { return blinkSide; },
    setState(patch) { store.set(patch); syncControls(store.state); },
    pause() { store.set({ paused: true }); },
    resume() { store.set({ paused: false }); },
    reset() { store.reset(); syncControls(store.state); },
    getMetrics() { return { optionA: rendererA.getMetrics(), optionB: rendererB.getMetrics() }; },
    resize: resizeBoth,
  };
}

init().catch((error) => {
  console.error('Visual lab failed to initialize.', error);
  document.body.dataset.failed = 'true';
});
