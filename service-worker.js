const CACHE_NAME = "todo-pwa-v2"; // Change version to force update
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/index.js",
  "/manifest.json",
  "/images/icon.png",
  "/images/checked.png",
  "/images/unchecked.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      });
    })
  );
});

self.addEventListener("message", event => {
  if (event.data.action === "refreshUI") {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({ action: "refreshUI" }));
    });
  }
});
