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

test('task-first redesign keeps sync secondary in document order', async () => {
  const html = await text('index.html');
  assert.match(html, /<h1>Tasks<\/h1>/);
  assert.match(html, /<section class="panel" aria-label="Tasks">/);
  assert.ok(html.indexOf('id="taskList"') < html.indexOf('class="sync-bar"'), 'sync bar should follow the task list');
  assert.match(html, /GitHub sync and recovery controls are in Settings/);
});

test('sort UI exposes the intended lightweight ordering model', async () => {
  const source = await text('sort-ui.mjs');
  for (const label of ['Manual','Recently updated','Newest added','Oldest added']) {
    assert.match(source, new RegExp(label));
  }
  assert.match(source, /contentUpdatedAt/);
  assert.match(source, /automatic-sort/);
});

test('compatibility loader points to V3 and current UI modules', async () => {
  const loader = await text('sync-v2.js');
  assert.match(loader, /import\(['"]\.\/sync-v3\.mjs\?v=/);
  assert.match(loader, /archive-ui\.mjs\?v=20261004-2/);
  assert.match(loader, /sort-ui\.mjs\?v=20261004-2/);
});

test('V3 uses provenance state and tested core', async () => {
  const source = await text('sync-v3.mjs');
  assert.match(source, /paksue-github-source-state-v3/);
  assert.match(source, /planV3Migration/);
  assert.match(source, /shouldAutoAdoptRemote/);
  assert.match(source, /state\.pending/);
});
