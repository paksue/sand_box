(() => {
  'use strict';
  import('./sync-v3.mjs?v=20260815-1').catch(error => {
    console.error('Could not load todo sync V3.', error);
    const status = document.getElementById('syncStatus');
    const message = document.getElementById('syncMessage');
    const detail = document.getElementById('syncTime');
    if (status) status.dataset.type = 'error';
    if (message) message.textContent = 'Sync module failed to load';
    if (detail) detail.textContent = 'Local tasks still work. Reload the page to retry GitHub sync.';
  });
})();
