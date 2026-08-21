import {
  ARENA,
  ATTACK_COOLDOWN_TICKS,
  ATTACK_DAMAGE,
  ATTACK_RANGE,
  ATTACK_RECOVERY_TICKS,
  ATTACK_STARTUP_TICKS,
  FACING_THRESHOLD,
  FIGHTER_RADIUS,
  GRAPPLE_COOLDOWN_TICKS,
  GRAPPLE_HOLD_TICKS,
  GRAPPLE_RANGE,
  GRAPPLE_RECOVERY_TICKS,
  HITSTOP_TICKS,
  HITSTUN_TICKS,
  KNOCKBACK_DECAY,
  KNOCKBACK_SPEED,
  MOVE_PER_TICK,
  REBOUND_LOCK_TICKS,
  ROPE_RETENTION,
  THROW_DAMAGE,
  THROW_HITSTOP_TICKS,
  THROW_HITSTUN_TICKS,
  THROW_SPEED,
} from './constants';
import { createRng } from './rng';
import type {
  FighterState,
  GameApi,
  GameEvent,
  GameState,
  InputState,
  PlayerId,
  ScenarioName,
} from './types';

const PLAYER_IDS: readonly PlayerId[] = ['p1', 'p2'];

type EventPayload = Record<string, string | number | boolean>;

function clone<T>(value: T): T {
  return structuredClone(value);
}

function blankInput(): InputState {
  return { left: false, right: false, up: false, down: false, attack: false };
}

function normalizeInput(input: Partial<InputState> = {}): InputState {
  return {
    left: Boolean(input.left),
    right: Boolean(input.right),
    up: Boolean(input.up),
    down: Boolean(input.down),
    attack: Boolean(input.attack),
  };
}

function createFighter(id: PlayerId, x: number, y: number, facingX: number): FighterState {
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
    grappleRecoveryTicks: 0,
    hitstunTicks: 0,
    reboundTicks: 0,
  };
}

