var dataCacheName = 'yapotoDatav2';
var cacheName = 'yapotoCachev2';
var filesToCache = [
  //'/',
  // '/index.html',
  // 'css/main.css',
  // 'images/icons/apple-touch-icon-57x57.png',
  // 'images/icons/apple-touch-icon-60x60.png',
  // 'images/icons/apple-touch-icon-72x72.png',
  // 'images/icons/apple-touch-icon-76x76.png',
  // 'images/icons/apple-touch-icon-114x114.png',
  // 'images/icons/apple-touch-icon-120x120.png',
  // 'images/icons/apple-touch-icon-144x144.png',
  // 'images/icons/apple-touch-icon-152x152.png',
  // 'images/icons/apple-touch-icon-180x180.png',
  // 'images/icons/favicon-32x32.png',
  // 'images/icons/android-chrome-192x192.png',
  // 'images/icons/favicon-16x16.png',
  // 'images/icons/safari-pinned-tab.svg',
  // 'favicon.ico',
  // 'images/icons/mstile-144x144.png',
  // 'https://fonts.googleapis.com/css?family=Handlee|Slabo+27px',
  // 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
  // 'https://fonts.googleapis.com/icon?family=Material+Icons',
  // 'https://code.jquery.com/jquery-3.2.1.min.js',
  // 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
  // 'https://use.fontawesome.com/ff887cde6c.js',
  // 'js/interface.js',
  // 'js/util.js',
  // 'js/timer.js',
  // 'js/firebase-scripts.js',
  // '/__/firebase/4.8.1/firebase-app.js',
  // '/__/firebase/4.8.1/firebase-auth.js',
  // '/__/firebase/4.8.1/firebase-database.js',
  // '/__/firebase/4.8.1/firebase-messaging.js',
  // '/__/firebase/4.8.1/firebase-storage.js',
  // '/__/firebase/init.js',
  // 'js/main.js',
  // 'sounds/shipbell.mp3',
  // 'sounds/tick-tock.mp3'
];

self.addEventListener('install', function(e) {
  //console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      //console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  //console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          //console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  //console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'firebase';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
