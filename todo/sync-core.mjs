export const clone = value => JSON.parse(JSON.stringify(value));
export const stampNumber = value => Number.isFinite(Date.parse(value || '')) ? Date.parse(value) : 0;

export function normalizeTask(task, index = 0, now = '1970-01-01T00:00:00.000Z') {
  const source = task && typeof task === 'object' ? task : {};
  const created = source.createdAt || source.updatedAt || now;
  return {
    id: String(source.id || `task-${index}`),
    title: String(source.title || source.text || 'Untitled task').trim() || 'Untitled task',
    details: String(source.details || '').trim(),
    done: Boolean(source.done),
    deleted: Boolean(source.deleted),
    order: Number.isFinite(Number(source.order)) ? Number(source.order) : index,
    createdAt: created,
    contentUpdatedAt: source.contentUpdatedAt || source.updatedAt || created,
    doneUpdatedAt: source.doneUpdatedAt || source.updatedAt || created,
    orderUpdatedAt: source.orderUpdatedAt || source.updatedAt || created,
    deletedUpdatedAt: source.deletedUpdatedAt || (source.deleted ? source.updatedAt || created : '')
  };
}

export function canonical(task) {
  if (!task) return null;
  return { id:task.id, title:task.title, details:task.details, done:Boolean(task.done), deleted:Boolean(task.deleted), order:Number(task.order) };
}

export function sameTask(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  const left = canonical(a), right = canonical(b);
  return Object.keys(left).every(key => left[key] === right[key]);
}

function taskMap(tasks) {
  return new Map((tasks || []).map((task, index) => {
    const normalized = normalizeTask(task, index);
    return [normalized.id, normalized];
  }));
}

export function inferPendingFromV2(v2State, localTasks) {
  if (!v2State?.ready || !Array.isArray(v2State.baseTasks) || !v2State.lastSyncedAt) return [];
  const cutoff = stampNumber(v2State.lastSyncedAt);
  const base = taskMap(v2State.baseTasks), local = taskMap(localTasks);
  const ids = new Set([...base.keys(), ...local.keys()]);
  const pending = new Map();
  const record = (key, type, taskId, at) => {
    if (stampNumber(at) <= cutoff) return;
    const existing = pending.get(key);
    if (!existing || stampNumber(at) > stampNumber(existing.at)) pending.set(key, { key, type, taskId, at });
  };

  for (const id of ids) {
    const b = base.get(id) || null, l = local.get(id) || null;
    if (!b && l) { record(`add:${id}`, 'add', id, l.createdAt || l.contentUpdatedAt); continue; }
    if (b && !l) { record(`delete:${id}`, 'delete', id, v2State.lastSyncedAt); continue; }
    if (!b || !l) continue;
    if (b.title !== l.title || b.details !== l.details) record(`edit:${id}`, 'edit', id, l.contentUpdatedAt);
    if (Boolean(b.done) !== Boolean(l.done)) record(`done:${id}`, 'done', id, l.doneUpdatedAt);
    if (Boolean(b.deleted) !== Boolean(l.deleted)) record(`delete:${id}`, 'delete', id, l.deletedUpdatedAt);
    if (Number(b.order) !== Number(l.order)) record('reorder', 'reorder', null, l.orderUpdatedAt);
  }
  return [...pending.values()].sort((a, b) => stampNumber(a.at) - stampNumber(b.at));
}

export function planV3Migration({ v2State, localTasks, remote }) {
  if (!remote || !Array.isArray(remote.tasks)) throw new Error('Remote tasks are required');
  if (!v2State?.ready) return { action:'adopt_remote', pending:[], baseSha:remote.sha, baseTasks:clone(remote.tasks), remoteChanged:false };
  const pending = inferPendingFromV2(v2State, localTasks);
  if (pending.length === 0) return { action:'adopt_remote', pending:[], baseSha:remote.sha, baseTasks:clone(remote.tasks), remoteChanged:false };
  return { action:'preserve_local', pending, baseSha:String(v2State.baseSha || ''), baseTasks:clone(v2State.baseTasks || []), remoteChanged:String(remote.sha || '') !== String(v2State.baseSha || '') };
}

export function classifySyncState({ ready, token, pendingCount, remoteChanged, online = true }) {
  if (!online) return 'offline';
  if (!token) return pendingCount > 0 ? 'local_only_dirty' : 'local_only';
  if (!ready) return 'initializing';
  if (pendingCount > 0 && remoteChanged) return 'diverged';
  if (pendingCount > 0) return 'local_dirty';
  if (remoteChanged) return 'remote_ahead';
  return 'synced';
}

export function shouldAutoAdoptRemote({ ready, pendingCount, remoteChanged }) {
  return Boolean(ready && pendingCount === 0 && remoteChanged);
}

function metadata(local, remote, field, fallback = '') {
  const left = local?.[field] || '', right = remote?.[field] || '';
  if (!left && !right) return fallback;
  return stampNumber(right) > stampNumber(left) ? right : left;
}

export function threeWay(baseTasks, localTasks, remoteTasks) {
  const base = taskMap(baseTasks), local = taskMap(localTasks), remote = taskMap(remoteTasks);
  const ids = new Set([...base.keys(), ...local.keys(), ...remote.keys()]);
  const fields = ['title','details','done','deleted','order'];
  const merged = [], conflicts = [];

  for (const id of ids) {
    const b = base.get(id) || null, l = local.get(id) || null, r = remote.get(id) || null;
    if (!b) {
      if (l && !r) { merged.push(clone(l)); continue; }
      if (r && !l) { merged.push(clone(r)); continue; }
      if (l && r) {
        const result = clone(l);
        for (const field of fields) if (l[field] !== r[field]) conflicts.push({ taskId:id, taskTitle:l.title || r.title, field, local:l[field], remote:r[field], target:result });
        merged.push(result);
      }
      continue;
    }
    const safeLocal = l || { ...b, deleted:true }, safeRemote = r || { ...b, deleted:true }, result = clone(b);
    for (const field of fields) {
      const localChanged = safeLocal[field] !== b[field], remoteChanged = safeRemote[field] !== b[field];
      if (localChanged && remoteChanged && safeLocal[field] !== safeRemote[field]) conflicts.push({ taskId:id, taskTitle:safeLocal.title || safeRemote.title || b.title, field, local:safeLocal[field], remote:safeRemote[field], target:result });
      else if (localChanged) result[field] = safeLocal[field];
      else if (remoteChanged) result[field] = safeRemote[field];
    }
    result.createdAt = [b.createdAt, safeLocal.createdAt, safeRemote.createdAt].filter(Boolean).sort((x,y)=>stampNumber(x)-stampNumber(y))[0] || b.createdAt;
    result.contentUpdatedAt = metadata(safeLocal, safeRemote, 'contentUpdatedAt', b.contentUpdatedAt);
    result.doneUpdatedAt = metadata(safeLocal, safeRemote, 'doneUpdatedAt', b.doneUpdatedAt);
    result.orderUpdatedAt = metadata(safeLocal, safeRemote, 'orderUpdatedAt', b.orderUpdatedAt);
    result.deletedUpdatedAt = metadata(safeLocal, safeRemote, 'deletedUpdatedAt', b.deletedUpdatedAt);
    merged.push(result);
  }
  return { merged, conflicts };
}

export function pullResult(remoteTasks) {
  return clone((remoteTasks || []).map((task, index) => normalizeTask(task, index)));
}
