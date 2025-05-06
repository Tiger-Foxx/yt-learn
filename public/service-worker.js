// Ce fichier est automatiquement généré lors du build
// Le contenu sera celui du fichier src/sw.ts (compilé)

// Import l'auto-généré sw précache manifestation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('mood-music-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                '/manifest.json',
                '/favicon.png',
                '/favicon.jpg'
            ]);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName !== 'mood-music-v1';
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request)
                .then((response) => {
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open('mood-music-v1').then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
        })
    );
});