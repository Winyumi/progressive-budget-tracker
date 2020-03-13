var CACHE_NAME = 'my-site-cache-v1';

var urlsToCache = [
  '/',
  '/styles.css',
  '/index.js',
  '/db.js',
  '/manifest.json',
  '/service-worker.js',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];


self.addEventListener('install', function(event) {
  console.info('Event: Install');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// activate
self.addEventListener("activate", function(evt) {
  console.info('Event: Activate');
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/*
self.addEventListener("fetch", function(event) {
  console.info('Event: Fetch');
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/index.html");
        }
      });
    })
  );
});
*/
/*
self.addEventListener('fetch', (e) => {
  console.log(e.request);
  e.respondWith(
    caches.match(e.request).then((r) => {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          //if (!/^https?:$/i.test(new URL(request.url).protocol)) return;
          cache.put(e.request, response.clone());
          return response;
        })
      })
      // fallback mechanism
      .catch(function(err) {
        console.log(err);
        return caches.open(CACHE_NAME)
          .then(function(cache) {
            return cache.match('/');
          });
      });
    })
  );
});
*/

self.addEventListener("fetch", event => {
  console.log('[Service Worker] Fetching resource: ' + event.request.url);
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/index.html");
        }
      });
    })
  );
});
