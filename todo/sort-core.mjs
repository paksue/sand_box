export const SORT_DEFAULT = 'default';
export const SORT_CREATED_DESC = 'created-desc';
export const SORT_CREATED_ASC = 'created-asc';
export const SORT_MODES = [SORT_DEFAULT, SORT_CREATED_DESC, SORT_CREATED_ASC];

export function normalizeSortMode(value) {
  return SORT_MODES.includes(value) ? value : SORT_DEFAULT;
}

export function createdStamp(task = {}) {
  const value = task.createdAt || task.updatedAt || '';
  const stamp = Date.parse(value);
  return Number.isFinite(stamp) ? stamp : 0;
}

export function sortTasksForView(tasks = [], mode = SORT_DEFAULT, { defaultComparator } = {}) {
  const normalizedMode = normalizeSortMode(mode);
  const result = [...tasks];
  if (normalizedMode === SORT_DEFAULT) {
    return typeof defaultComparator === 'function' ? result.sort(defaultComparator) : result;
  }
  const direction = normalizedMode === SORT_CREATED_ASC ? 1 : -1;
  return result.sort((a, b) => {
    const delta = createdStamp(a) - createdStamp(b);
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
