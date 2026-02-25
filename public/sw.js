const CACHE_NAME = 'executive-checklist-cache-v1';

// Add assets you want to cache for offline support
const STATIC_ASSETS = [
  './',
  './index.html',
  './index.css',
  './sw.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      // using catch to avoid full install failure if a CDN request fails
      return cache.addAll(STATIC_ASSETS).catch(error => {
        console.error('Failed to cache standard assets', error);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests (Ignore POST requests like Gemini API calls)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Cache hit - return response
      if (cachedResponse) {
        return cachedResponse;
      }

      // Not in cache - fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the response because it's a stream and can only be consumed once
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Custom offline fallback could be added here
        console.warn('Network request failed and no cache available for: ', event.request.url);
      });
    })
  );
});
