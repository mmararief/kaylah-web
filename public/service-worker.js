// Service Worker for handling push notifications

// Cache names
const CACHE_NAME = 'dicoding-story-v1';
const STATIC_CACHE_NAME = 'dicoding-story-static-v1';
const DYNAMIC_CACHE_NAME = 'dicoding-story-dynamic-v1';

// Application Shell - Critical files that make up the app shell
const APP_SHELL_FILES = [
  './',
  './index.html',
  './bundle.js',
  './manifest.json',
  './favicon.ico',
  './icon-128x128.png',
  './icon-192x192.png',
  './icon-512x512.png',
  './offline.html',
];

// Limit cache size for dynamic cache
const DYNAMIC_CACHE_LIMIT = 50;

// Install event - Cache the app shell
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(APP_SHELL_FILES);
      })
      .then(() => {
        console.log('App shell cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache app shell:', error);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  const currentCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            console.log('Deleting old cache:', cacheToDelete);
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to trim cache entries
const trimCache = (cacheName, maxItems) => {
  caches.open(cacheName)
    .then((cache) => {
      return cache.keys()
        .then((keys) => {
          if (keys.length > maxItems) {
            cache.delete(keys[0])
              .then(() => trimCache(cacheName, maxItems));
          }
        });
    });
};

// Helper function to check if a URL can be cached
const isCacheableRequest = (url) => {
  const urlObj = new URL(url);
  return (
    (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && 
    !urlObj.pathname.includes('/v1/') &&
    !urlObj.pathname.includes('/api/')
  );
};

// Fetch event - Serve from cache, then network with cache update, then offline page
self.addEventListener('fetch', (event) => {
  // Skip non-cacheable URLs like chrome-extension:// URLs
  if (!isCacheableRequest(event.request.url)) {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Don't cache API requests
  if (requestUrl.pathname.includes('/v1/')) {
    return;
  }

  // For HTML navigation requests - Cache-first, fallback to network, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Cache new responses for later
              if (fetchResponse.ok) {
                return caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => {
                    try {
                      cache.put(event.request, fetchResponse.clone());
                      trimCache(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
                    } catch (error) {
                      console.error('Cache put error:', error);
                    }
                    return fetchResponse;
                  });
              }
              return fetchResponse;
            });
        })
        .catch(() => {
          // Return offline page if both cache and network fail
          return caches.match('./offline.html');
        })
    );
  } else {
    // For non-HTML requests - Cache first, network fallback
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached response if found
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Cache new responses for static assets
              if (
                !requestUrl.pathname.startsWith('/api/') &&
                fetchResponse.status === 200
              ) {
                return caches.open(DYNAMIC_CACHE_NAME)
                  .then((cache) => {
                    try {
                      cache.put(event.request, fetchResponse.clone());
                      trimCache(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
                    } catch (error) {
                      console.error('Cache put error:', error);
                    }
                    return fetchResponse;
                  });
              }
              return fetchResponse;
            });
        })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received', event);

  let title = 'Notifikasi Dicoding Story';
  let options = {
    body: 'Anda memiliki pemberitahuan baru.',
    icon: 'icon-192x192.png',
    badge: 'icon-192x192.png',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      // Try to parse as JSON
      const data = event.data.json();
      title = data.title || title;
      
      if (data.options) {
        options = {
          ...options,
          body: data.options.body || options.body,
          data: { url: data.options.url || options.data.url }
        };
      }
    } catch (error) {
      // If not valid JSON, use the text content instead
      console.log('Could not parse push data as JSON, using as text:', error);
      options.body = event.data.text();
    }
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);
  
  event.notification.close();

  // Handle notification click
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
}); 