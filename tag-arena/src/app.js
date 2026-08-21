import { createGame, FIXED_HZ } from './simulation.js';

const params = new URLSearchParams(window.location.search);
const manualMode = params.get('manual') === '1';
const debugMode = params.get('debug') === '1' || manualMode;
const canvas = document.querySelector('#arena');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#status');

let game = createGame(Number(params.get('seed') || 1));
let accumulator = 0;
let lastTime = performance.now();

function drawFighter(fighter, label) {
  ctx.beginPath();
  ctx.arc(fighter.x, fighter.y, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText(label, fighter.x - 8, fighter.y - 28);
}

function render() {
  const state = game.getState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeRect(1, 1, state.arena.width - 2, state.arena.height - 2);

  ctx.save();
  ctx.fillStyle = '#111';
  ctx.font = '14px system-ui, sans-serif';

  ctx.beginPath();
  ctx.arc(state.marker.x, state.marker.y, 7, 0, Math.PI * 2);
  ctx.fill();

  drawFighter(state.fighters.p1, 'P1');
  drawFighter(state.fighters.p2, 'P2');
  ctx.restore();

  status.textContent = `seed ${state.seed} · tick ${state.tick} · P1 (${state.fighters.p1.x}, ${state.fighters.p1.y})`;
}

function setKeyboardInput(event, pressed) {
  const keyMap = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };
  const action = keyMap[event.key];
  if (!action) return;
  event.preventDefault();

  const state = game.getState();
  const current = window.__keyboardInput || { left: false, right: false, up: false, down: false };
  window.__keyboardInput = { ...current, [action]: pressed };
  game.setInput('p1', window.__keyboardInput);
  if (debugMode) status.dataset.lastInputTick = String(state.tick);
}

window.addEventListener('keydown', (event) => setKeyboardInput(event, true));
window.addEventListener('keyup', (event) => setKeyboardInput(event, false));

if (debugMode) {
  window.__TAG_ARENA__ = Object.freeze({
    version: 1,
    getState: () => game.getState(),
    getEvents: () => game.getEvents(),
    setInput: (playerId, input) => game.setInput(playerId, input),
    step: (ticks = 1) => {
      const next = game.step(ticks);
      render();
      return next;
    },
    reset: (seed = 1) => {
      game = createGame(seed);
      window.__keyboardInput = { left: false, right: false, up: false, down: false };
      render();
      return game.getState();
    },
  });
}

function frame(now) {
  const frameSeconds = Math.min(0.25, (now - lastTime) / 1000);
  lastTime = now;
  accumulator += frameSeconds;
  const fixedSeconds = 1 / FIXED_HZ;

  while (accumulator >= fixedSeconds) {
    game.step(1);
    accumulator -= fixedSeconds;
  }

  render();
  requestAnimationFrame(frame);
}

render();
if (!manualMode) requestAnimationFrame(frame);
