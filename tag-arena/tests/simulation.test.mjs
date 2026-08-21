import test from 'node:test';
import assert from 'node:assert/strict';
import { ARENA, MOVE_PER_TICK, createGame } from '../src/simulation.js';

function runScript(seed) {
  const game = createGame(seed);
  game.setInput('p1', { right: true });
  game.step(12);
  game.setInput('p1', { down: true });
  game.step(7);
  game.setInput('p1', {});
  game.step(3);
  return { state: game.getState(), events: game.getEvents() };
}

test('same seed and inputs produce identical state and events', () => {
  assert.deepEqual(runScript(48129), runScript(48129));
});

test('seed controls deterministic generated marker position', () => {
  const a = createGame(1).getState().marker;
  const b = createGame(2).getState().marker;
  assert.notDeepEqual(a, b);
});

test('manual ticks move exactly and remain inside arena bounds', () => {
  const game = createGame(7);
  const start = game.getState().fighters.p1;

  game.setInput('p1', { right: true });
  game.step(10);
  const moved = game.getState().fighters.p1;
  assert.equal(moved.x - start.x, MOVE_PER_TICK * 10);

  game.step(1000);
  const bounded = game.getState().fighters.p1;
  assert.equal(bounded.x, ARENA.width - 20);
});
