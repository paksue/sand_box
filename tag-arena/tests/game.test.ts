import { describe, expect, it } from 'vitest';
import {
  ARENA,
  ATTACK_DAMAGE,
  ATTACK_RECOVERY_TICKS,
  ATTACK_STARTUP_TICKS,
  FIGHTER_RADIUS,
  GRAPPLE_HOLD_TICKS,
  GRAPPLE_RECOVERY_TICKS,
  HITSTOP_TICKS,
  MOVE_PER_TICK,
  PARTNER_RECOVERY_INTERVAL_TICKS,
  ROPE_RETENTION,
  TAG_COOLDOWN_TICKS,
  TAG_CORNERS,
  THROW_DAMAGE,
  THROW_HITSTOP_TICKS,
  THROW_HITSTUN_TICKS,
  THROW_SPEED,
} from '../src/sim/constants';
import { Game } from '../src/sim/Game';
import type { GameState, ScenarioName } from '../src/sim/types';

function reachImpact(game: Game): void {
  game.setInput('p1', { attack: true });
  game.step(1);
  game.setInput('p1', {});
  game.step(ATTACK_STARTUP_TICKS);
}

function startGrapple(game: Game, scenario: Extract<ScenarioName, 'grapple' | 'grapple-rope'> = 'grapple'): GameState {
  game.loadScenario(scenario);
  game.setInput('p1', { attack: true });
  const started = game.step(1);
  game.setInput('p1', {});
  return started;
}

