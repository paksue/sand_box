import { createRng } from './rng.js';

export const FIXED_HZ = 60;
export const ARENA = Object.freeze({ width: 800, height: 450 });
export const FIGHTER_RADIUS = 20;
export const MOVE_PER_TICK = 4;
export const ATTACK_RANGE = 56;
export const ATTACK_DAMAGE = 10;
export const ATTACK_COOLDOWN_TICKS = 14;
export const ATTACK_STARTUP_TICKS = 2;
export const ATTACK_RECOVERY_TICKS = 4;
export const HITSTOP_TICKS = 3;
export const KNOCKBACK_SPEED = 10;
export const KNOCKBACK_DECAY = 0.82;
export const HITSTUN_TICKS = 10;
export const ROPE_RETENTION = 0.75;
export const REBOUND_LOCK_TICKS = 6;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function blankInput() {
  return { left: false, right: false, up: false, down: false, attack: false };
}

function normalizeInput(input = {}) {
  return {
    left: Boolean(input.left),
    right: Boolean(input.right),
    up: Boolean(input.up),
    down: Boolean(input.down),
    attack: Boolean(input.attack),
  };
}

function createFighter(id, x, y, facingX) {
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    facingX,
    facingY: 0,
    state: 'idle',
    health: 100,
    attackCooldown: 0,
    attackStartupTicks: 0,
    attackRecoveryTicks: 0,
    attackActive: false,
    hitstunTicks: 0,
    reboundTicks: 0,
  };
}

