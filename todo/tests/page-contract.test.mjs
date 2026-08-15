import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function text(name) {
  return readFile(new URL(name, root), 'utf8');
}

test('todo page keeps the controls V3 depends on', async () => {
  const html = await text('index.html');
  for (const id of ['taskForm','newTask','taskList','pullButton','pushButton','syncStatus','syncMessage','syncTime','clearCompleted','saveTokenButton','clearTokenButton']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  }
});

test('compatibility loader points to V3', async () => {
  const loader = await text('sync-v2.js');
  assert.match(loader, /import\(['"]\.\/sync-v3\.mjs\?v=/);
});

test('V3 uses provenance state and tested core', async () => {
  const source = await text('sync-v3.mjs');
  assert.match(source, /paksue-github-source-state-v3/);
  assert.match(source, /planV3Migration/);
  assert.match(source, /shouldAutoAdoptRemote/);
  assert.match(source, /state\.pending/);
});
