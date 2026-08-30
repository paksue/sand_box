export const stampNumber = value => Number.isFinite(Date.parse(value || '')) ? Date.parse(value) : 0;

export function eventStamp(task = {}) {
  if (task.done) return task.doneUpdatedAt || task.updatedAt || task.createdAt || '';
  if (task.deleted) return task.deletedUpdatedAt || task.updatedAt || task.createdAt || '';
  return task.updatedAt || task.createdAt || '';
}

export function splitTaskBuckets(tasks = []) {
  const active = [];
  const completed = [];
  const archived = [];

  for (const task of tasks) {
    if (!task || typeof task !== 'object') continue;
    if (task.done) completed.push(task);
    else if (task.deleted) archived.push(task);
    else active.push(task);
  }

  const newestFirst = (a, b) => stampNumber(eventStamp(b)) - stampNumber(eventStamp(a));
  completed.sort(newestFirst);
  archived.sort(newestFirst);
  active.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

  return { active, completed, archived, archive:[...completed, ...archived] };
}

export function restoreTask(task, now = new Date().toISOString()) {
  const restored = { ...task };
  if (restored.done) {
    restored.done = false;
    restored.doneUpdatedAt = now;
  }
  if (restored.deleted) {
    restored.deleted = false;
    restored.deletedUpdatedAt = now;
  }
  return restored;
}

export function archiveLabel(task) {
  return task?.done ? 'Completed' : task?.deleted ? 'Archived' : 'Active';
}
