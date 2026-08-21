import { describe, expect, it } from 'vitest';
import { Game } from '../src/sim/Game';
// Legacy JS is intentionally retained as the verified Phase-1 behavior oracle during migration.
// @ts-expect-error legacy module intentionally has no TypeScript declarations
import { createGame as createLegacyGame } from '../src/simulation.js';
import type { InputState, PlayerId, ScenarioName } from '../src/sim/types';

type CompatibleGame = {
  getState(): unknown;
  getEvents(): unknown;
  setInput(playerId: PlayerId, input: Partial<InputState>): void;
  loadScenario(name: ScenarioName): unknown;
  step(ticks?: number): unknown;
};

function expectEquivalent(modern: CompatibleGame, legacy: CompatibleGame): void {
  expect(modern.getState()).toEqual(legacy.getState());
  expect(modern.getEvents()).toEqual(legacy.getEvents());
}

function both(seed: number): { modern: CompatibleGame; legacy: CompatibleGame } {
  return { modern: new Game(seed), legacy: createLegacyGame(seed) as CompatibleGame };
}

function input(pair: ReturnType<typeof both>, playerId: PlayerId, value: Partial<InputState>): void {
  pair.modern.setInput(playerId, value);
  pair.legacy.setInput(playerId, value);
}

function step(pair: ReturnType<typeof both>, ticks = 1): void {
  pair.modern.step(ticks);
  pair.legacy.step(ticks);
  expectEquivalent(pair.modern, pair.legacy);
}

function scenario(pair: ReturnType<typeof both>, name: ScenarioName): void {
  pair.modern.loadScenario(name);
  pair.legacy.loadScenario(name);
  expectEquivalent(pair.modern, pair.legacy);
}

describe('production TypeScript simulation equivalence', () => {
  it.each([1, 7, 48129, 0xffffffff])('matches initial seeded state for seed %s', (seed) => {
    const pair = both(seed);
    expectEquivalent(pair.modern, pair.legacy);
  });

  it('matches movement and collision tick-for-tick', () => {
    const pair = both(48129);
    input(pair, 'p1', { right: true });
    step(pair, 12);
    scenario(pair, 'collision');
    input(pair, 'p1', { right: true });
    input(pair, 'p2', { left: true });
    step(pair, 12);
    scenario(pair, 'edge-collision');
    step(pair, 1);
  });

  it('matches startup, impact, hit-stop freeze, recovery and resumed knockback', () => {
    const pair = both(19);
    scenario(pair, 'attack');
    input(pair, 'p1', { attack: true });
    step(pair, 1);
    input(pair, 'p1', {});
    step(pair, 1);
    step(pair, 1);
    step(pair, 3);
    step(pair, 1);
    step(pair, 8);
  });

  it('matches rope rebound and attack-to-rope compound behavior', () => {
    const pair = both(29);
    scenario(pair, 'rope');
    input(pair, 'p1', { left: true });
    step(pair, 3);

    scenario(pair, 'rope-hit');
    input(pair, 'p1', { attack: true });
    step(pair, 3);
    input(pair, 'p1', {});
    step(pair, 3);
    step(pair, 4);
  });
});