function normalizedVector(x: number, y: number): { x: number; y: number } {
  const length = Math.hypot(x, y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: x / length, y: y / length };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class Game implements GameApi {
  readonly #normalizedSeed: number;
  readonly #events: GameEvent[] = [];
  readonly #inputs: Record<PlayerId, InputState> = {
    p1: blankInput(),
    p2: blankInput(),
  };
  readonly #attackLatch: Record<PlayerId, boolean> = { p1: false, p2: false };
  #state: GameState;

  constructor(seed = 1) {
    this.#normalizedSeed = (Number(seed) >>> 0) || 1;
    const rng = createRng(this.#normalizedSeed);
    this.#state = {
      version: 4,
      seed: this.#normalizedSeed,
      tick: 0,
      hitstopTicks: 0,
      impact: null,
      grapple: null,
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
  }

  getState(): GameState {
    return clone(this.#state);
  }

  getEvents(): GameEvent[] {
    return clone(this.#events);
  }

  setInput(playerId: PlayerId, input: Partial<InputState>): void {
    this.#inputs[playerId] = normalizeInput(input);
  }

  loadScenario(name: ScenarioName): GameState {
    this.#resetInputs();
    this.#events.length = 0;
    this.#state.tick = 0;
    this.#state.hitstopTicks = 0;
    this.#state.impact = null;
    this.#state.grapple = null;
    this.#state.fighters.p1 = createFighter('p1', 180, 225, 1);
    this.#state.fighters.p2 = createFighter('p2', 620, 225, -1);

    switch (name) {
      case 'baseline':
        break;
      case 'collision':
        this.#state.fighters.p1 = createFighter('p1', 340, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 460, 225, -1);
        break;
      case 'edge-collision':
        this.#state.fighters.p1 = createFighter('p1', 20, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 48, 225, -1);
        break;
      case 'attack':
        this.#state.fighters.p1 = createFighter('p1', 350, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 400, 225, -1);
        break;
      case 'grapple':
        this.#state.fighters.p1 = createFighter('p1', 350, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 390, 225, -1);
        break;
      case 'grapple-rope':
        this.#state.fighters.p1 = createFighter('p1', 725, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 765, 225, -1);
        break;
      case 'rope':
        this.#state.fighters.p1 = createFighter('p1', 30, 225, -1);
        break;
      case 'rope-hit':
        this.#state.fighters.p1 = createFighter('p1', 700, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 755, 225, -1);
        break;
    }

    this.#pushEvent('scenario-loaded', { name });
    return clone(this.#state);
  }

  step(ticks = 1): GameState {
    const count = Math.max(0, Math.floor(Number(ticks)));
    for (let i = 0; i < count; i += 1) {
      this.#state.tick += 1;

      if (this.#state.hitstopTicks > 0) {
        this.#advanceHitstop();
        continue;
      }

      if (this.#state.grapple) {
        this.#advanceGrapple();
        continue;
      }

      this.#updateFighter(this.#state.fighters.p1, this.#inputs.p1);
      this.#updateFighter(this.#state.fighters.p2, this.#inputs.p2);
      this.#resolveBodyCollision();
      this.#processActionStarts();
      this.#processActiveAttacks();
    }
    return clone(this.#state);
  }

  reset(seed = this.#normalizedSeed): Game {
    return new Game(seed);
  }

  #pushEvent(type: string, payload: EventPayload = {}): void {
    this.#events.push({ tick: this.#state.tick, type, ...payload });
    if (this.#events.length > 260) this.#events.shift();
  }

  #syncAttackLatches(): void {
    this.#attackLatch.p1 = this.#inputs.p1.attack;
    this.#attackLatch.p2 = this.#inputs.p2.attack;
  }

  #resolveRopes(fighter: FighterState): void {
    const minX = FIGHTER_RADIUS;
    const maxX = ARENA.width - FIGHTER_RADIUS;
    const minY = FIGHTER_RADIUS;
    const maxY = ARENA.height - FIGHTER_RADIUS;
    let axis: 'x' | 'y' | 'xy' | null = null;

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
      this.#pushEvent('rope-rebound', {
        fighterId: fighter.id,
        axis,
        vx: fighter.vx,
        vy: fighter.vy,
      });
    }
  }

  #updateFighter(fighter: FighterState, input: InputState): void {
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
    } else if (fighter.grappleRecoveryTicks > 0) {
      fighter.state = 'throw';
      fighter.vx = 0;
      fighter.vy = 0;
      fighter.grappleRecoveryTicks -= 1;
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

    this.#resolveRopes(fighter);
    if (fighter.x !== oldX || fighter.y !== oldY) {
      this.#pushEvent('move', {
        fighterId: fighter.id,
        x: fighter.x,
        y: fighter.y,
        state: fighter.state,
      });
    }
  }

  #moveWithinArena(fighter: FighterState, directionX: number, directionY: number, distance: number): number {
    if (distance <= 0) return 0;
    const oldX = fighter.x;
    const oldY = fighter.y;
    fighter.x = clamp(oldX + directionX * distance, FIGHTER_RADIUS, ARENA.width - FIGHTER_RADIUS);
    fighter.y = clamp(oldY + directionY * distance, FIGHTER_RADIUS, ARENA.height - FIGHTER_RADIUS);
    return (fighter.x - oldX) * directionX + (fighter.y - oldY) * directionY;
  }

  #resolveBodyCollision(): void {
    const a = this.#state.fighters.p1;
    const b = this.#state.fighters.p2;
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
      const movedA = this.#moveWithinArena(a, -normal.x, -normal.y, half);
      const movedB = this.#moveWithinArena(b, normal.x, normal.y, half);
      let remaining = Math.max(0, overlap - movedA - movedB);
      if (remaining > 1e-9) remaining -= this.#moveWithinArena(b, normal.x, normal.y, remaining);
      if (remaining > 1e-9) this.#moveWithinArena(a, -normal.x, -normal.y, remaining);
    }

    const finalDistance = Math.hypot(b.x - a.x, b.y - a.y);
    this.#pushEvent('body-collision', {
      fighterA: a.id,
      fighterB: b.id,
      distanceBefore: initialDistance,
      distanceAfter: finalDistance,
    });
  }

  #hasActionPhase(fighter: FighterState): boolean {
    return fighter.attackStartupTicks > 0
      || fighter.attackRecoveryTicks > 0
      || fighter.attackActive
      || fighter.grappleRecoveryTicks > 0;
  }

  #canStartAction(fighter: FighterState): boolean {
    return fighter.health > 0
      && fighter.attackCooldown === 0
      && !this.#hasActionPhase(fighter)
      && fighter.hitstunTicks === 0
      && fighter.reboundTicks === 0;
  }

  #canBeGrappled(fighter: FighterState): boolean {
    return fighter.health > 0
      && !this.#hasActionPhase(fighter)
      && fighter.hitstunTicks === 0
      && fighter.reboundTicks === 0;
  }

  #isGrappleContact(attackerId: PlayerId, targetId: PlayerId): boolean {
    const attacker = this.#state.fighters[attackerId];
    const target = this.#state.fighters[targetId];
    const toTargetX = target.x - attacker.x;
    const toTargetY = target.y - attacker.y;
    const distance = Math.hypot(toTargetX, toTargetY);
    const toTarget = normalizedVector(toTargetX, toTargetY);
    const facingDot = attacker.facingX * toTarget.x + attacker.facingY * toTarget.y;
    return distance <= GRAPPLE_RANGE && facingDot >= FACING_THRESHOLD && this.#canBeGrappled(target);
  }

  #processActionStarts(): void {
    const pressed: PlayerId[] = [];

    for (const playerId of PLAYER_IDS) {
      const input = this.#inputs[playerId];
      const freshPress = input.attack && !this.#attackLatch[playerId];
      if (freshPress && this.#canStartAction(this.#state.fighters[playerId])) pressed.push(playerId);
    }

    this.#syncAttackLatches();
    if (pressed.length === 0) return;

    // Simultaneous close-range presses stay symmetric: both use the existing strike path.
    if (pressed.length === 1) {
      const attackerId = pressed[0];
      if (!attackerId) return;
      const targetId: PlayerId = attackerId === 'p1' ? 'p2' : 'p1';
      if (this.#isGrappleContact(attackerId, targetId)) {
        this.#startGrapple(attackerId, targetId);
        return;
      }
    }

    for (const playerId of pressed) this.#startStrike(playerId);
  }

  #startStrike(playerId: PlayerId): void {
    const fighter = this.#state.fighters[playerId];
    fighter.attackCooldown = ATTACK_COOLDOWN_TICKS;
    fighter.attackStartupTicks = ATTACK_STARTUP_TICKS;
    fighter.attackRecoveryTicks = 0;
    fighter.attackActive = false;
    fighter.grappleRecoveryTicks = 0;
    fighter.state = 'attack';
    fighter.vx = 0;
    fighter.vy = 0;
    this.#pushEvent('attack-start', { fighterId: playerId, startupTicks: ATTACK_STARTUP_TICKS });
  }

  #startGrapple(attackerId: PlayerId, targetId: PlayerId): void {
    const attacker = this.#state.fighters[attackerId];
    const target = this.#state.fighters[targetId];
    const defaultDirection = normalizedVector(attacker.facingX, attacker.facingY);

    attacker.attackCooldown = GRAPPLE_COOLDOWN_TICKS;
    attacker.attackStartupTicks = 0;
    attacker.attackRecoveryTicks = 0;
    attacker.attackActive = false;
    attacker.grappleRecoveryTicks = 0;
    attacker.vx = 0;
    attacker.vy = 0;
    attacker.state = 'grapple';

    target.attackStartupTicks = 0;
    target.attackRecoveryTicks = 0;
    target.attackActive = false;
    target.grappleRecoveryTicks = 0;
    target.vx = 0;
    target.vy = 0;
    target.state = 'grapple';

    this.#state.grapple = {
      attackerId,
      targetId,
      ticksRemaining: GRAPPLE_HOLD_TICKS,
      throwX: defaultDirection.x,
      throwY: defaultDirection.y,
    };

    this.#pushEvent('grapple-start', {
      attackerId,
      targetId,
      holdTicks: GRAPPLE_HOLD_TICKS,
      throwX: defaultDirection.x,
      throwY: defaultDirection.y,
    });
  }

  #advanceGrapple(): void {
    const grapple = this.#state.grapple;
    if (!grapple) return;

    const attacker = this.#state.fighters[grapple.attackerId];
    const target = this.#state.fighters[grapple.targetId];
    const input = this.#inputs[grapple.attackerId];
    const direction = normalizedVector(
      Number(input.right) - Number(input.left),
      Number(input.down) - Number(input.up),
    );

    if (direction.x !== 0 || direction.y !== 0) {
      const changed = direction.x !== grapple.throwX || direction.y !== grapple.throwY;
      grapple.throwX = direction.x;
      grapple.throwY = direction.y;
      attacker.facingX = direction.x;
      attacker.facingY = direction.y;
      if (changed) {
        this.#pushEvent('grapple-direction', {
          attackerId: grapple.attackerId,
          throwX: direction.x,
          throwY: direction.y,
        });
      }
    }

    attacker.state = 'grapple';
    target.state = 'grapple';
    attacker.vx = 0;
    attacker.vy = 0;
    target.vx = 0;
    target.vy = 0;
    if (attacker.attackCooldown > 0) attacker.attackCooldown -= 1;

    grapple.ticksRemaining -= 1;
    this.#pushEvent('grapple-tick', {
      attackerId: grapple.attackerId,
      targetId: grapple.targetId,
      remaining: grapple.ticksRemaining,
    });
    this.#syncAttackLatches();

    if (grapple.ticksRemaining === 0) this.#resolveThrow();
  }

  #resolveThrow(): void {
    const grapple = this.#state.grapple;
    if (!grapple) return;

    const attacker = this.#state.fighters[grapple.attackerId];
    const target = this.#state.fighters[grapple.targetId];
    const impactX = (attacker.x + target.x) * 0.5;
    const impactY = (attacker.y + target.y) * 0.5;

    target.health = Math.max(0, target.health - THROW_DAMAGE);
    target.vx = grapple.throwX * THROW_SPEED;
    target.vy = grapple.throwY * THROW_SPEED;
    target.hitstunTicks = THROW_HITSTUN_TICKS;
    target.reboundTicks = 0;
    target.attackStartupTicks = 0;
    target.attackRecoveryTicks = 0;
    target.attackActive = false;
    target.grappleRecoveryTicks = 0;
    target.state = 'hitstun';

    attacker.vx = 0;
    attacker.vy = 0;
    attacker.attackStartupTicks = 0;
    attacker.attackRecoveryTicks = 0;
    attacker.attackActive = false;
    attacker.grappleRecoveryTicks = GRAPPLE_RECOVERY_TICKS;
    attacker.state = 'throw';

    this.#state.grapple = null;
    this.#state.hitstopTicks = THROW_HITSTOP_TICKS;
    this.#state.impact = {
      kind: 'throw',
      attackerId: grapple.attackerId,
      targetId: grapple.targetId,
      x: impactX,
      y: impactY,
      ticksRemaining: THROW_HITSTOP_TICKS,
    };

    this.#pushEvent('throw-impact', {
      attackerId: grapple.attackerId,
      targetId: grapple.targetId,
      damage: THROW_DAMAGE,
      targetHealth: target.health,
      vx: target.vx,
      vy: target.vy,
    });
    this.#pushEvent('knockback', {
      attackerId: grapple.attackerId,
      targetId: grapple.targetId,
      vx: target.vx,
      vy: target.vy,
    });
    this.#pushEvent('hitstop-start', {
      kind: 'throw',
      attackerId: grapple.attackerId,
      targetId: grapple.targetId,
      ticks: THROW_HITSTOP_TICKS,
    });
  }

  #applyHit(attackerId: PlayerId, targetId: PlayerId): boolean {
    const attacker = this.#state.fighters[attackerId];
    const target = this.#state.fighters[targetId];
    const toTargetX = target.x - attacker.x;
    const toTargetY = target.y - attacker.y;
    const distance = Math.hypot(toTargetX, toTargetY);
    const toTarget = normalizedVector(toTargetX, toTargetY);
    const facingDot = attacker.facingX * toTarget.x + attacker.facingY * toTarget.y;

    if (distance <= ATTACK_RANGE && facingDot >= FACING_THRESHOLD) {
      target.health = Math.max(0, target.health - ATTACK_DAMAGE);
      target.vx = attacker.facingX * KNOCKBACK_SPEED;
      target.vy = attacker.facingY * KNOCKBACK_SPEED;
      target.hitstunTicks = HITSTUN_TICKS;
      target.reboundTicks = 0;
      target.attackStartupTicks = 0;
      target.attackRecoveryTicks = 0;
      target.attackActive = false;
      target.grappleRecoveryTicks = 0;
      target.state = 'hitstun';
      this.#state.hitstopTicks = HITSTOP_TICKS;
      this.#state.impact = {
        kind: 'strike',
        attackerId,
        targetId,
        x: (attacker.x + target.x) * 0.5,
        y: (attacker.y + target.y) * 0.5,
        ticksRemaining: HITSTOP_TICKS,
      };
      this.#pushEvent('attack-hit', { attackerId, targetId, damage: ATTACK_DAMAGE, targetHealth: target.health });
      this.#pushEvent('knockback', { attackerId, targetId, vx: target.vx, vy: target.vy });
      this.#pushEvent('hitstop-start', { kind: 'strike', attackerId, targetId, ticks: HITSTOP_TICKS });
      return true;
    }

    this.#pushEvent('attack-miss', { attackerId, targetId, distance, facingDot });
    return false;
  }

  #processActiveAttacks(): void {
    const attackers = PLAYER_IDS.filter((playerId) => this.#state.fighters[playerId].attackActive);
    for (const attackerId of attackers) {
      const fighter = this.#state.fighters[attackerId];
      fighter.attackActive = false;
      fighter.attackRecoveryTicks = ATTACK_RECOVERY_TICKS;
    }
    for (const attackerId of attackers) {
      const targetId: PlayerId = attackerId === 'p1' ? 'p2' : 'p1';
      this.#applyHit(attackerId, targetId);
    }
  }

  #advanceHitstop(): void {
    this.#state.hitstopTicks -= 1;
    if (this.#state.impact) this.#state.impact.ticksRemaining = this.#state.hitstopTicks;
    this.#pushEvent('hitstop-tick', { remaining: this.#state.hitstopTicks });
    this.#syncAttackLatches();
    if (this.#state.hitstopTicks === 0) this.#state.impact = null;
  }

  #resetInputs(): void {
    this.#inputs.p1 = blankInput();
    this.#inputs.p2 = blankInput();
    this.#attackLatch.p1 = false;
    this.#attackLatch.p2 = false;
  }
}

export function createGame(seed = 1): Game {
  return new Game(seed);
}
