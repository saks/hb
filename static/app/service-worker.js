var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [
    '/static/app/index.html',
    '/static/app/scripts/app.js',
    '/static/app/styles/inline.css',
    '/static/app/images/clear.png',
    '/static/app/images/cloudy-scattered-showers.png',
    '/static/app/images/cloudy.png',
    '/static/app/images/fog.png',
    '/static/app/images/ic_add_white_24px.svg',
    '/static/app/images/ic_refresh_white_24px.svg',
    '/static/app/images/partly-cloudy.png',
    '/static/app/images/rain.png',
    '/static/app/images/scattered-showers.png',
    '/static/app/images/sleet.png',
    '/static/app/images/snow.png',
    '/static/app/images/thunderstorm.png',
    '/static/app/images/wind.png'
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
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
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
