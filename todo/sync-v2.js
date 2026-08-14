(() => {
  'use strict';

  const STORAGE_KEY = 'paksue-today-tasks-v1';
  const TOKEN_KEY = 'paksue-github-token-v1';
  const SOURCE_KEY = 'paksue-github-source-state-v2';
  const REPO_OWNER = 'paksue';
  const REPO_NAME = 'sand_box';
  const REPO_BRANCH = 'main';
  const REMOTE_PATH = 'todo/tasks.json';
  const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REMOTE_PATH}`;

  const clone = value => JSON.parse(JSON.stringify(value));
  const nowStamp = () => new Date().toISOString();
  const stampNumber = value => Number.isFinite(Date.parse(value || '')) ? Date.parse(value) : 0;

  let state = loadState();
  let remoteChanged = false;
  let busy = false;
  let lastCheckAt = 0;
  let checkTimer = null;

  const oldPull = document.getElementById('pullButton');
  const oldPush = document.getElementById('pushButton');
  if (!oldPull || !oldPush) return;

  const pullButton = oldPull.cloneNode(true);
  const pushButton = oldPush.cloneNode(true);
  oldPull.replaceWith(pullButton);
  oldPush.replaceWith(pushButton);

  const statusRow = document.getElementById('syncStatus');
  const message = document.getElementById('syncMessage');
  const detail = document.getElementById('syncTime');
  const list = document.getElementById('taskList');
  const syncSummary = statusRow?.closest('.sync-summary');

  if (syncSummary && !syncSummary.querySelector('.source-truth-label')) {
    const label = document.createElement('div');
    label.className = 'source-truth-label';
    label.textContent = '☁ GitHub · source of truth';
    syncSummary.insertBefore(label, statusRow);
  }

  const tip = document.querySelector('.tip');
  if (tip) tip.textContent = 'This page is a working copy. Local edits show as unsaved immediately. Pull replaces it; Save publishes it to GitHub.';

  const style = document.createElement('style');
  style.textContent = `
    .source-truth-label{margin:0 0 4px 16px;color:var(--muted);font-size:11px;font-weight:800;letter-spacing:.035em;text-transform:uppercase}
    #syncStatus[data-type="dirty"] .sync-dot,#syncStatus[data-type="remote"] .sync-dot{background:var(--warning)}
    #syncStatus[data-type="both"] .sync-dot{background:var(--danger)}
    #pushButton.needs-save{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 24%,transparent)}
    .sync-conflict-dialog{width:min(calc(100% - 28px),560px);max-height:80svh;border:1px solid var(--line);border-radius:22px;padding:0;background:var(--card);color:var(--text);box-shadow:0 24px 70px rgba(0,0,0,.35)}
    .sync-conflict-dialog::backdrop{background:rgba(0,0,0,.48);backdrop-filter:blur(3px)}
    .sync-conflict-box{padding:20px}.sync-conflict-box h2{margin:0 0 6px;font-size:21px}.sync-conflict-box p{line-height:1.45}
    .sync-conflict-lead{margin:0 0 16px;color:var(--muted);font-size:14px}.sync-conflict-field{margin:0 0 10px;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
    .sync-conflict-choice{width:100%;min-height:auto;margin:0 0 10px;padding:13px 14px;border:1px solid var(--line);border-radius:14px;background:transparent;color:var(--text);text-align:left;white-space:normal}
    .sync-conflict-choice strong{display:block;margin-bottom:5px;color:var(--accent);font-size:12px;text-transform:uppercase}.sync-conflict-value{display:block;overflow-wrap:anywhere;white-space:pre-wrap;font-size:15px;line-height:1.4}
    .sync-conflict-counter{margin:13px 0 0;color:var(--muted);font-size:12px;text-align:center}
  `;
  document.head.append(style);

  function loadTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(parsed) ? parsed.map((task, index) => normalizeTask(task, index)) : [];
    } catch {
      return [];
    }
  }

  function normalizeTask(task, index = 0) {
    const source = task && typeof task === 'object' ? task : {};
    const created = source.createdAt || source.updatedAt || nowStamp();
    return {
      id: String(source.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
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

  function canonical(task) {
    if (!task) return null;
    return {
      id: task.id,
      title: task.title,
      details: task.details,
      done: Boolean(task.done),
      deleted: Boolean(task.deleted),
      order: Number(task.order)
    };
  }

  function sameTask(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.id === b.id && a.title === b.title && a.details === b.details &&
      Boolean(a.done) === Boolean(b.done) && Boolean(a.deleted) === Boolean(b.deleted) &&
      Number(a.order) === Number(b.order);
  }

  function maps(tasks) {
    return new Map((tasks || []).map((task, index) => {
      const normalized = normalizeTask(task, index);
      return [normalized.id, canonical(normalized)];
    }));
  }

  function changedIds(baseTasks, localTasks) {
    if (!state.ready) return [];
    const base = maps(baseTasks);
    const local = maps(localTasks);
    const ids = new Set([...base.keys(), ...local.keys()]);
    return [...ids].filter(id => !sameTask(base.get(id), local.get(id)));
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SOURCE_KEY));
      if (parsed && typeof parsed === 'object') {
        return {
          ready: Boolean(parsed.ready),
          baseSha: String(parsed.baseSha || ''),
          baseTasks: Array.isArray(parsed.baseTasks) ? parsed.baseTasks.map((task, index) => normalizeTask(task, index)) : [],
          lastSyncedAt: String(parsed.lastSyncedAt || '')
        };
      }
    } catch {}
    return { ready:false, baseSha:'', baseTasks:[], lastSyncedAt:'' };
  }

  function saveState() {
    localStorage.setItem(SOURCE_KEY, JSON.stringify(state));
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }

  function setStatus(text, type, subtext) {
    if (statusRow) statusRow.dataset.type = type;
    if (message) message.textContent = text;
    if (detail) detail.textContent = subtext;
  }

  function dirtyCount() {
    return changedIds(state.baseTasks, loadTasks()).length;
  }

  function updateUi() {
    if (busy) return;
    const token = getToken();
    const dirty = dirtyCount();

    pullButton.disabled = false;
    pushButton.classList.toggle('needs-save', dirty > 0);
    pushButton.textContent = dirty > 0 ? `Save ${dirty} ↑` : 'Saved ✓';
    pushButton.disabled = !token || !state.ready || dirty === 0;

    if (!token) {
      setStatus(dirty ? `${dirty} local ${dirty === 1 ? 'change' : 'changes'}` : 'Local working copy', dirty ? 'dirty' : 'idle', 'Add a GitHub token to publish to the source of truth.');
      return;
    }

    if (!state.ready) {
      setStatus('Establishing baseline', 'remote', 'Checking the current GitHub source of truth.');
      return;
    }

    if (dirty > 0 && remoteChanged) {
      setStatus('This device and GitHub both changed', 'both', `${dirty} unsaved ${dirty === 1 ? 'change' : 'changes'} · Save will reconcile before publishing.`);
    } else if (dirty > 0) {
      setStatus(`${dirty} unsaved ${dirty === 1 ? 'change' : 'changes'}`, 'dirty', 'This browser changed · GitHub is still the source of truth.');
    } else if (remoteChanged) {
      setStatus('GitHub has newer changes', 'remote', 'The source of truth changed · Pull ↓ to update this device.');
    } else {
      const when = state.lastSyncedAt ? new Date(state.lastSyncedAt).toLocaleString() : 'just now';
      setStatus('Synced with GitHub', 'success', `Working copy matches source of truth · ${when}`);
    }
  }

  function setBusy(text, subtext) {
    busy = true;
    pullButton.disabled = true;
    pushButton.disabled = true;
    setStatus(text, 'working', subtext);
  }

  function clearBusy() {
    busy = false;
    updateUi();
  }

  function headers() {
    const result = { Accept:'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28' };
    const token = getToken();
    if (token) result.Authorization = `Bearer ${token}`;
    return result;
  }

  function decodeBase64Utf8(value) {
    const binary = atob(String(value || '').replace(/\s/g, ''));
    return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
  }

  function encodeBase64Utf8(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  async function apiError(response) {
    try {
      const body = await response.json();
      return body.message || `GitHub returned ${response.status}`;
    } catch {
      return `GitHub returned ${response.status}`;
    }
  }

  async function fetchRemote() {
    const response = await fetch(`${API_URL}?ref=${encodeURIComponent(REPO_BRANCH)}&_=${Date.now()}`, {
      headers:headers(), cache:'no-store'
    });
    if (!response.ok) throw new Error(await apiError(response));
    const payload = await response.json();
    const parsed = JSON.parse(decodeBase64Utf8(payload.content));
    return {
      sha:payload.sha || '',
      tasks:Array.isArray(parsed.tasks) ? parsed.tasks.map((task, index) => normalizeTask(task, index)) : []
    };
  }

  async function putRemote(tasks, sha) {
    const documentValue = { version:2, updatedAt:nowStamp(), tasks };
    const response = await fetch(API_URL, {
      method:'PUT',
      headers:{ ...headers(), 'Content-Type':'application/json' },
      body:JSON.stringify({
        message:`Sync todo list ${new Date().toLocaleString()}`,
        content:encodeBase64Utf8(`${JSON.stringify(documentValue, null, 2)}\n`),
        branch:REPO_BRANCH,
        sha
      })
    });
    if (!response.ok) {
      const error = new Error(await apiError(response));
      error.status = response.status;
      throw error;
    }
    const payload = await response.json();
    return { sha:payload?.content?.sha || '', updatedAt:documentValue.updatedAt };
  }

  function establish(remote) {
    state = { ready:true, baseSha:remote.sha, baseTasks:clone(remote.tasks), lastSyncedAt:nowStamp() };
    saveState();
    remoteChanged = false;
  }

  async function checkRemote(force = false) {
    if (busy || !getToken()) { updateUi(); return; }
    const now = Date.now();
    if (!force && now - lastCheckAt < 10000) return;
    lastCheckAt = now;
    try {
      const remote = await fetchRemote();
      if (!state.ready) establish(remote);
      remoteChanged = remote.sha !== state.baseSha;
      updateUi();
    } catch (error) {
      setStatus(dirtyCount() ? `${dirtyCount()} unsaved changes` : 'Working locally', 'both', `GitHub check failed · ${error.message}`);
    }
  }

  function metadata(local, remote, field, fallback = '') {
    const left = local?.[field] || '';
    const right = remote?.[field] || '';
    if (!left && !right) return fallback;
    return stampNumber(right) > stampNumber(left) ? right : left;
  }

  function threeWay(baseTasks, localTasks, remoteTasks) {
    const base = new Map((baseTasks || []).map((task, index) => { const n = normalizeTask(task, index); return [n.id, n]; }));
    const local = new Map((localTasks || []).map((task, index) => { const n = normalizeTask(task, index); return [n.id, n]; }));
    const remote = new Map((remoteTasks || []).map((task, index) => { const n = normalizeTask(task, index); return [n.id, n]; }));
    const ids = new Set([...base.keys(), ...local.keys(), ...remote.keys()]);
    const fields = ['title','details','done','deleted','order'];
    const merged = [];
    const conflicts = [];

    for (const id of ids) {
      const b = base.get(id) || null;
      const l = local.get(id) || null;
      const r = remote.get(id) || null;

      if (!b) {
        if (l && !r) { merged.push(clone(l)); continue; }
        if (r && !l) { merged.push(clone(r)); continue; }
        if (l && r) {
          const result = clone(l);
          for (const field of fields) {
            if (l[field] !== r[field]) conflicts.push({ taskTitle:l.title || r.title, field, local:l[field], remote:r[field], target:result });
          }
          merged.push(result);
        }
        continue;
      }

      const safeLocal = l || { ...b, deleted:true };
      const safeRemote = r || { ...b, deleted:true };
      const result = clone(b);

      for (const field of fields) {
        const localChanged = safeLocal[field] !== b[field];
        const remoteFieldChanged = safeRemote[field] !== b[field];
        if (localChanged && remoteFieldChanged && safeLocal[field] !== safeRemote[field]) {
          conflicts.push({ taskTitle:safeLocal.title || safeRemote.title || b.title, field, local:safeLocal[field], remote:safeRemote[field], target:result });
        } else if (localChanged) result[field] = safeLocal[field];
        else if (remoteFieldChanged) result[field] = safeRemote[field];
      }

      result.createdAt = [b.createdAt, safeLocal.createdAt, safeRemote.createdAt].filter(Boolean).sort((x,y) => stampNumber(x)-stampNumber(y))[0] || nowStamp();
      result.contentUpdatedAt = metadata(safeLocal, safeRemote, 'contentUpdatedAt', b.contentUpdatedAt);
      result.doneUpdatedAt = metadata(safeLocal, safeRemote, 'doneUpdatedAt', b.doneUpdatedAt);
      result.orderUpdatedAt = metadata(safeLocal, safeRemote, 'orderUpdatedAt', b.orderUpdatedAt);
      result.deletedUpdatedAt = metadata(safeLocal, safeRemote, 'deletedUpdatedAt', b.deletedUpdatedAt);
      merged.push(result);
    }

    return { merged, conflicts };
  }

  function conflictValue(value) {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === '' || value === null || value === undefined) return '(empty)';
    return String(value);
  }

  function resolveConflicts(conflicts) {
    return new Promise(resolve => {
      if (!conflicts.length) { resolve(); return; }

      const dialog = document.createElement('dialog');
      dialog.className = 'sync-conflict-dialog';
      dialog.innerHTML = `<div class="sync-conflict-box"><h2>Both copies changed</h2><p class="sync-conflict-lead"></p><p class="sync-conflict-field"></p><button class="sync-conflict-choice local" type="button"><strong>This device</strong><span class="sync-conflict-value"></span></button><button class="sync-conflict-choice remote" type="button"><strong>GitHub</strong><span class="sync-conflict-value"></span></button><p class="sync-conflict-counter"></p></div>`;
      document.body.append(dialog);

      let index = 0;
      const lead = dialog.querySelector('.sync-conflict-lead');
      const field = dialog.querySelector('.sync-conflict-field');
      const localButton = dialog.querySelector('.local');
      const remoteButton = dialog.querySelector('.remote');
      const localValue = localButton.querySelector('.sync-conflict-value');
      const remoteValue = remoteButton.querySelector('.sync-conflict-value');
      const counter = dialog.querySelector('.sync-conflict-counter');
      const labels = { title:'Task title', details:'Details', done:'Completed', deleted:'Deleted', order:'Order' };

      const show = () => {
        const conflict = conflicts[index];
        const label = labels[conflict.field] || conflict.field;
        lead.textContent = `${conflict.taskTitle} changed in both places. Choose the ${label.toLowerCase()} to keep.`;
        field.textContent = label;
        localValue.textContent = conflictValue(conflict.local);
        remoteValue.textContent = conflictValue(conflict.remote);
        counter.textContent = `Conflict ${index + 1} of ${conflicts.length}`;
      };

      const choose = value => {
        const conflict = conflicts[index];
        conflict.target[conflict.field] = value;
        index += 1;
        if (index >= conflicts.length) {
          dialog.close();
          dialog.remove();
          resolve();
        } else show();
      };

      localButton.addEventListener('click', () => choose(conflicts[index].local));
      remoteButton.addEventListener('click', () => choose(conflicts[index].remote));
      show();
      dialog.showModal();
    });
  }

  async function pull() {
    if (busy) return;
    const dirty = dirtyCount();
    if (dirty > 0) {
      const ok = window.confirm(`You have ${dirty} unsaved ${dirty === 1 ? 'change' : 'changes'} on this device.\n\nPulling will discard them and replace this browser with GitHub.`);
      if (!ok) return;
    }

    setBusy('Pulling from GitHub…', 'Replacing this working copy with the source of truth.');
    try {
      const remote = await fetchRemote();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote.tasks));
      establish(remote);
      location.reload();
    } catch (error) {
      busy = false;
      setStatus('Pull failed', 'both', error.message);
    }
  }

  async function save() {
    if (busy || !getToken() || !state.ready) return;
    const localTasks = loadTasks();
    if (!changedIds(state.baseTasks, localTasks).length) { updateUi(); return; }

    setBusy('Checking GitHub…', 'Comparing this working copy with the source of truth.');

    try {
      let remote = await fetchRemote();
      let outgoing;

      if (remote.sha === state.baseSha) {
        outgoing = localTasks;
      } else {
        const result = threeWay(state.baseTasks, localTasks, remote.tasks);
        await resolveConflicts(result.conflicts);
        outgoing = result.merged;
      }

      let saved;
      try {
        saved = await putRemote(outgoing, remote.sha);
      } catch (error) {
        if (error.status !== 409) throw error;
        remote = await fetchRemote();
        const retry = threeWay(state.baseTasks, outgoing, remote.tasks);
        await resolveConflicts(retry.conflicts);
        outgoing = retry.merged;
        saved = await putRemote(outgoing, remote.sha);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(outgoing));
      state = {
        ready:true,
        baseSha:saved.sha,
        baseTasks:clone(outgoing),
        lastSyncedAt:saved.updatedAt
      };
      saveState();
      remoteChanged = false;
      location.reload();
    } catch (error) {
      busy = false;
      setStatus('Save failed', 'both', error.message);
      updateUi();
    }
  }

  function queueLocalCheck() {
    clearTimeout(checkTimer);
    checkTimer = setTimeout(updateUi, 0);
  }

  pullButton.textContent = 'Pull ↓';
  pushButton.textContent = 'Saved ✓';
  pullButton.addEventListener('click', pull);
  pushButton.addEventListener('click', save);

  document.addEventListener('input', event => {
    if (list?.contains(event.target)) queueLocalCheck();
  });
  document.addEventListener('click', event => {
    if (list?.contains(event.target) || event.target?.id === 'clearCompleted') queueLocalCheck();
  });
  if (list) new MutationObserver(queueLocalCheck).observe(list, { childList:true, subtree:true, characterData:true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkRemote();
  });
  window.addEventListener('pageshow', () => checkRemote());

  const saveToken = document.getElementById('saveTokenButton');
  const clearToken = document.getElementById('clearTokenButton');
  saveToken?.addEventListener('click', () => setTimeout(() => checkRemote(true), 30));
  clearToken?.addEventListener('click', () => setTimeout(updateUi, 30));

  updateUi();
  checkRemote(true);
})();