import { createRng } from './rng.js';

export const FIXED_HZ = 60;
export const ARENA = Object.freeze({ width: 800, height: 450 });
export const MOVE_PER_TICK = 4;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function blankInput() {
  return { left: false, right: false, up: false, down: false };
}

function normalizeInput(input = {}) {
  return {
    left: Boolean(input.left),
    right: Boolean(input.right),
    up: Boolean(input.up),
    down: Boolean(input.down),
  };
}

export function createGame(seed = 1) {
  const normalizedSeed = (Number(seed) >>> 0) || 1;
  const rng = createRng(normalizedSeed);
  const events = [];
  const inputs = {
    p1: blankInput(),
    p2: blankInput(),
  };

  let state = {
    version: 1,
    seed: normalizedSeed,
    tick: 0,
    arena: { ...ARENA },
    marker: {
      x: 240 + Math.floor(rng.next() * 320),
      y: 120 + Math.floor(rng.next() * 210),
    },
    fighters: {
      p1: { id: 'p1', x: 180, y: 225, vx: 0, vy: 0 },
      p2: { id: 'p2', x: 620, y: 225, vx: 0, vy: 0 },
    },
  };

  function pushEvent(type, payload = {}) {
    events.push({ tick: state.tick, type, ...payload });
    if (events.length > 100) events.shift();
  }

  function updateFighter(fighter, input) {
    const dx = Number(input.right) - Number(input.left);
    const dy = Number(input.down) - Number(input.up);

    fighter.vx = dx * MOVE_PER_TICK;
    fighter.vy = dy * MOVE_PER_TICK;

    const oldX = fighter.x;
    const oldY = fighter.y;

    fighter.x = Math.max(20, Math.min(ARENA.width - 20, fighter.x + fighter.vx));
    fighter.y = Math.max(20, Math.min(ARENA.height - 20, fighter.y + fighter.vy));

    if (fighter.x !== oldX || fighter.y !== oldY) {
      pushEvent('move', { fighterId: fighter.id, x: fighter.x, y: fighter.y });
    }
  }

  return {
    getState() {
      return clone(state);
    },

    getEvents() {
      return clone(events);
    },

    setInput(playerId, input) {
      if (!(playerId in inputs)) throw new Error(`Unknown player: ${playerId}`);
      inputs[playerId] = normalizeInput(input);
    },

    step(ticks = 1) {
      const count = Math.max(0, Math.floor(Number(ticks)));
      for (let i = 0; i < count; i += 1) {
        state.tick += 1;
        updateFighter(state.fighters.p1, inputs.p1);
        updateFighter(state.fighters.p2, inputs.p2);
      }
      return clone(state);
    },

    reset(nextSeed = normalizedSeed) {
      return createGame(nextSeed);
    },
  };
}
