const CACHE = 'glow-v1.3';
const ASSETS = ['./','index.html','styles.css','qa-fixes.css','print.css','app.js','patch.js','qa-fixes.js','coverage.js','db.js','manifest.webmanifest','assets/icon.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(Promise.all([
  self.clients.claim(),
  caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE && key.startsWith('glow-')).map(key => caches.delete(key))))
])));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./'))));
});
