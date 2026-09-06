import {
  SORT_DEFAULT,
  SORT_CREATED_DESC,
  SORT_CREATED_ASC,
  normalizeSortMode,
  sortTasksForView,
  isCreatedSort
} from './sort-core.mjs';

(() => {
  'use strict';

  const STORAGE_KEY = 'paksue-today-tasks-v1';
  const SORT_KEY = 'paksue-todo-sort-v1';
  const list = document.getElementById('taskList');
  const tabs = document.querySelector('.task-view-tabs');
  if (!list || !tabs) return;

  let sortMode = normalizeSortMode(localStorage.getItem(SORT_KEY));
  let applying = false;

  const bar = document.createElement('div');
  bar.className = 'task-sort-bar';
  bar.innerHTML = `
    <label class="task-sort-label" for="taskSortSelect">Sort</label>
    <span class="task-sort-select-wrap">
      <select id="taskSortSelect" class="task-sort-select" aria-label="Sort active tasks">
        <option value="${SORT_DEFAULT}">Default</option>
        <option value="${SORT_CREATED_DESC}">Created · Newest</option>
        <option value="${SORT_CREATED_ASC}">Created · Oldest</option>
      </select>
    </span>
  `;
  tabs.insertAdjacentElement('afterend', bar);
  const select = bar.querySelector('#taskSortSelect');
  select.value = sortMode;

  const style = document.createElement('style');
  style.textContent = `
    .task-sort-bar{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:7px 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--card) 97%,var(--accent-soft));}
    .task-sort-bar[hidden]{display:none!important;}
    .task-sort-label{color:var(--muted);font-size:12px;font-weight:800;letter-spacing:.025em;}
    .task-sort-select-wrap{position:relative;display:inline-flex;align-items:center;}
    .task-sort-select{min-height:34px;max-width:190px;padding:0 31px 0 12px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--text);font:inherit;font-size:13px;font-weight:800;outline:none;appearance:none;-webkit-appearance:none;box-shadow:0 2px 8px rgba(0,0,0,.04);}
    .task-sort-select-wrap::after{content:"⌄";position:absolute;right:11px;top:50%;transform:translateY(-56%);pointer-events:none;color:var(--muted);font-size:13px;font-weight:900;}
    .task-sort-select:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent);}
    #taskList.created-sort{display:flex;flex-direction:column;}
    #taskList.created-sort>.task{grid-template-columns:42px minmax(0,1fr) 42px;}
    #taskList.created-sort>.task>.drag-handle{display:none!important;}
    .created-sort-meta{display:block;margin-top:6px;color:var(--muted);font-size:11px;font-weight:700;line-height:1.3;text-decoration:none!important;}
    @media(max-width:430px){.task-sort-bar{padding-left:8px;padding-right:8px}.task-sort-select{max-width:175px}#taskList.created-sort>.task{grid-template-columns:40px minmax(0,1fr) 38px;}}
  `;
  document.head.append(style);

  function readTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }

  function activeView() {
    return tabs.querySelector('[data-view="active"]')?.getAttribute('aria-selected') === 'true';
  }

  function formatCreated(task) {
    const raw = task?.createdAt || task?.updatedAt || '';
    const date = new Date(raw);
    if (!raw || Number.isNaN(date.getTime())) return 'Created time unavailable';
    return `Created ${new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(date)}`;
  }

  function clearCreatedDecorations() {
    list.classList.remove('created-sort');
    for (const row of list.querySelectorAll(':scope > .task')) {
      row.style.removeProperty('order');
      row.querySelector('.created-sort-meta')?.remove();
    }
  }

  function applySort() {
    if (applying) return;
    applying = true;
    try {
      const isActive = activeView();
      bar.hidden = !isActive;
      if (!isActive) {
        clearCreatedDecorations();
        return;
      }

      const createdMode = isCreatedSort(sortMode);
      list.classList.toggle('created-sort', createdMode);
      const taskById = new Map(readTasks().map(task => [String(task.id), task]));
      const rows = [...list.querySelectorAll(':scope > .task')];

      if (!createdMode) {
        for (const row of rows) {
          row.style.removeProperty('order');
          row.querySelector('.created-sort-meta')?.remove();
        }
        return;
      }

      const activeTasks = rows.map(row => taskById.get(String(row.dataset.id))).filter(Boolean);
      const sorted = sortTasksForView(activeTasks, sortMode);
      const rank = new Map(sorted.map((task, index) => [String(task.id), index]));

      for (const row of rows) {
        const task = taskById.get(String(row.dataset.id));
        row.style.order = String(rank.get(String(row.dataset.id)) ?? 999999);
        const host = row.querySelector('.task-content');
        if (!task || !host) continue;
        let meta = host.querySelector('.created-sort-meta');
        if (!meta) {
          meta = document.createElement('span');
          meta.className = 'created-sort-meta';
          host.append(meta);
        }
        meta.textContent = formatCreated(task);
      }
    } finally {
      applying = false;
    }
  }

  select.addEventListener('change', () => {
    sortMode = normalizeSortMode(select.value);
    localStorage.setItem(SORT_KEY, sortMode);
    applySort();
  });

  tabs.addEventListener('click', () => setTimeout(applySort, 0));

  const listObserver = new MutationObserver(() => setTimeout(applySort, 0));
  listObserver.observe(list, {childList:true,subtree:false});

  const tabObserver = new MutationObserver(() => setTimeout(applySort, 0));
  for (const button of tabs.querySelectorAll('.task-view-tab')) {
    tabObserver.observe(button, {attributes:true,attributeFilter:['aria-selected']});
  }

  applySort();
})();