describe('typed simulation', () => {
  it('moves exactly on fixed ticks', () => {
    const game = new Game(7);
    const start = game.getState().fighters.p1.x;
    game.setInput('p1', { right: true });
    game.step(10);
    expect(game.getState().fighters.p1.x - start).toBe(MOVE_PER_TICK * 10);
  });

  it('keeps body separation even against a rope', () => {
    const game = new Game(111);
    game.loadScenario('edge-collision');
    game.step(1);
    const { p1, p2 } = game.getState().fighters;
    expect(p1.x).toBe(FIGHTER_RADIUS);
    expect(Math.hypot(p2.x - p1.x, p2.y - p1.y)).toBeGreaterThanOrEqual(FIGHTER_RADIUS * 2 - 1e-9);
  });

  it('keeps the verified strike path unchanged at normal attack distance', () => {
    const game = new Game(120);
    game.loadScenario('attack');
    game.setInput('p1', { attack: true });
    game.step(1);
    game.setInput('p1', {});

    const pressed = game.getState();
    expect(pressed.grapple).toBeNull();
    expect(pressed.fighters.p2.health).toBe(100);
    expect(pressed.fighters.p1.attackStartupTicks).toBe(ATTACK_STARTUP_TICKS);
    expect(game.getEvents().filter((event) => event.type === 'attack-start')).toHaveLength(1);

    game.step(ATTACK_STARTUP_TICKS);
    const impact = game.getState();
    expect(impact.fighters.p2.health).toBe(100 - ATTACK_DAMAGE);
    expect(impact.fighters.p1.attackRecoveryTicks).toBe(ATTACK_RECOVERY_TICKS);
    expect(impact.hitstopTicks).toBe(HITSTOP_TICKS);
    expect(impact.impact?.kind).toBe('strike');

    const impactX = impact.fighters.p2.x;
    const impactHitstun = impact.fighters.p2.hitstunTicks;
    game.step(HITSTOP_TICKS);
    const frozen = game.getState();
    expect(frozen.fighters.p2.x).toBe(impactX);
    expect(frozen.fighters.p2.hitstunTicks).toBe(impactHitstun);

    game.step(1);
    expect(game.getState().fighters.p2.x).toBe(impactX + 10);
  });

  it('starts a grapple immediately at body contact without immediate damage', () => {
    const game = new Game(200);
    const started = startGrapple(game);

    expect(started.tick).toBe(1);
    expect(started.grapple).toEqual({
      attackerId: 'p1',
      targetId: 'p2',
      ticksRemaining: GRAPPLE_HOLD_TICKS,
      throwX: 1,
      throwY: 0,
    });
    expect(started.fighters.p1.state).toBe('grapple');
    expect(started.fighters.p2.state).toBe('grapple');
    expect(started.fighters.p2.health).toBe(100);
    expect(game.getEvents().filter((event) => event.type === 'grapple-start')).toHaveLength(1);
    expect(game.getEvents().filter((event) => event.type === 'attack-start')).toHaveLength(0);
  });

  it('locks positions during the six-tick clinch and uses movement only to choose throw direction', () => {
    const game = new Game(201);
    const started = startGrapple(game);
    const p1Start = { x: started.fighters.p1.x, y: started.fighters.p1.y };
    const p2Start = { x: started.fighters.p2.x, y: started.fighters.p2.y };

    game.setInput('p1', { down: true });
    const directed = game.step(1);
    expect(directed.grapple?.ticksRemaining).toBe(GRAPPLE_HOLD_TICKS - 1);
    expect(directed.grapple?.throwX).toBe(0);
    expect(directed.grapple?.throwY).toBe(1);
    expect({ x: directed.fighters.p1.x, y: directed.fighters.p1.y }).toEqual(p1Start);
    expect({ x: directed.fighters.p2.x, y: directed.fighters.p2.y }).toEqual(p2Start);

    game.setInput('p1', {});
    const impact = game.step(GRAPPLE_HOLD_TICKS - 1);
    expect(impact.tick).toBe(1 + GRAPPLE_HOLD_TICKS);
    expect(impact.grapple).toBeNull();
    expect({ x: impact.fighters.p1.x, y: impact.fighters.p1.y }).toEqual(p1Start);
    expect({ x: impact.fighters.p2.x, y: impact.fighters.p2.y }).toEqual(p2Start);
    expect(impact.fighters.p2.health).toBe(100 - THROW_DAMAGE);
    expect(impact.fighters.p2.vx).toBe(0);
    expect(impact.fighters.p2.vy).toBe(THROW_SPEED);
    expect(impact.fighters.p2.hitstunTicks).toBe(THROW_HITSTUN_TICKS);
    expect(impact.fighters.p1.grappleRecoveryTicks).toBe(GRAPPLE_RECOVERY_TICKS);
    expect(impact.hitstopTicks).toBe(THROW_HITSTOP_TICKS);
    expect(impact.impact?.kind).toBe('throw');
    expect(game.getEvents().some((event) => event.type === 'grapple-direction')).toBe(true);
    expect(game.getEvents().some((event) => event.type === 'throw-impact')).toBe(true);
  });

  it('freezes throw momentum and recovery for exactly four impact ticks, then resumes', () => {
    const game = new Game(202);
    startGrapple(game);
    game.setInput('p1', { down: true });
    game.step(GRAPPLE_HOLD_TICKS);
    const impact = game.getState();

    const targetY = impact.fighters.p2.y;
    const targetHitstun = impact.fighters.p2.hitstunTicks;
    const attackerRecovery = impact.fighters.p1.grappleRecoveryTicks;

    game.setInput('p1', {});
    game.step(THROW_HITSTOP_TICKS);
    const frozen = game.getState();
    expect(frozen.hitstopTicks).toBe(0);
    expect(frozen.fighters.p2.y).toBe(targetY);
    expect(frozen.fighters.p2.hitstunTicks).toBe(targetHitstun);
    expect(frozen.fighters.p1.grappleRecoveryTicks).toBe(attackerRecovery);

    game.step(1);
    const resumed = game.getState();
    expect(resumed.fighters.p2.y).toBe(targetY + THROW_SPEED);
    expect(resumed.fighters.p2.hitstunTicks).toBe(targetHitstun - 1);
    expect(resumed.fighters.p1.grappleRecoveryTicks).toBe(attackerRecovery - 1);
  });

  it('reuses existing rope physics after a rightward throw', () => {
    const game = new Game(203);
    startGrapple(game, 'grapple-rope');
    game.step(GRAPPLE_HOLD_TICKS);
    game.step(THROW_HITSTOP_TICKS);
    game.step(2);

    const p2 = game.getState().fighters.p2;
    expect(p2.x).toBe(ARENA.width - FIGHTER_RADIUS);
    expect(p2.vx).toBeLessThan(0);
    expect(game.getEvents().some((event) => event.type === 'rope-rebound' && event.fighterId === 'p2')).toBe(true);
  });

  it('keeps simultaneous close-range Action presses symmetric by starting two strikes', () => {
    const game = new Game(204);
    game.loadScenario('grapple');
    game.setInput('p1', { attack: true });
    game.setInput('p2', { attack: true });
    const state = game.step(1);

    expect(state.grapple).toBeNull();
    expect(state.fighters.p1.attackStartupTicks).toBe(ATTACK_STARTUP_TICKS);
    expect(state.fighters.p2.attackStartupTicks).toBe(ATTACK_STARTUP_TICKS);
    expect(game.getEvents().filter((event) => event.type === 'attack-start')).toHaveLength(2);
    expect(game.getEvents().filter((event) => event.type === 'grapple-start')).toHaveLength(0);
  });

  it('ignores Tag outside the home zone', () => {
    const game = new Game(300);
    const before = game.getState();
    game.setInput('p1', { tag: true });
    const after = game.step(1);

    expect(after.fighters.p1.rosterId).toBe(before.fighters.p1.rosterId);
    expect(after.partners.p1.rosterId).toBe(before.partners.p1.rosterId);
    expect(after.teams.p1.tagCooldownTicks).toBe(0);
    expect(game.getEvents().filter((event) => event.type === 'tag-completed')).toHaveLength(0);
  });

  it('swaps persistent wrestlers at the home corner and preserves wrestler health', () => {
    const game = new Game(301);
    game.loadScenario('tag-ready');
    const before = game.getState();
    game.setInput('p1', { tag: true });
    const tagged = game.step(1);

    expect(before.fighters.p1.rosterId).toBe('p1a');
    expect(before.fighters.p1.health).toBe(100);
    expect(before.partners.p1.rosterId).toBe('p1b');
    expect(before.partners.p1.health).toBe(80);

    expect(tagged.fighters.p1.rosterId).toBe('p1b');
    expect(tagged.fighters.p1.health).toBe(80);
    expect(tagged.fighters.p1.x).toBe(before.fighters.p1.x);
    expect(tagged.fighters.p1.y).toBe(before.fighters.p1.y);
    expect(tagged.fighters.p1.state).toBe('idle');
    expect(tagged.fighters.p1.vx).toBe(0);
    expect(tagged.fighters.p1.vy).toBe(0);

    expect(tagged.partners.p1.rosterId).toBe('p1a');
    expect(tagged.partners.p1.health).toBe(100);
    expect(tagged.partners.p1.x).toBe(TAG_CORNERS.p1.x);
    expect(tagged.partners.p1.y).toBe(TAG_CORNERS.p1.y);
    expect(tagged.partners.p1.state).toBe('inactive');
    expect(tagged.teams.p1.tagCooldownTicks).toBe(TAG_COOLDOWN_TICKS);

    const event = game.getEvents().find((entry) => entry.type === 'tag-completed');
    expect(event?.outgoingRosterId).toBe('p1a');
    expect(event?.incomingRosterId).toBe('p1b');
  });

  it('locks immediate tag-back until exactly 120 eligible ticks have elapsed', () => {
    const game = new Game(302);
    game.loadScenario('tag-ready');
    game.setInput('p1', { tag: true });
    game.step(1);
    game.setInput('p1', {});

    game.step(1);
    game.setInput('p1', { tag: true });
    const locked = game.step(1);
    expect(locked.fighters.p1.rosterId).toBe('p1b');
    expect(locked.teams.p1.tagCooldownTicks).toBe(TAG_COOLDOWN_TICKS - 2);

    game.setInput('p1', {});
    game.step(TAG_COOLDOWN_TICKS - 2);
    expect(game.getState().teams.p1.tagCooldownTicks).toBe(0);

    game.setInput('p1', { tag: true });
    const returned = game.step(1);
    expect(returned.fighters.p1.rosterId).toBe('p1a');
    expect(returned.partners.p1.rosterId).toBe('p1b');
    expect(returned.teams.p1.tagCooldownTicks).toBe(TAG_COOLDOWN_TICKS);
  });

  it('recovers exactly one inactive HP after 60 eligible ticks', () => {
    const game = new Game(303);
    game.loadScenario('tag-recovery');
    game.setInput('p1', { tag: true });
    const tagged = game.step(1);
    expect(tagged.partners.p1.rosterId).toBe('p1a');
    expect(tagged.partners.p1.health).toBe(60);

    game.setInput('p1', {});
    game.step(PARTNER_RECOVERY_INTERVAL_TICKS - 1);
    expect(game.getState().partners.p1.health).toBe(60);

    const recovered = game.step(1);
    expect(recovered.partners.p1.health).toBe(61);
    expect(game.getEvents().some(
      (event) => event.type === 'partner-recovered' && event.rosterId === 'p1a' && event.health === 61,
    )).toBe(true);
  });

  it('freezes tag cooldown and partner recovery counters during global hit-stop', () => {
    const game = new Game(304);
    game.loadScenario('tag-ready');
    game.setInput('p1', { tag: true });
    game.step(1);
    game.setInput('p1', { attack: true });
    game.step(1);
    game.setInput('p1', {});
    game.step(ATTACK_STARTUP_TICKS);

    const impact = game.getState();
    expect(impact.hitstopTicks).toBe(HITSTOP_TICKS);
    const cooldown = impact.teams.p1.tagCooldownTicks;
    const recovery = impact.teams.p1.partnerRecoveryTicks;

    game.step(HITSTOP_TICKS);
    const afterPause = game.getState();
    expect(afterPause.teams.p1.tagCooldownTicks).toBe(cooldown);
    expect(afterPause.teams.p1.partnerRecoveryTicks).toBe(recovery);
  });

  it('gives Tag priority over Action on the same eligible tick', () => {
    const game = new Game(305);
    game.loadScenario('tag-ready');
    game.setInput('p1', { tag: true, attack: true });
    const state = game.step(1);

    expect(state.fighters.p1.rosterId).toBe('p1b');
    expect(state.grapple).toBeNull();
    expect(state.fighters.p1.attackStartupTicks).toBe(0);
    expect(game.getEvents().filter((event) => event.type === 'tag-completed')).toHaveLength(1);
    expect(game.getEvents().filter((event) => event.type === 'attack-start' && event.fighterId === 'p1')).toHaveLength(0);
    expect(game.getEvents().filter((event) => event.type === 'grapple-start' && event.attackerId === 'p1')).toHaveLength(0);
  });

  it('provides symmetric P2 tagging', () => {
    const game = new Game(306);
    game.loadScenario('tag-ready-p2');
    game.setInput('p2', { tag: true });
    const state = game.step(1);

    expect(state.fighters.p2.rosterId).toBe('p2b');
    expect(state.fighters.p2.health).toBe(75);
    expect(state.partners.p2.rosterId).toBe('p2a');
    expect(state.partners.p2.health).toBe(100);
    expect(state.partners.p2.x).toBe(TAG_CORNERS.p2.x);
    expect(state.partners.p2.y).toBe(TAG_CORNERS.p2.y);
    expect(state.teams.p2.tagCooldownTicks).toBe(TAG_COOLDOWN_TICKS);
  });

  it('does not retrigger a held attack', () => {
    const game = new Game(13);
    game.loadScenario('attack');
    game.setInput('p1', { attack: true });
    game.step(1 + ATTACK_STARTUP_TICKS + HITSTOP_TICKS + 40);
    expect(game.getState().fighters.p2.health).toBe(100 - ATTACK_DAMAGE);
    expect(game.getEvents().filter((event) => event.type === 'attack-start')).toHaveLength(1);
  });

  it('retains deterministic rope momentum', () => {
    const game = new Game(14);
    game.loadScenario('rope');
    game.setInput('p1', { left: true });
    game.step(3);
    const p1 = game.getState().fighters.p1;
    expect(p1.x).toBe(FIGHTER_RADIUS);
    expect(p1.vx).toBe(MOVE_PER_TICK * ROPE_RETENTION);
  });

  it('supports hit-stop -> knockback -> rope rebound', () => {
    const game = new Game(15);
    game.loadScenario('rope-hit');
    reachImpact(game);
    game.step(HITSTOP_TICKS);
    game.step(4);
    const p2 = game.getState().fighters.p2;
    expect(p2.x).toBe(ARENA.width - FIGHTER_RADIUS);
    expect(p2.vx).toBeLessThan(0);
    expect(game.getEvents().some((event) => event.type === 'rope-rebound' && event.fighterId === 'p2')).toBe(true);
  });
});
