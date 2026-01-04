const CACHE_NAME = "emretv-v2";

const STATIC_ASSETS = [
  "./uygulama/EmreTV/",
  "./uygulama/EmreTV/index.html",
  "./uygulama/EmreTV/offline.html",
  "./uygulama/EmreTV/css/style.css",
  "./uygulama/EmreTV/js/app.js",
  "./uygulama/EmreTV/assets/icons/icon-192.png",
  "./uygulama/EmreTV/assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // SAYFA YENİLEME (navigation) → OFFLINE FALLBACK
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/uygulama/EmreTV/offline.html"))
    );
    return;
  }

  // DİĞER DOSYALAR
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
