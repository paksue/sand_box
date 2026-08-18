const CACHE = 'hold-core-v2.1.0';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles/app.css',
  './js/main.js',
  './js/app-controller.js',
  './js/domain/commands.js',
  './js/domain/timer-machine.js',
  './js/domain/exercise-catalog.js',
  './js/domain/training.js',
  './js/domain/progression.js',
  './js/state/app-state.js',
  './js/state/schema.js',
  './js/state/migrations.js',
  './js/services/clock.js',
  './js/services/persistence.js',
  './js/services/audio.js',
  './js/services/wake-lock.js',
  './js/services/visibility.js',
  './js/services/vibration.js',
  './js/ui/render.js',
  './js/ui/timer-view.js',
  './js/ui/completion-view.js',
  './js/ui/exercise-sheet.js',
  './js/ui/hands-free-sheet.js',
  './js/ui/accessibility.js',
  './js/hands-free/manager.js',
  './js/hands-free/intent-gate.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('hold-core-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Optional ML/CDN resources manage their own browser caches.

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
      return response;
    }))
  );
});
