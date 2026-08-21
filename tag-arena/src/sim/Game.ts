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
  PARTNER_RECOVERY_AMOUNT,
  PARTNER_RECOVERY_INTERVAL_TICKS,
  REBOUND_LOCK_TICKS,
  ROPE_RETENTION,
  TAG_COOLDOWN_TICKS,
  TAG_CORNERS,
  TAG_ZONE_RADIUS,
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
  RosterId,
  ScenarioName,
  TeamState,
} from './types';

const PLAYER_IDS: readonly PlayerId[] = ['p1', 'p2'];

type EventPayload = Record<string, string | number | boolean>;

function clone<T>(value: T): T {
  return structuredClone(value);
}

function blankInput(): InputState {
  return { left: false, right: false, up: false, down: false, attack: false, tag: false };
}

function normalizeInput(input: Partial<InputState> = {}): InputState {
  return {
    left: Boolean(input.left),
    right: Boolean(input.right),
    up: Boolean(input.up),
    down: Boolean(input.down),
    attack: Boolean(input.attack),
    tag: Boolean(input.tag),
  };
}

function createFighter(
  id: PlayerId,
  rosterId: RosterId,
  x: number,
  y: number,
  facingX: number,
  health = 100,
  state: FighterState['state'] = 'idle',
): FighterState {
  return {
    id,
    rosterId,
    x,
    y,
    vx: 0,
    vy: 0,
    facingX,
    facingY: 0,
    state,
    health,
    attackCooldown: 0,
    attackStartupTicks: 0,
    attackRecoveryTicks: 0,
    attackActive: false,
    grappleRecoveryTicks: 0,
    hitstunTicks: 0,
    reboundTicks: 0,
  };
}

function createDefaultFighters(): Record<PlayerId, FighterState> {
  return {
    p1: createFighter('p1', 'p1a', 180, 225, 1),
    p2: createFighter('p2', 'p2a', 620, 225, -1),
  };
}

function createDefaultPartners(): Record<PlayerId, FighterState> {
  return {
    p1: createFighter('p1', 'p1b', TAG_CORNERS.p1.x, TAG_CORNERS.p1.y, 1, 100, 'inactive'),
    p2: createFighter('p2', 'p2b', TAG_CORNERS.p2.x, TAG_CORNERS.p2.y, -1, 100, 'inactive'),
  };
}

