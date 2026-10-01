// Minimal service worker: caches the (encrypted) app shell; network-first so updates show up.
const CACHE = 'otd-shell-20261001084114-d9943b00';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'otd-icon-192.png', 'otd-icon-512.png', 'apple-touch-icon.png', 'favicon.ico', 'otd-icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); } return res; })
    .catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match('./'))));
});
