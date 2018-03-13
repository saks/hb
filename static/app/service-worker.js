var cacheName = 'home-budget-0.0.4';
var filesToCache = [
    '/static/app/index.html',
    '/static/app/scripts/app.js',
    '/static/app/styles/inline.css',
];

const externalsCacheName = 'home-budget-externals-0.0.3';
const externalUrls = [
    'https://unpkg.com/bootstrap-material-design@4.1.1/dist/js/bootstrap-material-design.js',
    'https://unpkg.com/popper.js@1.12.6/dist/umd/popper.js',
    'https://code.jquery.com/jquery-3.2.1.slim.min.js',
    'https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css',
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] Fetch', e.request.url);

    if (externalUrls.includes(e.request.url)) {
        e.respondWith(
            caches.open(externalsCacheName).then(function(cache) {
                return fetch(e.request).then(function(response){
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, falling back to the network" offline strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
         */
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }


    // console.log('[ServiceWorker] Fetch', e.request.url);
    // e.respondWith(
    //     caches.match(e.request).then(function(response) {
    //         return response || fetch(e.request);
    //     })
    // );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});
