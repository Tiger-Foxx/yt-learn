/// <reference lib="webworker" />

// Service worker pour notre application PWA
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'mood-music-v1';
const OFFLINE_URL = '/offline.html';

// Liste des fichiers à mettre en cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/favicon.png',
    '/favicon.jpg',
    // Ajoutez ici d'autres ressources statiques importantes
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            // Mise en cache des fichiers statiques
            await cache.addAll(STATIC_ASSETS);
            // Activation immédiate, sans attendre la fermeture des anciennes pages
            await self.skipWaiting();
        })()
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            // Supprimer les anciens caches
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
            // Prendre le contrôle de toutes les pages immédiatement
            await self.clients.claim();
        })()
    );
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
    // Ignorer les requêtes non GET ou les requêtes vers d'autres domaines
    if (
        event.request.method !== 'GET' ||
        !event.request.url.startsWith(self.location.origin) ||
        event.request.url.includes('chrome-extension')
    ) {
        return;
    }

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            try {
                // Stratégie réseau d'abord, puis cache pour les requêtes API
                if (event.request.url.includes('/api/')) {
                    try {
                        const response = await fetch(event.request);
                        if (response.ok) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    } catch (error) {
                        const cachedResponse = await cache.match(event.request);
                        return cachedResponse || new Response(JSON.stringify({ error: 'Offline' }), {
                            headers: { 'Content-Type': 'application/json' },
                            status: 503
                        });
                    }
                }

                // Stratégie cache d'abord, puis réseau pour les ressources statiques et les pages
                const cachedResponse = await cache.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }
                return new Response(JSON.stringify({ error: 'Offline' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 503
                });

                // Si pas en cache, essayer le réseau
                const response = await fetch(event.request);

                // Mettre en cache les nouvelles ressources valides
                if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
                    cache.put(event.request, response.clone());
                }

                return response;
            } catch (error) {
                // Si la requête échoue (offline) et c'est une requête de page HTML
                if (event.request.headers.get('Accept')?.includes('text/html')) {
                    const offlineResponse = await cache.match(OFFLINE_URL);
                    if (offlineResponse) {
                        return offlineResponse;
                    }
                }

                // Pour les autres types de ressources, essayer de servir depuis le cache
                const cachedAnyway = await cache.match(event.request);
                return cachedAnyway || new Response('Network error happened', {
                    status: 408,
                    headers: { 'Content-Type': 'text/plain' },
                });
            }
        })()
    );
});

// Gérer les notifications push
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/favicon.png',
        badge: '/favicon.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification('Mood Music', options)
    );
});

// Gérer les clics sur notifications
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        (async () => {
            const url = event.notification.data.url;
            const allClients = await self.clients.matchAll({ type: 'window' });

            // Essayer de réutiliser un onglet existant
            for (const client of allClients) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }

            // Sinon, ouvrir un nouvel onglet
            return self.clients.openWindow(url);
        })()
    );
});