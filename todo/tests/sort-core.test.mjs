import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SORT_DEFAULT,
  SORT_UPDATED_DESC,
  SORT_CREATED_ASC,
  SORT_CREATED_DESC,
  normalizeSortMode,
  sortTasksForView,
  updatedStamp,
  isCreatedSort,
  isUpdatedSort,
  isAutomaticSort
} from '../sort-core.mjs';

const task = (id, createdAt, order, extra = {}) => ({ id, title:id, createdAt, order, ...extra });
const tasks = [
  task('middle', '2026-09-05T12:00:00.000Z', 1),
  task('newest', '2026-09-06T13:00:00.000Z', 2),
  task('oldest', '2026-09-01T08:00:00.000Z', 0)
];

test('created newest sorts descending by creation datetime', () => {
  assert.deepEqual(sortTasksForView(tasks, SORT_CREATED_DESC).map(t => t.id), ['newest','middle','oldest']);
});

test('created oldest sorts ascending by creation datetime', () => {
  assert.deepEqual(sortTasksForView(tasks, SORT_CREATED_ASC).map(t => t.id), ['oldest','middle','newest']);
});

test('recently updated sorts by contentUpdatedAt descending', () => {
  const edited = [
    task('old-but-edited', '2026-08-01T08:00:00.000Z', 2, { contentUpdatedAt:'2026-10-04T12:44:00.000Z' }),
    task('new-but-untouched', '2026-10-01T08:00:00.000Z', 0, { contentUpdatedAt:'2026-10-01T08:00:00.000Z' }),
    task('middle', '2026-09-15T08:00:00.000Z', 1, { contentUpdatedAt:'2026-09-20T08:00:00.000Z' })
  ];
  assert.deepEqual(sortTasksForView(edited, SORT_UPDATED_DESC).map(t => t.id), ['old-but-edited','new-but-untouched','middle']);
});

test('recently updated ignores manual reorder timestamps', () => {
  const reordered = [
    task('actually-edited', '2026-09-01T08:00:00.000Z', 1, {
      contentUpdatedAt:'2026-10-03T08:00:00.000Z',
      orderUpdatedAt:'2026-10-03T08:00:00.000Z'
    }),
    task('only-reordered', '2026-09-02T08:00:00.000Z', 0, {
      contentUpdatedAt:'2026-09-02T08:00:00.000Z',
      orderUpdatedAt:'2026-10-04T12:00:00.000Z'
    })
  ];
  assert.deepEqual(sortTasksForView(reordered, SORT_UPDATED_DESC).map(t => t.id), ['actually-edited','only-reordered']);
});

test('recently updated falls back to createdAt for legacy tasks', () => {
  const legacy = task('legacy', '2026-09-10T08:00:00.000Z', 0);
  assert.equal(updatedStamp(legacy), Date.parse('2026-09-10T08:00:00.000Z'));
});

test('manual preserves caller-defined normal order', () => {
  const result = sortTasksForView(tasks, SORT_DEFAULT, { defaultComparator:(a,b)=>a.order-b.order });
  assert.deepEqual(result.map(t => t.id), ['oldest','middle','newest']);
});

test('invalid persisted sort mode safely falls back to manual', () => {
  assert.equal(normalizeSortMode('garbage'), SORT_DEFAULT);
  assert.equal(isCreatedSort('garbage'), false);
  assert.equal(isUpdatedSort('garbage'), false);
  assert.equal(isAutomaticSort('garbage'), false);
});

test('automatic sort detection covers updated and creation views', () => {
  assert.equal(isAutomaticSort(SORT_UPDATED_DESC), true);
  assert.equal(isAutomaticSort(SORT_CREATED_DESC), true);
  assert.equal(isAutomaticSort(SORT_CREATED_ASC), true);
  assert.equal(isAutomaticSort(SORT_DEFAULT), false);
});

test('created sort is stable and deterministic for equal timestamps', () => {
  const equal = [task('b','2026-09-06T10:00:00.000Z',1), task('a','2026-09-06T10:00:00.000Z',0)];
  assert.deepEqual(sortTasksForView(equal, SORT_CREATED_DESC).map(t=>t.id), ['a','b']);
});
