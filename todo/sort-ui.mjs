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

  const choices = [
    [SORT_DEFAULT, 'Manual'],
    [SORT_UPDATED_DESC, 'Recently updated'],
    [SORT_CREATED_DESC, 'Newest added'],
    [SORT_CREATED_ASC, 'Oldest added']
  ];
  const labels = new Map(choices);

  let sortMode = normalizeSortMode(localStorage.getItem(SORT_KEY));
  let applying = false;

  const bar = document.createElement('div');
  bar.className = 'task-sort-bar';
  bar.innerHTML = `
    <span class="task-sort-summary" aria-live="polite">0 active</span>
    <div class="task-sort-menu-wrap">
      <button id="taskSortButton" class="task-sort-button" type="button" aria-haspopup="menu" aria-expanded="false">
        <span class="task-sort-button-label"></span><span class="task-sort-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="task-sort-menu" role="menu" aria-label="Order active tasks" hidden></div>
    </div>
  `;
  tabs.insertAdjacentElement('afterend', bar);

  const summary = bar.querySelector('.task-sort-summary');
  const menuButton = bar.querySelector('#taskSortButton');
  const buttonLabel = bar.querySelector('.task-sort-button-label');
  const menu = bar.querySelector('.task-sort-menu');

  for (const [value, label] of choices) {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'task-sort-option';
    option.dataset.sort = value;
    option.setAttribute('role', 'menuitemradio');
    option.innerHTML = `<span>${label}</span><span class="task-sort-check" aria-hidden="true">✓</span>`;
    option.addEventListener('click', () => chooseSort(value));
    menu.append(option);
  }

  const style = document.createElement('style');
  style.textContent = `
    .task-sort-bar{position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--card) 98%,var(--accent-soft));}
    .task-sort-bar[hidden]{display:none!important;}
    .task-sort-summary{min-width:0;color:var(--muted);font-size:13px;font-weight:720;}
    .task-sort-menu-wrap{position:relative;display:inline-flex;min-width:0;}
    .task-sort-button{display:inline-flex;align-items:center;justify-content:flex-end;gap:7px;min-width:auto;min-height:44px;padding:0 10px;border:1px solid transparent;border-radius:13px;background:transparent;color:var(--text);font-size:13px;font-weight:820;box-shadow:none;}
    .task-sort-button:hover,.task-sort-button[aria-expanded="true"]{background:var(--accent-soft);}
    .task-sort-button:focus-visible{border-color:var(--accent);outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent);}
    .task-sort-chevron{color:var(--muted);font-size:13px;transition:transform 120ms ease;}
    .task-sort-button[aria-expanded="true"] .task-sort-chevron{transform:rotate(180deg);}
    .task-sort-menu{position:absolute;right:0;top:calc(100% + 5px);z-index:300;width:min(208px,calc(100vw - 28px));padding:6px;border:1px solid var(--line);border-radius:15px;background:color-mix(in srgb,var(--card) 98%,transparent);box-shadow:0 16px 40px rgba(0,0,0,.18);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);}
    .task-sort-menu[hidden]{display:none!important;}
    .task-sort-option{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;min-height:44px;padding:0 11px;border-radius:10px;background:transparent;color:var(--text);text-align:left;font-size:14px;font-weight:720;box-shadow:none;}
    .task-sort-option:hover,.task-sort-option:focus-visible{background:var(--accent-soft);outline:none;}
    .task-sort-check{color:var(--accent);opacity:0;font-weight:900;}
    .task-sort-option[aria-checked="true"] .task-sort-check{opacity:1;}
    #taskList.automatic-sort{display:flex;flex-direction:column;}
    #taskList.automatic-sort>.task{grid-template-columns:44px minmax(0,1fr) 44px;}
    #taskList.automatic-sort>.task>.drag-handle{display:none!important;}
    .task-sort-meta{display:block;margin-top:5px;color:var(--muted);font-size:11px;font-weight:680;line-height:1.3;text-decoration:none!important;}
    @media(max-width:430px){.task-sort-bar{padding-left:9px;padding-right:9px}.task-sort-button{max-width:184px;padding-left:8px;padding-right:8px}}
    @media(prefers-reduced-motion:reduce){.task-sort-chevron{transition:none}}
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

  function syncMenuUi() {
    const label = labels.get(sortMode) || labels.get(SORT_DEFAULT);
    buttonLabel.textContent = label;
    menuButton.setAttribute('aria-label', `Order active tasks: ${label}`);
    for (const option of menu.querySelectorAll('.task-sort-option')) {
      option.setAttribute('aria-checked', String(option.dataset.sort === sortMode));
    }
  }

  function openMenu(focusSelected = false) {
    menu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    if (focusSelected) {
      requestAnimationFrame(() => menu.querySelector(`[data-sort="${sortMode}"]`)?.focus());
    }
  }

  function closeMenu({ restoreFocus = false } = {}) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menuButton.focus();
  }

  function chooseSort(value) {
    sortMode = normalizeSortMode(value);
    localStorage.setItem(SORT_KEY, sortMode);
    syncMenuUi();
    closeMenu({ restoreFocus:true });
    applySort();
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

      if (!activeView()) {
        bar.hidden = true;
        closeMenu();
        clearAutomaticDecorations();
        return;
      }

      bar.hidden = false;
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

  menuButton.addEventListener('click', () => {
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  menuButton.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openMenu(true);
    }
  });

  menu.addEventListener('keydown', event => {
    const options = [...menu.querySelectorAll('.task-sort-option')];
    const index = options.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus:true });
      return;
    }
    if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else if (event.key === 'ArrowDown') next = index < 0 ? 0 : (index + 1) % options.length;
    else next = index < 0 ? options.length - 1 : (index - 1 + options.length) % options.length;
    options[next]?.focus();
  });

  document.addEventListener('click', event => {
    if (!bar.contains(event.target)) closeMenu();
  });

  tabs.addEventListener('click', () => {
    closeMenu();
    setTimeout(applySort, 0);
  });

  const listObserver = new MutationObserver(() => setTimeout(applySort, 0));
  listObserver.observe(list, { childList:true, subtree:false });

  const tabObserver = new MutationObserver(() => setTimeout(applySort, 0));
  for (const button of tabs.querySelectorAll('.task-view-tab')) {
    tabObserver.observe(button, { attributes:true, attributeFilter:['aria-selected'] });
  }

  syncMenuUi();
  applySort();
})();
