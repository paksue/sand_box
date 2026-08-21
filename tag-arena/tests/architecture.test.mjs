import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const simulation = await readFile(new URL('../src/simulation.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');

test('simulation is independent of browser and wall-clock APIs', () => {
  for (const forbidden of ['document.', 'window.', 'requestAnimationFrame', 'performance.now']) {
    assert.equal(simulation.includes(forbidden), false, `simulation contains forbidden browser API: ${forbidden}`);
  }
});

test('simulation does not use Math.random', () => {
  assert.equal(simulation.includes('Math.random'), false);
});

test('renderer/controller imports simulation instead of redefining movement truth', () => {
  assert.match(app, /from ['"]\.\/simulation\.js['"]/);
  assert.equal(app.includes('MOVE_PER_TICK ='), false);
  assert.equal(app.includes('function updateFighter'), false);
});