function createDefaultTeams(): Record<PlayerId, TeamState> {
  return {
    p1: { tagCooldownTicks: 0, partnerRecoveryTicks: 0 },
    p2: { tagCooldownTicks: 0, partnerRecoveryTicks: 0 },
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

function clearTransientState(
  fighter: FighterState,
  state: FighterState['state'],
  x: number,
  y: number,
  facingX: number,
  facingY: number,
): FighterState {
  return {
    ...fighter,
    x,
    y,
    vx: 0,
    vy: 0,
    facingX,
    facingY,
    state,
    attackCooldown: 0,
    attackStartupTicks: 0,
    attackRecoveryTicks: 0,
    attackActive: false,
    grappleRecoveryTicks: 0,
    hitstunTicks: 0,
    reboundTicks: 0,
  };
}

export class Game implements GameApi {
  readonly #normalizedSeed: number;
  readonly #events: GameEvent[] = [];
  readonly #inputs: Record<PlayerId, InputState> = {
    p1: blankInput(),
    p2: blankInput(),
  };
  readonly #attackLatch: Record<PlayerId, boolean> = { p1: false, p2: false };
  readonly #tagLatch: Record<PlayerId, boolean> = { p1: false, p2: false };
  #state: GameState;

  constructor(seed = 1) {
    this.#normalizedSeed = (Number(seed) >>> 0) || 1;
    const rng = createRng(this.#normalizedSeed);
    this.#state = {
      version: 5,
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
      fighters: createDefaultFighters(),
      partners: createDefaultPartners(),
      teams: createDefaultTeams(),
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
    this.#state.fighters = createDefaultFighters();
    this.#state.partners = createDefaultPartners();
    this.#state.teams = createDefaultTeams();

    switch (name) {
      case 'baseline':
        break;
      case 'collision':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', 340, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 'p2a', 460, 225, -1);
        break;
      case 'edge-collision':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', 20, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 'p2a', 48, 225, -1);
        break;
      case 'attack':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', 350, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 'p2a', 400, 225, -1);
        break;
      case 'grapple':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', 350, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 'p2a', 390, 225, -1);
        break;
      case 'grapple-rope':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', 725, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 'p2a', 765, 225, -1);
        break;
      case 'tag-ready':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', TAG_CORNERS.p1.x, TAG_CORNERS.p1.y, 1);
        this.#state.fighters.p2 = createFighter('p2', 'p2a', 120, 380, -1);
        this.#state.partners.p1.health = 80;
        break;
      case 'tag-ready-p2':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', 680, 70, 1);
        this.#state.fighters.p2 = createFighter('p2', 'p2a', TAG_CORNERS.p2.x, TAG_CORNERS.p2.y, -1);
        this.#state.partners.p2.health = 75;
        break;
      case 'tag-recovery':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', TAG_CORNERS.p1.x, TAG_CORNERS.p1.y, 1, 60);
        this.#state.partners.p1.health = 100;
        break;
      case 'rope':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', 30, 225, -1);
        break;
      case 'rope-hit':
        this.#state.fighters.p1 = createFighter('p1', 'p1a', 700, 225, 1);
        this.#state.fighters.p2 = createFighter('p2', 'p2a', 755, 225, -1);
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

      this.#advanceTeamTimers();

      if (this.#state.grapple) {
        this.#advanceGrapple();
        continue;
      }

      this.#updateFighter(this.#state.fighters.p1, this.#inputs.p1);
      this.#updateFighter(this.#state.fighters.p2, this.#inputs.p2);
      this.#resolveBodyCollision();
      const tagged = this.#processTagStarts();
      this.#processActionStarts(tagged);
      this.#processActiveAttacks();
    }
    return clone(this.#state);
  }

  reset(seed = this.#normalizedSeed): Game {
    return new Game(seed);
  }

  #pushEvent(type: string, payload: EventPayload = {}): void {
    this.#events.push({ tick: this.#state.tick, type, ...payload });
    if (this.#events.length > 320) this.#events.shift();
  }

  #syncInputLatches(): void {
    for (const playerId of PLAYER_IDS) {
      this.#attackLatch[playerId] = this.#inputs[playerId].attack;
      this.#tagLatch[playerId] = this.#inputs[playerId].tag;
    }
  }

  #advanceTeamTimers(): void {
    for (const playerId of PLAYER_IDS) {
      const team = this.#state.teams[playerId];
      if (team.tagCooldownTicks > 0) team.tagCooldownTicks -= 1;

      team.partnerRecoveryTicks += 1;
      if (team.partnerRecoveryTicks < PARTNER_RECOVERY_INTERVAL_TICKS) continue;
      team.partnerRecoveryTicks = 0;

      const partner = this.#state.partners[playerId];
      if (partner.health <= 0 || partner.health >= 100) continue;

      const oldHealth = partner.health;
      partner.health = Math.min(100, partner.health + PARTNER_RECOVERY_AMOUNT);
      this.#pushEvent('partner-recovered', {
        playerId,
        rosterId: partner.rosterId,
        amount: partner.health - oldHealth,
        health: partner.health,
      });
    }
  }

  #isInsideTagZone(playerId: PlayerId, fighter: FighterState): boolean {
    const corner = TAG_CORNERS[playerId];
    return Math.hypot(fighter.x - corner.x, fighter.y - corner.y) <= TAG_ZONE_RADIUS;
  }

  #canTag(playerId: PlayerId): boolean {
    const active = this.#state.fighters[playerId];
    const partner = this.#state.partners[playerId];
    return this.#state.teams[playerId].tagCooldownTicks === 0
      && active.health > 0
      && partner.health > 0
      && this.#canStartAction(active)
      && this.#isInsideTagZone(playerId, active);
  }

  #performTag(playerId: PlayerId): void {
    const outgoing = this.#state.fighters[playerId];
    const incoming = this.#state.partners[playerId];
    const corner = TAG_CORNERS[playerId];
    const activeX = outgoing.x;
    const activeY = outgoing.y;
    const facingX = outgoing.facingX;
    const facingY = outgoing.facingY;
    const outgoingRosterId = outgoing.rosterId;
    const incomingRosterId = incoming.rosterId;
    const outgoingHealth = outgoing.health;
    const incomingHealth = incoming.health;

    this.#state.fighters[playerId] = clearTransientState(
      incoming,
      'idle',
      activeX,
      activeY,
      facingX,
      facingY,
    );
    this.#state.partners[playerId] = clearTransientState(
      outgoing,
      'inactive',
      corner.x,
      corner.y,
      playerId === 'p1' ? 1 : -1,
      0,
    );
    this.#state.teams[playerId].tagCooldownTicks = TAG_COOLDOWN_TICKS;
    this.#state.teams[playerId].partnerRecoveryTicks = 0;

    this.#pushEvent('tag-completed', {
      playerId,
      outgoingRosterId,
      incomingRosterId,
      outgoingHealth,
      incomingHealth,
      cooldownTicks: TAG_COOLDOWN_TICKS,
    });
  }

  #processTagStarts(): Set<PlayerId> {
    const tagged = new Set<PlayerId>();

    for (const playerId of PLAYER_IDS) {
      const input = this.#inputs[playerId];
      const freshPress = input.tag && !this.#tagLatch[playerId];
      if (freshPress && this.#canTag(playerId)) {
        this.#performTag(playerId);
        tagged.add(playerId);
      }
      this.#tagLatch[playerId] = input.tag;
    }

    return tagged;
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
        rosterId: fighter.rosterId,
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
        rosterId: fighter.rosterId,
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

  #processActionStarts(skipped: ReadonlySet<PlayerId> = new Set()): void {
    const pressed: PlayerId[] = [];

    for (const playerId of PLAYER_IDS) {
      const input = this.#inputs[playerId];
      const freshPress = input.attack && !this.#attackLatch[playerId];
      if (!skipped.has(playerId) && freshPress && this.#canStartAction(this.#state.fighters[playerId])) {
        pressed.push(playerId);
      }
    }

    for (const playerId of PLAYER_IDS) this.#attackLatch[playerId] = this.#inputs[playerId].attack;
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
    this.#pushEvent('attack-start', {
      fighterId: playerId,
      rosterId: fighter.rosterId,
      startupTicks: ATTACK_STARTUP_TICKS,
    });
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
      attackerRosterId: attacker.rosterId,
      targetId,
      targetRosterId: target.rosterId,
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
    this.#syncInputLatches();

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
      attackerRosterId: attacker.rosterId,
      targetId: grapple.targetId,
      targetRosterId: target.rosterId,
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
      this.#pushEvent('attack-hit', {
        attackerId,
        attackerRosterId: attacker.rosterId,
        targetId,
        targetRosterId: target.rosterId,
        damage: ATTACK_DAMAGE,
        targetHealth: target.health,
      });
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
    this.#syncInputLatches();
    if (this.#state.hitstopTicks === 0) this.#state.impact = null;
  }

  #resetInputs(): void {
    this.#inputs.p1 = blankInput();
    this.#inputs.p2 = blankInput();
    this.#attackLatch.p1 = false;
    this.#attackLatch.p2 = false;
    this.#tagLatch.p1 = false;
    this.#tagLatch.p2 = false;
  }
}

export function createGame(seed = 1): Game {
  return new Game(seed);
}
