import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function text(name) {
  return readFile(new URL(name, root), 'utf8');
}

test('sections 1-7: task-first hierarchy, stable capture, views, and compact ordering control', async () => {
  const html = await text('index.html');
  const archive = await text('archive-ui.mjs');
  const sort = await text('sort-ui.mjs');

  assert.match(html, /<h1>Tasks<\/h1>/);
  assert.doesNotMatch(html, /<h1>Today<\/h1>/);
  assert.ok(html.indexOf('id="taskForm"') < html.indexOf('id="taskList"'));
  assert.match(html, /add-task-icon[^>]*aria-hidden="true">＋/);
  assert.match(archive, /data-view="active"/);
  assert.match(archive, /data-view="archive"/);
  assert.doesNotMatch(archive, /form\.hidden\s*=\s*view\s*===\s*['"]archive['"]/);
  assert.match(sort, /task-sort-button/);
  assert.match(sort, /aria-haspopup="menu"/);
  assert.doesNotMatch(sort, /<select/i);
});

test('sections 8-14: exact ordering model, persistence, automatic-mode metadata, and relative time', async () => {
  const core = await text('sort-core.mjs');
  const sort = await text('sort-ui.mjs');

  for (const label of ['Manual','Recently updated','Newest added','Oldest added']) {
    assert.match(sort, new RegExp(label));
  }
  assert.match(core, /contentUpdatedAt\s*\|\|\s*task\.createdAt/);
  assert.doesNotMatch(core, /orderUpdatedAt[^\n]*updatedStamp/);
  assert.match(sort, /localStorage\.setItem\(SORT_KEY, sortMode\)/);
  assert.match(sort, /automatic-sort/);
  assert.match(sort, /drag-handle\{display:none!important/);
  assert.match(sort, /task-sort-meta/);
  assert.match(sort, /Updated just now|\$\{verb\} just now/);
  assert.match(sort, /min ago/);
  assert.match(sort, /yesterday/);
});

test('sections 15-19: rows, staged editing, completion/archive, and contextual task actions', async () => {
  const html = await text('index.html');
  const archive = await text('archive-ui.mjs');

  assert.match(html, /\.check \{[^}]*width:44px[^}]*height:44px/s);
  assert.match(html, /\.drag-handle \{[^}]*width:44px[^}]*height:44px/s);
  assert.match(html, /\.delete \{[^}]*width:44px[^}]*height:44px/s);
  assert.match(html, /const changed=nextTitle!==task\.title\|\|nextDetails!==task\.details/);
  assert.match(html, /if\(changed\)\{[\s\S]*task\.contentUpdatedAt=nowStamp\(\)/);
  assert.doesNotMatch(html, /title\.addEventListener\(['"]input['"][\s\S]{0,180}contentUpdatedAt/);
  assert.doesNotMatch(html, /details\.addEventListener\(['"]input['"][\s\S]{0,180}contentUpdatedAt/);
  assert.match(html, /cancelEditor=\(\)=>\{editingTaskId=null;render\(\);\}/);
  assert.match(archive, /Completed — moved to Archive/);
  assert.match(archive, /Archive task/);
  assert.doesNotMatch(archive, /cancel\.textContent\s*=\s*['"]Cancel['"]/);
  assert.match(archive, /↩ Restore/);
});

test('sections 20-21: synchronization is secondary and ambiguous progress UI is removed', async () => {
  const html = await text('index.html');
  const sync = await text('sync-v3.mjs');

  assert.ok(html.indexOf('id="taskList"') < html.indexOf('class="sync-bar"'));
  assert.match(html, /GitHub sync and recovery controls are in Settings/);
  assert.doesNotMatch(html, /class="progress-track"/);
  assert.doesNotMatch(html, /id="progress"/);
  assert.doesNotMatch(html, /id="count"/);
  assert.match(sync, /setStatus\('✓ Synced','success',relativeSyncTime/);
  assert.match(sync, /setStatus\('Sync problem','error'/);
  assert.doesNotMatch(sync, /document\.body\.append\(floating\)/);
});

test('sections 22-26: visual restraint, density, responsive behavior, and accessibility contracts', async () => {
  const html = await text('index.html');
  const archive = await text('archive-ui.mjs');
  const sort = await text('sort-ui.mjs');

  assert.match(html, /width:min\(100%,680px\)/);
  assert.match(html, /min-height:62px/);
  assert.match(html, /@media \(max-width:500px\)[\s\S]*add-task-label\{display:none\}[\s\S]*add-task-icon\{display:inline\}/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(archive, /task-view-tab\{[^}]*min-height:44px/s);
  assert.match(archive, /task-action-menu button\{[^}]*min-height:44px/s);
  assert.match(archive, /archive-toast button\{[^}]*min-height:44px/s);
  assert.match(sort, /task-sort-button\{[^}]*min-height:44px/s);
  assert.match(sort, /task-sort-option\{[^}]*min-height:44px/s);
});

test('sections 27-29: empty states are explicit and search remains intentionally out of scope', async () => {
  const html = await text('index.html');
  const archive = await text('archive-ui.mjs');

  assert.match(html, /title\.textContent='All clear\.'/);
  assert.match(html, /Nothing active right now\. Completed work is waiting in Archive\./);
  assert.match(archive, /title\.textContent = 'Archive is empty\.'/);
  assert.match(archive, /Completed and archived tasks will appear here\./);
  assert.doesNotMatch(html, /id=["']search/i);
});

test('sections 30-33: scope stays lightweight and implementation contracts remain explicit', async () => {
  const html = await text('index.html');
  const sort = await text('sort-ui.mjs');

  for (const unwanted of ['priority-select','due-date','project-picker','tag-picker','calendar-picker','ai-rank']) {
    assert.doesNotMatch(html, new RegExp(unwanted, 'i'));
  }
  assert.match(sort, /sortTasksForView/);
  assert.match(sort, /isAutomaticSort/);
  assert.match(html, /GitHub sync and recovery controls are in Settings/);
});
