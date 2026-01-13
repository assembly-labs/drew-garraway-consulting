// Service Worker for offline functionality
const CACHE_VERSION = 'v2.4.0';
const CACHE_NAME = `tts-reader-${CACHE_VERSION}`;

// Assets to cache
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/speech.js',
  './js/storage.js',
  './js/ui.js',
  './js/fileImport.js',
  './js/premiumTTS.js',
  './js/googleTTS.js',
  './manifest.json'
];

// External CDN resources to cache
const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('Service Worker: Caching static assets');

        // Cache static assets
        await cache.addAll(STATIC_ASSETS);

        // Try to cache external resources but don't fail if they're unavailable
        for (const url of EXTERNAL_ASSETS) {
          try {
            await cache.add(url);
          } catch (error) {
            console.warn(`Failed to cache external resource: ${url}`, error);
          }
        }
      })
      .then(() => self.skipWaiting()) // Activate immediately
      .catch(error => {
        console.error('Service Worker: Cache installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('tts-reader-')) {
              console.log('Service Worker: Removing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Take control of all clients
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension and other non-http protocols
  if (!request.url.startsWith('http')) {
    return;
  }

  // For navigation requests, always try network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For API requests, use network-only strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // For static assets, use cache-first strategy
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            // Return cached version
            return response;
          }
          // If not in cache, fetch from network and cache it
          return fetch(request)
            .then(response => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response before caching
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });

              return response;
            });
        })
    );
    return;
  }

  // For external CDN resources, use cache-first with network fallback
  if (EXTERNAL_ASSETS.includes(request.url)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
        .catch(() => {
          // Return a fallback response if both cache and network fail
          console.warn(`Failed to fetch external resource: ${request.url}`);
          return new Response('External resource unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  // For everything else, use network-first strategy
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});