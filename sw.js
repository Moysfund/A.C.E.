// sw.js - Service Worker for offline support

const CACHE_NAME = 'ace-v1';
const urlsToCache = [
    '/ace-saas/',
    '/ace-saas/index.html',
    '/ace-saas/styles.css',
    '/ace-saas/script.js',
    '/ace-saas/pages/dashboard.html',
    '/ace-saas/pages/stage-report.html',
    '/ace-saas/pages/contravention.html',
    '/ace-saas/pages/pca-audit.html',
    '/ace-saas/pages/projects.html',
    '/ace-saas/pages/teams.html',
    '/ace-saas/pages/reports.html',
    '/ace-saas/pages/settings.html',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Install service worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch from cache or network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached response or fetch from network
                return response || fetch(event.request).catch(function() {
                    // If offline and not cached, show offline page
                    return caches.match('/ace-saas/index.html');
                });
            })
    );
});

// Update service worker
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
