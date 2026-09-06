import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SORT_DEFAULT,
  SORT_CREATED_ASC,
  SORT_CREATED_DESC,
  normalizeSortMode,
  sortTasksForView,
  isCreatedSort
} from '../sort-core.mjs';

const task = (id, createdAt, order) => ({ id, title:id, createdAt, order });
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

test('default preserves caller-defined normal order', () => {
  const result = sortTasksForView(tasks, SORT_DEFAULT, { defaultComparator:(a,b)=>a.order-b.order });
  assert.deepEqual(result.map(t => t.id), ['oldest','middle','newest']);
});

test('invalid persisted sort mode safely falls back to default', () => {
  assert.equal(normalizeSortMode('garbage'), SORT_DEFAULT);
  assert.equal(isCreatedSort('garbage'), false);
});

test('created sort is stable and deterministic for equal timestamps', () => {
  const equal = [task('b','2026-09-06T10:00:00.000Z',1), task('a','2026-09-06T10:00:00.000Z',0)];
  assert.deepEqual(sortTasksForView(equal, SORT_CREATED_DESC).map(t=>t.id), ['a','b']);
});
