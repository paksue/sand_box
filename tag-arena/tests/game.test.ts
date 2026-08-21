import { describe, expect, it } from 'vitest';
import {
  ARENA,
  ATTACK_DAMAGE,
  ATTACK_RECOVERY_TICKS,
  ATTACK_STARTUP_TICKS,
  FIGHTER_RADIUS,
  HITSTOP_TICKS,
  MOVE_PER_TICK,
  ROPE_RETENTION,
} from '../src/sim/constants';
import { Game } from '../src/sim/Game';

function reachImpact(game: Game): void {
  game.setInput('p1', { attack: true });
  game.step(1);
  game.setInput('p1', {});
  game.step(ATTACK_STARTUP_TICKS);
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

  it('uses startup, impact, exact hit-stop and resumed knockback', () => {
    const game = new Game(120);
    game.loadScenario('attack');
    game.setInput('p1', { attack: true });
    game.step(1);
    game.setInput('p1', {});
    expect(game.getState().fighters.p2.health).toBe(100);
    expect(game.getState().fighters.p1.attackStartupTicks).toBe(ATTACK_STARTUP_TICKS);

    game.step(ATTACK_STARTUP_TICKS);
    const impact = game.getState();
    expect(impact.fighters.p2.health).toBe(100 - ATTACK_DAMAGE);
    expect(impact.fighters.p1.attackRecoveryTicks).toBe(ATTACK_RECOVERY_TICKS);
    expect(impact.hitstopTicks).toBe(HITSTOP_TICKS);

    const impactX = impact.fighters.p2.x;
    const impactHitstun = impact.fighters.p2.hitstunTicks;
    game.step(HITSTOP_TICKS);
    const frozen = game.getState();
    expect(frozen.fighters.p2.x).toBe(impactX);
    expect(frozen.fighters.p2.hitstunTicks).toBe(impactHitstun);

    game.step(1);
    expect(game.getState().fighters.p2.x).toBe(impactX + 10);
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
