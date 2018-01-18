
self.addEventListener('install', function(event) {
  console.log('[Service Worker] install ...', event);
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] activate ...', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  console.log('Fetch: ', event.request.url);
  event.respondWith(fetch(event.request));
});
