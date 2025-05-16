importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  // App Shell (HTML) - Network First
  workbox.routing.registerRoute(
    ({request}) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 20 }),
      ],
    })
  );

  // Static Assets (JS, CSS, Images) - Stale While Revalidate
  workbox.routing.registerRoute(
    ({request}) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'assets',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
      ],
    })
  );

  // API caching - Network First, fallback to cache if offline
  workbox.routing.registerRoute(
    // Ganti regex sesuai endpoint API kamu
    ({url}) => url.pathname.startsWith('/api/') || url.pathname.startsWith('/v1/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 30 }),
      ],
    })
  );

  // External images (misal dari CDN) - Stale While Revalidate
  workbox.routing.registerRoute(
    ({request, url}) => request.destination === 'image' && url.origin !== self.location.origin,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'external-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
      ],
    })
  );

  // Offline fallback for navigation
  workbox.routing.setCatchHandler(async ({event}) => {
    if (event.request.destination === 'document') {
      return caches.match('/offline.html');
    }
    return Response.error();
  });

  // Push notification handler
  self.addEventListener('push', (event) => {
    let title = 'Notifikasi Dicoding Story';
    let options = {
      body: 'Anda memiliki pemberitahuan baru.',
      icon: 'icon-192x192.png',
      badge: 'icon-192x192.png',
      data: { url: '/' }
    };

    if (event.data) {
      try {
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
        options.body = event.data.text();
      }
    }

    event.waitUntil(self.registration.showNotification(title, options));
  });

} else {
  console.log('Workbox gagal dimuat');
} 