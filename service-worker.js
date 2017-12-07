// configure cache

var doCache = false;
var CACHE_NAME = 'rvo-pwa';

// delete old cache
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (
                        !cacheWhitelist.includes(key)
                    ) {
                        console.log('Deleting cache: ' + key);
                        return caches.delete(key);
                    }
                }))
            )
    );
});

// install is triggered on first launch
self.addEventListener('install', function (event) {
    // installing service worker
    if (doCache) {
        // if caching is enabled, cache the specified files for offline usage (the first "/" indicates www.rvo-pwa.nl/)
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    const urlsToCache = [
                        "/",
                        "index.html",
                        "web/js/app.js",
                        "web/js/common.js",
                        "web/css/app.css",
                        "web/js/0.js",
                        "web/js/1.js",
                    ];
                    cache.addAll(urlsToCache);
                    console.log('ServiceWorker cached the following files: ' + urlsToCache);
                })
        );
    } else {
        console.log('ServiceWorker caching is disabled');
    }
});

// intercept any request and serve cached version of the file if available (regardless of online/offline state)
self.addEventListener('fetch', function (event) {
    if (doCache) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});
