import { splitTaskBuckets, restoreTask, archiveLabel, eventStamp } from './archive-core.mjs';

(() => {
  'use strict';

  const STORAGE_KEY = 'paksue-today-tasks-v1';
  const V3_KEY = 'paksue-github-source-state-v3';
  const VIEW_KEY = 'paksue-todo-view-session-v1';

  const list = document.getElementById('taskList');
  const form = document.getElementById('taskForm');
  const count = document.getElementById('count');
  const progress = document.getElementById('progress');
  const remaining = document.getElementById('remaining');
  const clearCompleted = document.getElementById('clearCompleted');
  if (!list || !form || !count || !progress || !remaining) return;

  let view = sessionStorage.getItem(VIEW_KEY) === 'archive' ? 'archive' : 'active';
  let activeNodes = null;
  let observer = null;
  let menu = null;
  let toast = null;
  let toastTimer = null;
  let pendingCompletionId = null;
  let pendingCompletionUntil = 0;

  const tabs = document.createElement('nav');
  tabs.className = 'task-view-tabs';
  tabs.setAttribute('aria-label', 'Task views');
  tabs.innerHTML = `
    <button type="button" class="task-view-tab" data-view="active"><span>Active</span><strong class="active-count">0</strong></button>
    <button type="button" class="task-view-tab" data-view="archive"><span>Archive</span><strong class="archive-count">0</strong></button>
  `;
  form.insertAdjacentElement('afterend', tabs);

  const style = document.createElement('style');
  style.textContent = `
    .task-view-tabs{display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:8px 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--card) 94%,var(--accent-soft));}
    .task-view-tab{position:relative;display:flex;align-items:center;justify-content:center;gap:7px;min-height:42px;padding:0 14px;border:0;border-radius:13px;background:transparent;color:var(--muted);font-size:14px;font-weight:800;box-shadow:none;}
    .task-view-tab strong{display:grid;place-items:center;min-width:24px;height:24px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--line) 75%,transparent);color:inherit;font-size:12px;}
    .task-view-tab[aria-selected="true"]{background:var(--card);color:var(--text);box-shadow:0 3px 12px rgba(0,0,0,.06);}
    .task-view-tab[aria-selected="true"]::after{content:"";position:absolute;left:22%;right:22%;bottom:3px;height:3px;border-radius:999px;background:var(--accent);}
    .task-view-tab[aria-selected="true"] strong{background:var(--accent-soft);color:var(--accent);}
    .archive-native-delete{display:none!important;}
    .task-menu-button{display:grid;place-items:center;width:38px;height:38px;min-width:38px;min-height:38px;margin-top:2px;padding:0;border-radius:12px;background:transparent;color:var(--muted);font-size:22px;font-weight:800;letter-spacing:1px;}
    .task-menu-button:hover,.task-menu-button:focus-visible{background:var(--accent-soft);color:var(--accent);outline:none;}
    .task-action-menu{position:fixed;z-index:1300;width:172px;padding:7px;border:1px solid var(--line);border-radius:16px;background:color-mix(in srgb,var(--card) 96%,transparent);box-shadow:0 16px 42px rgba(0,0,0,.2);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);}
    .task-action-menu button{display:flex;align-items:center;width:100%;min-height:42px;padding:0 12px;border-radius:11px;background:transparent;color:var(--text);text-align:left;font-size:14px;}
    .task-action-menu button:hover,.task-action-menu button:focus-visible{background:var(--accent-soft);outline:none;}
    .task-action-menu .archive-action{color:var(--accent);}
    .archive-group{padding:18px 16px 8px;color:var(--muted);font-size:12px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid var(--line);}
    .archive-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:start;gap:10px;min-height:78px;padding:13px 14px;border-bottom:1px solid var(--line);}
    .archive-icon{display:grid;place-items:center;width:34px;height:34px;margin-top:2px;border:2px solid var(--accent);border-radius:50%;color:var(--accent);font-weight:900;}
    .archive-row.manual .archive-icon{border-radius:11px;border-color:var(--muted);color:var(--muted);font-size:16px;}
    .archive-copy{min-width:0;padding-top:1px;}
    .archive-title{font-size:16px;font-weight:760;line-height:1.3;overflow-wrap:anywhere;}
    .archive-details{margin-top:3px;color:var(--muted);font-size:13px;line-height:1.38;white-space:pre-wrap;overflow-wrap:anywhere;}
    .archive-meta{margin-top:6px;color:var(--muted);font-size:11px;font-weight:700;}
    .restore-button{min-width:auto;min-height:38px;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--accent);font-size:13px;}
    .archive-empty{padding:44px 22px;color:var(--muted);text-align:center;line-height:1.5;}
    .task.completing-out{animation:archive-away .62s cubic-bezier(.2,.75,.25,1) forwards;transform-origin:center;}
    @keyframes archive-away{0%,55%{opacity:1;transform:translateX(0) scale(1)}100%{opacity:0;transform:translateX(18px) scale(.985)}}
    .archive-toast{position:fixed;z-index:1400;left:50%;bottom:max(22px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:12px;max-width:calc(100% - 28px);min-height:50px;padding:8px 10px 8px 16px;border:1px solid var(--line);border-radius:999px;background:color-mix(in srgb,var(--card) 96%,transparent);color:var(--text);box-shadow:0 16px 48px rgba(0,0,0,.22);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);transform:translateX(-50%);font-size:14px;font-weight:760;white-space:nowrap;}
    .archive-toast button{min-width:auto;min-height:36px;padding:0 12px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:13px;}
    #clearCompleted{display:none!important;}
    @media(max-width:430px){.task-view-tabs{padding-left:8px;padding-right:8px}.archive-row{grid-template-columns:38px minmax(0,1fr) auto;padding-left:10px;padding-right:10px;gap:7px}.restore-button{padding:0 10px}.archive-toast{bottom:max(16px,env(safe-area-inset-bottom));font-size:13px}}
  `;
  document.head.append(style);

  function readTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }

  function writeTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function readV3() {
    try { return JSON.parse(localStorage.getItem(V3_KEY)); } catch { return null; }
  }

  function writeV3(value) {
    localStorage.setItem(V3_KEY, JSON.stringify(value));
  }

  function updatePendingForTask(task, at) {
    const state = readV3();
    if (!state?.ready) return;
    state.pending = state.pending && typeof state.pending === 'object' && !Array.isArray(state.pending) ? state.pending : {};
    const base = Array.isArray(state.baseTasks) ? state.baseTasks.find(candidate => String(candidate.id) === String(task.id)) : null;

    if (!base) {
      if (!task.deleted) state.pending[`add:${task.id}`] = {key:`add:${task.id}`,type:'add',taskId:String(task.id),at};
      delete state.pending[`done:${task.id}`];
      delete state.pending[`delete:${task.id}`];
      writeV3(state);
      return;
    }

    const syncField = (key, type, changed) => {
      if (changed) state.pending[key] = {key,type,taskId:String(task.id),at};
      else delete state.pending[key];
    };
    syncField(`done:${task.id}`,'done',Boolean(task.done)!==Boolean(base.done));
    syncField(`delete:${task.id}`,'delete',Boolean(task.deleted)!==Boolean(base.deleted));
    writeV3(state);
  }

  function mutateAndReload(id, mutator) {
    const tasks = readTasks();
    const index = tasks.findIndex(task => String(task.id) === String(id));
    if (index < 0) return;
    const at = new Date().toISOString();
    tasks[index] = mutator(tasks[index], at);
    writeTasks(tasks);
    updatePendingForTask(tasks[index], at);
    sessionStorage.setItem(VIEW_KEY, view);
    location.reload();
  }

  function restore(id) {
    mutateAndReload(id, (task, at) => restoreTask(task, at));
  }

  function formatEventDate(task) {
    const stamp = eventStamp(task);
    const date = new Date(stamp);
    if (!stamp || Number.isNaN(date.getTime())) return archiveLabel(task);
    return `${archiveLabel(task)} ${new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric'}).format(date)}`;
  }

  function closeMenu() {
    if (!menu) return;
    menu.remove();
    menu = null;
  }

  function openMenu(button, row, task) {
    closeMenu();
    const nativeDelete = row.querySelector('.archive-native-delete');
    if (!nativeDelete) return;
    menu = document.createElement('div');
    menu.className = 'task-action-menu';
    menu.setAttribute('role','menu');
    const archive = document.createElement('button');
    archive.type = 'button';
    archive.className = 'archive-action';
    archive.textContent = 'Archive task';
    archive.addEventListener('click', event => {
      event.stopPropagation();
      closeMenu();
      nativeDelete.click();
      showToast('Moved to Archive', () => restore(task.id));
    });
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', closeMenu);
    menu.append(archive, cancel);
    document.body.append(menu);
    const rect = button.getBoundingClientRect();
    const width = 172;
    const left = Math.min(window.innerWidth - width - 10, Math.max(10, rect.right - width));
    const top = Math.min(window.innerHeight - menu.offsetHeight - 10, rect.bottom + 6);
    menu.style.left = `${left}px`;
    menu.style.top = `${Math.max(10, top)}px`;
  }

  function showToast(text, undo) {
    if (toast) toast.remove();
    clearTimeout(toastTimer);
    toast = document.createElement('div');
    toast.className = 'archive-toast';
    toast.setAttribute('role','status');
    const label = document.createElement('span');
    label.textContent = text;
    toast.append(label);
    if (undo) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Undo';
      button.addEventListener('click', () => { toast?.remove(); toast = null; undo(); });
      toast.append(button);
    }
    document.body.append(toast);
    toastTimer = setTimeout(() => { toast?.remove(); toast = null; }, 4200);
  }

  function archiveRow(task) {
    const row = document.createElement('li');
    row.className = `archive-row${task.done ? '' : ' manual'}`;
    row.dataset.id = task.id;
    const icon = document.createElement('span');
    icon.className = 'archive-icon';
    icon.textContent = task.done ? '✓' : '▣';
    const copy = document.createElement('div');
    copy.className = 'archive-copy';
    const title = document.createElement('div');
    title.className = 'archive-title';
    title.textContent = task.title || 'Untitled task';
    copy.append(title);
    if (task.details) {
      const details = document.createElement('div');
      details.className = 'archive-details';
      details.textContent = task.details;
      copy.append(details);
    }
    const meta = document.createElement('div');
    meta.className = 'archive-meta';
    meta.textContent = formatEventDate(task);
    copy.append(meta);
    const restoreButton = document.createElement('button');
    restoreButton.type = 'button';
    restoreButton.className = 'restore-button';
    restoreButton.textContent = '↩ Restore';
    restoreButton.setAttribute('aria-label', `Restore ${task.title || 'task'} to Active`);
    restoreButton.addEventListener('click', () => restore(task.id));
    row.append(icon, copy, restoreButton);
    return row;
  }

  function groupHeader(text, count) {
    const header = document.createElement('li');
    header.className = 'archive-group';
    header.textContent = `${text} · ${count}`;
    return header;
  }

  function updateChrome(buckets) {
    const activeCount = buckets.active.length;
    const archiveCount = buckets.archive.length;
    tabs.querySelector('.active-count').textContent = activeCount;
    tabs.querySelector('.archive-count').textContent = archiveCount;
    for (const button of tabs.querySelectorAll('.task-view-tab')) {
      button.setAttribute('aria-selected', String(button.dataset.view === view));
    }
    form.hidden = view === 'archive';
    count.textContent = view === 'active' ? `${activeCount} left` : `${archiveCount} archived`;
    remaining.textContent = view === 'active' ? `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining` : `${archiveCount} in archive`;
    if (clearCompleted) clearCompleted.hidden = true;
    const trackableTotal = activeCount + buckets.completed.length;
    progress.style.width = trackableTotal ? `${buckets.completed.length / trackableTotal * 100}%` : '0%';
  }

  function decorateActive(buckets) {
    const byId = new Map(readTasks().map(task => [String(task.id), task]));
    list.querySelectorAll(':scope > .archive-group,:scope > .archive-row,:scope > .archive-empty').forEach(node => node.remove());
    const rows = [...list.querySelectorAll(':scope > .task')];
    for (const row of rows) {
      const task = byId.get(String(row.dataset.id));
      if (!task || task.deleted || task.done) {
        const allowExit = task?.done && String(task.id) === String(pendingCompletionId) && Date.now() < pendingCompletionUntil;
        if (allowExit) {
          row.classList.add('completing-out');
          setTimeout(() => applyView(), Math.max(0, pendingCompletionUntil - Date.now()) + 20);
        } else row.remove();
        continue;
      }
      row.classList.remove('completing-out');
      const nativeDelete = row.querySelector('.delete');
      if (nativeDelete) {
        nativeDelete.classList.add('archive-native-delete');
        nativeDelete.tabIndex = -1;
        if (!row.querySelector('.task-menu-button')) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'task-menu-button';
          button.textContent = '•••';
          button.setAttribute('aria-label', `Actions for ${task.title || 'task'}`);
          button.addEventListener('click', event => { event.stopPropagation(); openMenu(button, row, task); });
          row.insertBefore(button, nativeDelete);
        }
      }
    }
    list.querySelectorAll(':scope > .empty').forEach(node => node.remove());
    if (!buckets.active.length) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      empty.textContent = 'All clear. Completed work is waiting in Archive.';
      list.append(empty);
    }
  }

  function renderArchive(buckets) {
    if (!activeNodes) activeNodes = [...list.childNodes];
    const nodes = [];
    if (buckets.completed.length) {
      nodes.push(groupHeader('Completed', buckets.completed.length));
      for (const task of buckets.completed) nodes.push(archiveRow(task));
    }
    if (buckets.archived.length) {
      nodes.push(groupHeader('Archived', buckets.archived.length));
      for (const task of buckets.archived) nodes.push(archiveRow(task));
    }
    if (!nodes.length) {
      const empty = document.createElement('li');
      empty.className = 'archive-empty';
      empty.textContent = 'Archive is empty. Completed and manually archived tasks will appear here.';
      nodes.push(empty);
    }
    list.replaceChildren(...nodes);
  }

  function applyView() {
    if (observer) observer.disconnect();
    const buckets = splitTaskBuckets(readTasks());
    updateChrome(buckets);
    if (view === 'archive') renderArchive(buckets);
    else {
      if (activeNodes) {
        list.replaceChildren(...activeNodes);
        activeNodes = null;
      }
      decorateActive(buckets);
    }
    if (observer) observer.observe(list, {childList:true,subtree:false});
  }

  tabs.addEventListener('click', event => {
    const button = event.target.closest('.task-view-tab');
    if (!button || button.dataset.view === view) return;
    closeMenu();
    view = button.dataset.view;
    sessionStorage.setItem(VIEW_KEY, view);
    applyView();
  });

  document.addEventListener('click', event => {
    if (menu && !menu.contains(event.target) && !event.target.closest('.task-menu-button')) closeMenu();
  });

  document.addEventListener('click', event => {
    const check = event.target.closest?.('.check');
    if (!check || view !== 'active') return;
    const row = check.closest('.task');
    if (!row || !list.contains(row)) return;
    const task = readTasks().find(candidate => String(candidate.id) === String(row.dataset.id));
    if (!task || task.done || task.deleted) return;
    pendingCompletionId = task.id;
    pendingCompletionUntil = Date.now() + 650;
    setTimeout(() => {
      const after = readTasks().find(candidate => String(candidate.id) === String(task.id));
      if (after?.done) showToast('Completed — moved to Archive', () => restore(task.id));
      else { pendingCompletionId = null; pendingCompletionUntil = 0; }
      applyView();
    }, 0);
  }, true);

  observer = new MutationObserver(() => applyView());
  observer.observe(list, {childList:true,subtree:false});
  applyView();
})();
