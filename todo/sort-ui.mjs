import {
  SORT_DEFAULT,
  SORT_UPDATED_DESC,
  SORT_CREATED_DESC,
  SORT_CREATED_ASC,
  normalizeSortMode,
  sortTasksForView,
  isAutomaticSort,
  isCreatedSort,
  isUpdatedSort
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
    <span class="task-sort-summary" aria-live="polite">0 active</span>
    <label class="task-sort-sr-only" for="taskSortSelect">Order active tasks</label>
    <span class="task-sort-select-wrap">
      <select id="taskSortSelect" class="task-sort-select" aria-label="Order active tasks">
        <option value="${SORT_DEFAULT}">Manual</option>
        <option value="${SORT_UPDATED_DESC}">Recently updated</option>
        <option value="${SORT_CREATED_DESC}">Newest added</option>
        <option value="${SORT_CREATED_ASC}">Oldest added</option>
      </select>
    </span>
  `;
  tabs.insertAdjacentElement('afterend', bar);

  const summary = bar.querySelector('.task-sort-summary');
  const select = bar.querySelector('#taskSortSelect');
  select.value = sortMode;

  const style = document.createElement('style');
  style.textContent = `
    .task-sort-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--card) 98%,var(--accent-soft));}
    .task-sort-bar[hidden]{display:none!important;}
    .task-sort-summary{min-width:0;color:var(--muted);font-size:13px;font-weight:720;}
    .task-sort-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;}
    .task-sort-select-wrap{position:relative;display:inline-flex;align-items:center;min-width:0;}
    .task-sort-select{min-height:44px;max-width:190px;padding:0 31px 0 12px;border:1px solid transparent;border-radius:13px;background:transparent;color:var(--text);font:inherit;font-size:13px;font-weight:800;outline:none;appearance:none;-webkit-appearance:none;cursor:pointer;}
    .task-sort-select-wrap::after{content:"⌄";position:absolute;right:11px;top:50%;transform:translateY(-56%);pointer-events:none;color:var(--muted);font-size:13px;font-weight:900;}
    .task-sort-select:hover{background:var(--accent-soft);}
    .task-sort-select:focus-visible{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent);}
    #taskList.automatic-sort{display:flex;flex-direction:column;}
    #taskList.automatic-sort>.task{grid-template-columns:44px minmax(0,1fr) 44px;}
    #taskList.automatic-sort>.task>.drag-handle{display:none!important;}
    .task-sort-meta{display:block;margin-top:5px;color:var(--muted);font-size:11px;font-weight:680;line-height:1.3;text-decoration:none!important;}
    @media(max-width:430px){.task-sort-bar{padding-left:9px;padding-right:9px}.task-sort-select{max-width:176px;padding-left:9px}}
  `;
  document.head.append(style);

  function readTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function activeTasks() {
    return readTasks().filter(task => !task?.deleted && !task?.done);
  }

  function activeView() {
    return tabs.querySelector('[data-view="active"]')?.getAttribute('aria-selected') === 'true';
  }

  function formatRelative(raw, verb) {
    const date = new Date(raw);
    if (!raw || Number.isNaN(date.getTime())) return `${verb} time unavailable`;

    const delta = Math.max(0, Date.now() - date.getTime());
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (delta < minute) return `${verb} just now`;
    if (delta < hour) return `${verb} ${Math.max(1, Math.floor(delta / minute))} min ago`;
    if (delta < day) return `${verb} ${Math.max(1, Math.floor(delta / hour))} hr ago`;
    if (delta < 2 * day) return `${verb} yesterday`;

    const options = { month:'short', day:'numeric' };
    if (date.getFullYear() !== new Date().getFullYear()) options.year = 'numeric';
    return `${verb} ${new Intl.DateTimeFormat(undefined, options).format(date)}`;
  }

  function sortMeta(task) {
    if (isUpdatedSort(sortMode)) {
      return formatRelative(task?.contentUpdatedAt || task?.createdAt || task?.updatedAt || '', 'Updated');
    }
    if (isCreatedSort(sortMode)) {
      return formatRelative(task?.createdAt || task?.updatedAt || '', 'Added');
    }
    return '';
  }

  function clearAutomaticDecorations() {
    list.classList.remove('automatic-sort');
    for (const row of list.querySelectorAll(':scope > .task')) {
      row.style.removeProperty('order');
      row.querySelector('.task-sort-meta')?.remove();
    }
  }

  function applySort() {
    if (applying) return;
    applying = true;
    try {
      const tasks = activeTasks();
      summary.textContent = `${tasks.length} active`;

      const isActive = activeView();
      bar.hidden = !isActive;
      if (!isActive) {
        clearAutomaticDecorations();
        return;
      }

      const automatic = isAutomaticSort(sortMode);
      list.classList.toggle('automatic-sort', automatic);
      const taskById = new Map(tasks.map(task => [String(task.id), task]));
      const rows = [...list.querySelectorAll(':scope > .task')];

      if (!automatic) {
        for (const row of rows) {
          row.style.removeProperty('order');
          row.querySelector('.task-sort-meta')?.remove();
        }
        return;
      }

      const renderedTasks = rows.map(row => taskById.get(String(row.dataset.id))).filter(Boolean);
      const sorted = sortTasksForView(renderedTasks, sortMode);
      const rank = new Map(sorted.map((task, index) => [String(task.id), index]));

      for (const row of rows) {
        const task = taskById.get(String(row.dataset.id));
        row.style.order = String(rank.get(String(row.dataset.id)) ?? 999999);
        const host = row.querySelector('.task-content');
        if (!task || !host) continue;

        let meta = host.querySelector('.task-sort-meta');
        if (!meta) {
          meta = document.createElement('span');
          meta.className = 'task-sort-meta';
          host.append(meta);
        }
        meta.textContent = sortMeta(task);
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
  listObserver.observe(list, { childList:true, subtree:false });

  const tabObserver = new MutationObserver(() => setTimeout(applySort, 0));
  for (const button of tabs.querySelectorAll('.task-view-tab')) {
    tabObserver.observe(button, { attributes:true, attributeFilter:['aria-selected'] });
  }

  applySort();
})();
