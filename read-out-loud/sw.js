// Service Worker for offline functionality
const CACHE_VERSION = 'v3.2.0';
const CACHE_NAME = `tts-reader-${CACHE_VERSION}`;

// Assets to cache (relative to service worker scope)
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

// Resolve relative paths to absolute using SW scope
function resolveAssetPaths() {
  const scope = self.registration.scope;
  return STATIC_ASSETS.map(asset => {
    if (asset === './') return scope;
    return new URL(asset, scope).pathname;
  });
}

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
      .then(() => self.skipWaiting())
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
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!request.url.startsWith('http')) {
    return;
  }

  // For navigation requests, network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Try to serve the index.html from cache using the SW scope
          const scope = self.registration.scope;
          return caches.match(scope) || caches.match(new URL('./index.html', scope).href);
        })
    );
    return;
  }

  // For API requests, network-only
  if (url.pathname.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // For static assets, cache-first strategy
  // Match by pathname, stripping query params (cache-busting params like ?v=)
  const resolvedPaths = resolveAssetPaths();
  const isStaticAsset = resolvedPaths.some(assetPath => url.pathname === assetPath || url.pathname.endsWith(assetPath));

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true })
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(response => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
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

  // For external CDN resources, cache-first
  if (EXTERNAL_ASSETS.includes(request.url)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
        .catch(() => {
          console.warn(`Failed to fetch external resource: ${request.url}`);
          return new Response('External resource unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        })
    );
    return;
  }

  // Everything else: network-first
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
