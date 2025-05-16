const API_URL = 'https://story-api.dicoding.dev/v1';
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Function to convert the VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if service worker and push notification are supported
export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Register the service worker
export const registerServiceWorker = async () => {
  if (!isPushNotificationSupported()) {
    console.log('Push notifications not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register('service-worker.js');
    console.log('Service Worker registered with scope:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Subscribe to push notifications
export const subscribeToPushNotification = async () => {
  if (!isPushNotificationSupported()) {
    alert('Push notifications not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Anda harus login terlebih dahulu.');
      return null;
    }

    // Get existing subscription or create a new one
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Already subscribed
      return subscription;
    }

    // Subscribe
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // Send subscription to server
    const response = await fetch(`${API_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))))
        }
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.message);
    }

    console.log('Push notification subscription successful');
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    alert('Gagal berlangganan notifikasi: ' + error.message);
    return null;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotification = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Not subscribed
      return true;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Anda harus login terlebih dahulu.');
      return false;
    }

    // Send unsubscribe request to server
    const response = await fetch(`${API_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.message);
    }

    // Unsubscribe locally
    await subscription.unsubscribe();
    console.log('Successfully unsubscribed from push notifications');
    return true;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    alert('Gagal berhenti berlangganan notifikasi: ' + error.message);
    return false;
  }
};

// Check subscription status
export const checkSubscription = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}; 