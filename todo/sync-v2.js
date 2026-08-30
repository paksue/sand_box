(() => {
  'use strict';

  const V3_KEY = 'paksue-github-source-state-v3';
  const BACKUP_KEY = 'paksue-github-v2-migration-backup';
  const TASKS_KEY = 'paksue-today-tasks-v1';
  const V2_KEY = 'paksue-github-source-state-v2';

  if (!localStorage.getItem(V3_KEY) && !localStorage.getItem(BACKUP_KEY)) {
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify({
        savedAt: new Date().toISOString(),
        tasks: JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'),
        v2State: JSON.parse(localStorage.getItem(V2_KEY) || 'null')
      }));
    } catch (error) {
      console.warn('Could not create the one-time V2 migration backup.', error);
    }
  }

  import('./sync-v3.mjs?v=20260829-1')
    .then(() => import('./archive-ui.mjs?v=20260829-1'))
    .catch(error => {
      console.error('Could not load todo app modules.', error);
      const status = document.getElementById('syncStatus');
      const message = document.getElementById('syncMessage');
      const detail = document.getElementById('syncTime');
      if (status) status.dataset.type = 'error';
      if (message) message.textContent = 'App module failed to load';
      if (detail) detail.textContent = 'Local tasks still work. Reload the page to retry the enhanced views and GitHub sync.';
    });
})();