function normalizedVector(x, y) {
  const length = Math.hypot(x, y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: x / length, y: y / length };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createGame(seed = 1) {
  const normalizedSeed = (Number(seed) >>> 0) || 1;
  const rng = createRng(normalizedSeed);
  const events = [];
  const inputs = {
    p1: blankInput(),
    p2: blankInput(),
  };
  const attackLatch = { p1: false, p2: false };

  let state = {
    version: 3,
    seed: normalizedSeed,
    tick: 0,
    hitstopTicks: 0,
    impact: null,
    arena: { ...ARENA },
    marker: {
      x: 240 + Math.floor(rng.next() * 320),
      y: 120 + Math.floor(rng.next() * 210),
    },
    fighters: {
      p1: createFighter('p1', 180, 225, 1),
      p2: createFighter('p2', 620, 225, -1),
    },
  };

  function pushEvent(type, payload = {}) {
    events.push({ tick: state.tick, type, ...payload });
    if (events.length > 240) events.shift();
  }

  function syncAttackLatches() {
    attackLatch.p1 = inputs.p1.attack;
    attackLatch.p2 = inputs.p2.attack;
  }

  function resolveRopes(fighter) {
    const minX = FIGHTER_RADIUS;
    const maxX = ARENA.width - FIGHTER_RADIUS;
    const minY = FIGHTER_RADIUS;
    const maxY = ARENA.height - FIGHTER_RADIUS;

    let axis = null;
    if (fighter.x < minX) {
      fighter.x = minX;
      if (fighter.vx < 0) {
        fighter.vx = -fighter.vx * ROPE_RETENTION;
        axis = 'x';
      }
    } else if (fighter.x > maxX) {
      fighter.x = maxX;
      if (fighter.vx > 0) {
        fighter.vx = -fighter.vx * ROPE_RETENTION;
        axis = 'x';
      }
    }

    if (fighter.y < minY) {
      fighter.y = minY;
      if (fighter.vy < 0) {
        fighter.vy = -fighter.vy * ROPE_RETENTION;
        axis = axis ? 'xy' : 'y';
      }
    } else if (fighter.y > maxY) {
      fighter.y = maxY;
      if (fighter.vy > 0) {
        fighter.vy = -fighter.vy * ROPE_RETENTION;
        axis = axis ? 'xy' : 'y';
      }
    }

    if (axis) {
      if (fighter.hitstunTicks === 0) {
        fighter.reboundTicks = REBOUND_LOCK_TICKS;
        fighter.state = 'rebound';
      }
      pushEvent('rope-rebound', {
        fighterId: fighter.id,
        axis,
        vx: fighter.vx,
        vy: fighter.vy,
      });
    }
  }

  function updateFighter(fighter, input) {
    if (fighter.attackCooldown > 0) fighter.attackCooldown -= 1;

    const oldX = fighter.x;
    const oldY = fighter.y;

    if (fighter.hitstunTicks > 0) {
      fighter.state = 'hitstun';
      fighter.x += fighter.vx;
      fighter.y += fighter.vy;
      fighter.vx *= KNOCKBACK_DECAY;
      fighter.vy *= KNOCKBACK_DECAY;
      fighter.hitstunTicks -= 1;
    } else if (fighter.reboundTicks > 0) {
      fighter.state = 'rebound';
      fighter.x += fighter.vx;
      fighter.y += fighter.vy;
      fighter.vx *= 0.9;
      fighter.vy *= 0.9;
      fighter.reboundTicks -= 1;
    } else if (fighter.attackStartupTicks > 0) {
      fighter.state = 'attack';
      fighter.vx = 0;
      fighter.vy = 0;
      fighter.attackStartupTicks -= 1;
      if (fighter.attackStartupTicks === 0) fighter.attackActive = true;
    } else if (fighter.attackRecoveryTicks > 0) {
      fighter.state = 'attack';
      fighter.vx = 0;
      fighter.vy = 0;
      fighter.attackRecoveryTicks -= 1;
    } else {
      const rawX = Number(input.right) - Number(input.left);
      const rawY = Number(input.down) - Number(input.up);
      const direction = normalizedVector(rawX, rawY);

      fighter.vx = direction.x * MOVE_PER_TICK;
      fighter.vy = direction.y * MOVE_PER_TICK;
      fighter.x += fighter.vx;
      fighter.y += fighter.vy;

      if (direction.x !== 0 || direction.y !== 0) {
        fighter.facingX = direction.x;
        fighter.facingY = direction.y;
        fighter.state = 'move';
      } else {
        fighter.state = 'idle';
      }
    }

    resolveRopes(fighter);

    if (fighter.x !== oldX || fighter.y !== oldY) {
      pushEvent('move', {
        fighterId: fighter.id,
        x: fighter.x,
        y: fighter.y,
        state: fighter.state,
      });
    }
  }

  function moveWithinArena(fighter, directionX, directionY, distance) {
    if (distance <= 0) return 0;
    const oldX = fighter.x;
    const oldY = fighter.y;
    fighter.x = clamp(
      oldX + directionX * distance,
      FIGHTER_RADIUS,
      ARENA.width - FIGHTER_RADIUS,
    );
    fighter.y = clamp(
      oldY + directionY * distance,
      FIGHTER_RADIUS,
      ARENA.height - FIGHTER_RADIUS,
    );
    return (fighter.x - oldX) * directionX + (fighter.y - oldY) * directionY;
  }

  function resolveBodyCollision() {
    const a = state.fighters.p1;
    const b = state.fighters.p2;
    const minimum = FIGHTER_RADIUS * 2;
    const initialDistance = Math.hypot(b.x - a.x, b.y - a.y);
    if (initialDistance >= minimum) return;

    for (let pass = 0; pass < 4; pass += 1) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);
      if (distance >= minimum - 1e-9) break;

      const normal = distance === 0 ? { x: 1, y: 0 } : { x: dx / distance, y: dy / distance };
      const overlap = minimum - distance;
      const half = overlap * 0.5;
      const movedA = moveWithinArena(a, -normal.x, -normal.y, half);
      const movedB = moveWithinArena(b, normal.x, normal.y, half);
      let remaining = Math.max(0, overlap - movedA - movedB);

      if (remaining > 1e-9) {
        remaining -= moveWithinArena(b, normal.x, normal.y, remaining);
      }
      if (remaining > 1e-9) {
        moveWithinArena(a, -normal.x, -normal.y, remaining);
      }
    }

    const finalDistance = Math.hypot(b.x - a.x, b.y - a.y);
    pushEvent('body-collision', {
      fighterA: a.id,
      fighterB: b.id,
      distanceBefore: initialDistance,
      distanceAfter: finalDistance,
    });
  }

  function hasAttackPhase(fighter) {
    return fighter.attackStartupTicks > 0
      || fighter.attackRecoveryTicks > 0
      || fighter.attackActive;
  }

  function canAttack(fighter) {
    return fighter.health > 0
      && fighter.attackCooldown === 0
      && !hasAttackPhase(fighter)
      && fighter.hitstunTicks === 0
      && fighter.reboundTicks === 0;
  }

  function processAttackStarts() {
    for (const playerId of ['p1', 'p2']) {
      const fighter = state.fighters[playerId];
      const input = inputs[playerId];
      const pressed = input.attack && !attackLatch[playerId];

      if (pressed && canAttack(fighter)) {
        fighter.attackCooldown = ATTACK_COOLDOWN_TICKS;
        fighter.attackStartupTicks = ATTACK_STARTUP_TICKS;
        fighter.attackRecoveryTicks = 0;
        fighter.attackActive = false;
        fighter.state = 'attack';
        fighter.vx = 0;
        fighter.vy = 0;
        pushEvent('attack-start', {
          fighterId: playerId,
          startupTicks: ATTACK_STARTUP_TICKS,
        });
      }

      attackLatch[playerId] = input.attack;
    }
  }

  function applyHit(attackerId, targetId) {
    const attacker = state.fighters[attackerId];
    const target = state.fighters[targetId];
    const toTargetX = target.x - attacker.x;
    const toTargetY = target.y - attacker.y;
    const distance = Math.hypot(toTargetX, toTargetY);
    const toTarget = normalizedVector(toTargetX, toTargetY);
    const facingDot = attacker.facingX * toTarget.x + attacker.facingY * toTarget.y;

    if (distance <= ATTACK_RANGE && facingDot >= 0.35) {
      target.health = Math.max(0, target.health - ATTACK_DAMAGE);
      target.vx = attacker.facingX * KNOCKBACK_SPEED;
      target.vy = attacker.facingY * KNOCKBACK_SPEED;
      target.hitstunTicks = HITSTUN_TICKS;
      target.reboundTicks = 0;
      target.attackStartupTicks = 0;
      target.attackRecoveryTicks = 0;
      target.attackActive = false;
      target.state = 'hitstun';

      state.hitstopTicks = HITSTOP_TICKS;
      state.impact = {
        attackerId,
        targetId,
        x: (attacker.x + target.x) * 0.5,
        y: (attacker.y + target.y) * 0.5,
        ticksRemaining: HITSTOP_TICKS,
      };

      pushEvent('attack-hit', {
        attackerId,
        targetId,
        damage: ATTACK_DAMAGE,
        targetHealth: target.health,
      });
      pushEvent('knockback', {
        attackerId,
        targetId,
        vx: target.vx,
        vy: target.vy,
      });
      pushEvent('hitstop-start', {
        attackerId,
        targetId,
        ticks: HITSTOP_TICKS,
      });
      return true;
    }

    pushEvent('attack-miss', { attackerId, targetId, distance, facingDot });
    return false;
  }

  function processActiveAttacks() {
    const attackers = ['p1', 'p2'].filter((playerId) => state.fighters[playerId].attackActive);

    for (const attackerId of attackers) {
      const fighter = state.fighters[attackerId];
      fighter.attackActive = false;
      fighter.attackRecoveryTicks = ATTACK_RECOVERY_TICKS;
    }

    for (const attackerId of attackers) {
      const targetId = attackerId === 'p1' ? 'p2' : 'p1';
      applyHit(attackerId, targetId);
    }
  }

  function advanceHitstop() {
    state.hitstopTicks -= 1;
    if (state.impact) state.impact.ticksRemaining = state.hitstopTicks;
    pushEvent('hitstop-tick', { remaining: state.hitstopTicks });
    syncAttackLatches();
    if (state.hitstopTicks === 0) state.impact = null;
  }

  function resetInputs() {
    inputs.p1 = blankInput();
    inputs.p2 = blankInput();
    attackLatch.p1 = false;
    attackLatch.p2 = false;
  }

  function loadScenario(name) {
    resetInputs();
    events.length = 0;
    state.tick = 0;
    state.hitstopTicks = 0;
    state.impact = null;
    state.fighters.p1 = createFighter('p1', 180, 225, 1);
    state.fighters.p2 = createFighter('p2', 620, 225, -1);

    switch (name) {
      case 'baseline':
        break;
      case 'collision':
        state.fighters.p1 = createFighter('p1', 340, 225, 1);
        state.fighters.p2 = createFighter('p2', 460, 225, -1);
        break;
      case 'edge-collision':
        state.fighters.p1 = createFighter('p1', 20, 225, 1);
        state.fighters.p2 = createFighter('p2', 48, 225, -1);
        break;
      case 'attack':
        state.fighters.p1 = createFighter('p1', 350, 225, 1);
        state.fighters.p2 = createFighter('p2', 400, 225, -1);
        break;
      case 'rope':
        state.fighters.p1 = createFighter('p1', 30, 225, -1);
        break;
      case 'rope-hit':
        state.fighters.p1 = createFighter('p1', 700, 225, 1);
        state.fighters.p2 = createFighter('p2', 755, 225, -1);
        break;
      default:
        throw new Error(`Unknown scenario: ${name}`);
    }

    pushEvent('scenario-loaded', { name });
    return clone(state);
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

    loadScenario,

    step(ticks = 1) {
      const count = Math.max(0, Math.floor(Number(ticks)));
      for (let i = 0; i < count; i += 1) {
        state.tick += 1;

        if (state.hitstopTicks > 0) {
          advanceHitstop();
          continue;
        }

        updateFighter(state.fighters.p1, inputs.p1);
        updateFighter(state.fighters.p2, inputs.p2);
        resolveBodyCollision();
        processAttackStarts();
        processActiveAttacks();
      }
      return clone(state);
    },

    reset(nextSeed = normalizedSeed) {
      return createGame(nextSeed);
    },
  };
}
