// Service Worker for handling push notifications

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  return self.clients.claim();
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