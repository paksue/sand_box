import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARENA,
  ATTACK_DAMAGE,
  FIGHTER_RADIUS,
  MOVE_PER_TICK,
  ROPE_RETENTION,
  createGame,
} from '../src/simulation.js';

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

test('manual ticks move exactly and fighters remain inside arena bounds', () => {
  const game = createGame(7);
  const start = game.getState().fighters.p1;

  game.setInput('p1', { right: true });
  game.step(10);
  const moved = game.getState().fighters.p1;
  assert.equal(moved.x - start.x, MOVE_PER_TICK * 10);

  game.step(1000);
  const bounded = game.getState().fighters.p1;
  assert.ok(bounded.x >= FIGHTER_RADIUS);
  assert.ok(bounded.x <= ARENA.width - FIGHTER_RADIUS);
  assert.ok(bounded.y >= FIGHTER_RADIUS);
  assert.ok(bounded.y <= ARENA.height - FIGHTER_RADIUS);
});

test('body collision prevents fighters from occupying the same space', () => {
  const game = createGame(11);
  game.loadScenario('collision');
  game.setInput('p1', { right: true });
  game.setInput('p2', { left: true });
  game.step(12);

  const { p1, p2 } = game.getState().fighters;
  const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  assert.ok(distance >= FIGHTER_RADIUS * 2 - 1e-9);
  assert.ok(game.getEvents().some((event) => event.type === 'body-collision'));
});

test('a facing attack deals damage and creates knockback plus hitstun', () => {
  const game = createGame(12);
  game.loadScenario('attack');
  game.setInput('p1', { attack: true });
  game.step(1);

  const { p1, p2 } = game.getState().fighters;
  assert.equal(p1.state, 'attack');
  assert.equal(p2.health, 100 - ATTACK_DAMAGE);
  assert.equal(p2.state, 'hitstun');
  assert.ok(p2.vx > 0);
  assert.ok(p2.hitstunTicks > 0);
  assert.ok(game.getEvents().some((event) => event.type === 'attack-hit'));
  assert.ok(game.getEvents().some((event) => event.type === 'knockback'));
});

test('holding attack does not repeatedly retrigger the same press', () => {
  const game = createGame(13);
  game.loadScenario('attack');
  game.setInput('p1', { attack: true });
  game.step(1);
  game.step(30);

  assert.equal(game.getState().fighters.p2.health, 100 - ATTACK_DAMAGE);
  assert.equal(game.getEvents().filter((event) => event.type === 'attack-start').length, 1);
});

test('running into a rope reverses velocity with retained momentum', () => {
  const game = createGame(14);
  game.loadScenario('rope');
  game.setInput('p1', { left: true });
  game.step(3);

  const p1 = game.getState().fighters.p1;
  assert.equal(p1.x, FIGHTER_RADIUS);
  assert.equal(p1.state, 'rebound');
  assert.equal(p1.vx, MOVE_PER_TICK * ROPE_RETENTION);
  assert.ok(game.getEvents().some((event) => event.type === 'rope-rebound'));
});

test('attack knockback can carry an opponent into a rope rebound', () => {
  const game = createGame(15);
  game.loadScenario('rope-hit');
  game.setInput('p1', { attack: true });
  game.step(1);
  game.setInput('p1', {});
  game.step(4);

  const p2 = game.getState().fighters.p2;
  assert.equal(p2.x, ARENA.width - FIGHTER_RADIUS);
  assert.ok(p2.vx < 0);
  assert.ok(game.getEvents().some((event) => event.type === 'attack-hit'));
  assert.ok(game.getEvents().some((event) => event.type === 'rope-rebound' && event.fighterId === 'p2'));
});
