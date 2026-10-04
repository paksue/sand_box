export const SORT_DEFAULT = 'default';
export const SORT_UPDATED_DESC = 'updated-desc';
export const SORT_CREATED_DESC = 'created-desc';
export const SORT_CREATED_ASC = 'created-asc';
export const SORT_MODES = [SORT_DEFAULT, SORT_UPDATED_DESC, SORT_CREATED_DESC, SORT_CREATED_ASC];

export function normalizeSortMode(value) {
  return SORT_MODES.includes(value) ? value : SORT_DEFAULT;
}

export function createdStamp(task = {}) {
  const value = task.createdAt || task.updatedAt || '';
  const stamp = Date.parse(value);
  return Number.isFinite(stamp) ? stamp : 0;
}

export function updatedStamp(task = {}) {
  const value = task.contentUpdatedAt || task.createdAt || task.updatedAt || '';
  const stamp = Date.parse(value);
  return Number.isFinite(stamp) ? stamp : 0;
}

export function sortTasksForView(tasks = [], mode = SORT_DEFAULT, { defaultComparator } = {}) {
  const normalizedMode = normalizeSortMode(mode);
  const result = [...tasks];
  if (normalizedMode === SORT_DEFAULT) {
    return typeof defaultComparator === 'function' ? result.sort(defaultComparator) : result;
  }

  const stampFor = normalizedMode === SORT_UPDATED_DESC ? updatedStamp : createdStamp;
  const direction = normalizedMode === SORT_CREATED_ASC ? 1 : -1;

  return result.sort((a, b) => {
    const delta = stampFor(a) - stampFor(b);
    if (delta) return delta * direction;
    const orderDelta = Number(a?.order || 0) - Number(b?.order || 0);
    if (orderDelta) return orderDelta;
    return String(a?.id || '').localeCompare(String(b?.id || ''));
  });
}

export function isCreatedSort(mode) {
  const normalizedMode = normalizeSortMode(mode);
  return normalizedMode === SORT_CREATED_ASC || normalizedMode === SORT_CREATED_DESC;
}

export function isUpdatedSort(mode) {
  return normalizeSortMode(mode) === SORT_UPDATED_DESC;
}

export function isAutomaticSort(mode) {
  return isUpdatedSort(mode) || isCreatedSort(mode);
}
