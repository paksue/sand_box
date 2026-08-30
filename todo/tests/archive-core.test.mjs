import test from 'node:test';
import assert from 'node:assert/strict';
import { splitTaskBuckets, restoreTask, archiveLabel } from '../archive-core.mjs';

const task = (id, extra={}) => ({
  id, title:id, details:'', done:false, deleted:false, order:0,
  createdAt:'2026-08-01T00:00:00.000Z', doneUpdatedAt:'', deletedUpdatedAt:'', ...extra
});

test('active view contains only unfinished non-archived tasks', () => {
  const result = splitTaskBuckets([
    task('active'),
    task('done',{done:true,doneUpdatedAt:'2026-08-02T00:00:00.000Z'}),
    task('archived',{deleted:true,deletedUpdatedAt:'2026-08-03T00:00:00.000Z'})
  ]);
  assert.deepEqual(result.active.map(t=>t.id), ['active']);
  assert.deepEqual(result.completed.map(t=>t.id), ['done']);
  assert.deepEqual(result.archived.map(t=>t.id), ['archived']);
  assert.equal(result.archive.length, 2);
});

test('done wins classification when an old task is both done and deleted', () => {
  const result = splitTaskBuckets([task('old',{done:true,deleted:true,doneUpdatedAt:'2026-08-04T00:00:00.000Z',deletedUpdatedAt:'2026-08-03T00:00:00.000Z'})]);
  assert.deepEqual(result.completed.map(t=>t.id), ['old']);
  assert.equal(result.archived.length, 0);
  assert.equal(archiveLabel(result.completed[0]), 'Completed');
});

test('archive groups sort newest first', () => {
  const result = splitTaskBuckets([
    task('older',{done:true,doneUpdatedAt:'2026-08-02T00:00:00.000Z'}),
    task('newer',{done:true,doneUpdatedAt:'2026-08-05T00:00:00.000Z'})
  ]);
  assert.deepEqual(result.completed.map(t=>t.id), ['newer','older']);
});

test('restore clears both completion and archive tombstone', () => {
  const restored = restoreTask(task('x',{done:true,deleted:true}), '2026-08-29T20:00:00.000Z');
  assert.equal(restored.done, false);
  assert.equal(restored.deleted, false);
  assert.equal(restored.doneUpdatedAt, '2026-08-29T20:00:00.000Z');
  assert.equal(restored.deletedUpdatedAt, '2026-08-29T20:00:00.000Z');
  assert.equal(archiveLabel(restored), 'Active');
});
