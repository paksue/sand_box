import { createGame, FIGHTER_RADIUS, FIXED_HZ } from './simulation.js';

const params = new URLSearchParams(window.location.search);
const manualMode = params.get('manual') === '1';
const debugMode = params.get('debug') === '1' || manualMode;
const canvas = document.querySelector('#arena');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#status');

let game = createGame(Number(params.get('seed') || 1));
let accumulator = 0;
let lastTime = performance.now();

const keyboardInputs = {
  p1: blankKeyboardInput(),
  p2: blankKeyboardInput(),
};

function blankKeyboardInput() {
  return { left: false, right: false, up: false, down: false, attack: false };
}

function drawHealthBar(x, y, width, fighter, alignRight = false) {
  ctx.save();
  ctx.fillStyle = '#ddd';
  ctx.fillRect(x, y, width, 10);
  ctx.fillStyle = fighter.id === 'p1' ? '#1769aa' : '#b3261e';
  const healthWidth = width * (fighter.health / 100);
  ctx.fillRect(alignRight ? x + width - healthWidth : x, y, healthWidth, 10);
  ctx.strokeStyle = '#111';
  ctx.strokeRect(x, y, width, 10);
  ctx.restore();
}

function drawFighter(fighter, label, fillStyle) {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(fighter.x, fighter.y, FIGHTER_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(fighter.x, fighter.y);
  ctx.lineTo(
    fighter.x + fighter.facingX * (FIGHTER_RADIUS + 13),
    fighter.y + fighter.facingY * (FIGHTER_RADIUS + 13),
  );
  ctx.stroke();

  if (fighter.state === 'attack') {
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(fighter.x, fighter.y, FIGHTER_RADIUS + 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#111';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillText(label, fighter.x - 10, fighter.y - 30);
  ctx.font = '12px ui-monospace, SFMono-Regular, Consolas, monospace';
  ctx.fillText(fighter.state, fighter.x - 28, fighter.y + 38);
  ctx.restore();
}

function render() {
  const state = game.getState();
  const { p1, p2 } = state.fighters;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, state.arena.width - 4, state.arena.height - 4);
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = '#bbb';
  ctx.strokeRect(14, 14, state.arena.width - 28, state.arena.height - 28);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(state.marker.x, state.marker.y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawHealthBar(20, 18, 260, p1);
  drawHealthBar(520, 18, 260, p2, true);
  drawFighter(p1, 'P1', '#1769aa');
  drawFighter(p2, 'P2', '#b3261e');

  status.textContent = [
    `seed ${state.seed}`,
    `tick ${state.tick}`,
    `P1 ${p1.health}hp ${p1.state} (${p1.x.toFixed(1)}, ${p1.y.toFixed(1)})`,
    `P2 ${p2.health}hp ${p2.state} (${p2.x.toFixed(1)}, ${p2.y.toFixed(1)})`,
  ].join(' · ');
}

const keyMap = {
  ArrowLeft: ['p1', 'left'],
  ArrowRight: ['p1', 'right'],
  ArrowUp: ['p1', 'up'],
  ArrowDown: ['p1', 'down'],
  Space: ['p1', 'attack'],
  KeyA: ['p2', 'left'],
  KeyD: ['p2', 'right'],
  KeyW: ['p2', 'up'],
  KeyS: ['p2', 'down'],
  KeyF: ['p2', 'attack'],
};

function setKeyboardInput(event, pressed) {
  const mapping = keyMap[event.code];
  if (!mapping) return;
  event.preventDefault();

  const [playerId, action] = mapping;
  keyboardInputs[playerId] = { ...keyboardInputs[playerId], [action]: pressed };
  game.setInput(playerId, keyboardInputs[playerId]);
  if (debugMode) status.dataset.lastInputTick = String(game.getState().tick);
}

function clearKeyboardInputs() {
  keyboardInputs.p1 = blankKeyboardInput();
  keyboardInputs.p2 = blankKeyboardInput();
  game.setInput('p1', keyboardInputs.p1);
  game.setInput('p2', keyboardInputs.p2);
}

window.addEventListener('keydown', (event) => setKeyboardInput(event, true));
window.addEventListener('keyup', (event) => setKeyboardInput(event, false));
window.addEventListener('blur', clearKeyboardInputs);

if (debugMode) {
  window.__TAG_ARENA__ = Object.freeze({
    version: 2,
    getState: () => game.getState(),
    getEvents: () => game.getEvents(),
    setInput: (playerId, input) => game.setInput(playerId, input),
    loadScenario: (name) => {
      clearKeyboardInputs();
      const next = game.loadScenario(name);
      render();
      return next;
    },
    step: (ticks = 1) => {
      const next = game.step(ticks);
      render();
      return next;
    },
    reset: (seed = 1) => {
      game = createGame(seed);
      keyboardInputs.p1 = blankKeyboardInput();
      keyboardInputs.p2 = blankKeyboardInput();
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
