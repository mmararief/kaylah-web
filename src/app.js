import './styles/style.css';
import { handleHomePage } from './presenter/home-presenter';
import { handleAddStoryPage } from './presenter/add-story-presenter';
import { handleLoginPage } from './presenter/login-presenter';
import { handleRegisterPage } from './presenter/register-presenter';
import { handleStoryDetailPage } from './presenter/story-detail-presenter';
import { handleLikedStoriesPage } from './presenter/liked-stories-presenter';
import { handleNotFoundPage } from './presenter/not-found-presenter';
import { logoutUser } from './util/api';
import { stopCamera } from './util/camera';
import { 
  registerServiceWorker, 
  requestNotificationPermission, 
  subscribeToPushNotification,
  unsubscribeFromPushNotification,
  checkSubscription
} from './util/notification';

// Function to check online status and update UI
function updateOnlineStatus() {
  const statusElement = document.getElementById('network-status');
  if (!statusElement) return;
  
  if (navigator.onLine) {
    statusElement.textContent = 'online';
    statusElement.className = 'status-online';
  } else {
    statusElement.textContent = 'offline';
    statusElement.className = 'status-offline';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const skipLink = document.querySelector('.skip-link');

  // Register service worker and request notification permission
  initializeNotifications();

  // Function to update nav links visibility based on login state
  function updateNavLinks() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');
    const homeLink = document.getElementById('home-link');
    const addStoryLink = document.getElementById('add-story-link');
    const likedStoriesLink = document.getElementById('liked-stories-link');

    if (token) {
      // User is logged in
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
      if (logoutLink) logoutLink.style.display = '';
      if (homeLink) homeLink.style.display = '';
      if (addStoryLink) addStoryLink.style.display = '';
      if (likedStoriesLink) likedStoriesLink.style.display = '';
    } else {
      // User is not logged in
      if (loginLink) loginLink.style.display = '';
      if (registerLink) registerLink.style.display = '';
      if (logoutLink) logoutLink.style.display = 'none';
      if (homeLink) homeLink.style.display = 'none';
      if (addStoryLink) addStoryLink.style.display = 'none';
      if (likedStoriesLink) likedStoriesLink.style.display = 'none';
    }
  }

  // Set up logout functionality
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
      updateNavLinks();
    });
  }

  updateNavLinks();

  // Initialize notifications related functionality
  async function initializeNotifications() {
    try {
      // Register service worker
      const swRegistration = await registerServiceWorker();
      
      if (swRegistration) {
        console.log('Service Worker registered successfully');
        
        // Request notification permission
        const permissionGranted = await requestNotificationPermission();
        
        if (permissionGranted) {
          console.log('Notification permission granted');
          
          // Check if user is logged in
          const token = localStorage.getItem('token');
          if (token) {
            // Auto-subscribe to push notifications
            const isSubscribed = await checkSubscription();
            if (!isSubscribed) {
              const subscription = await subscribeToPushNotification();
              if (subscription) {
                console.log('Successfully subscribed to push notifications');
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  // Add notification settings to the UI
  function setupNotificationSettings() {
    const token = localStorage.getItem('token');
    if (!token) return;

    checkSubscription().then(isSubscribed => {
      // Create or update notification settings UI element
      let notifSettings = document.getElementById('notification-settings');
      
      if (!notifSettings) {
        notifSettings = document.createElement('div');
        notifSettings.id = 'notification-settings';
        notifSettings.classList.add('notification-settings');
        document.querySelector('header').appendChild(notifSettings);
      }
      
      notifSettings.innerHTML = `
        <button id="notification-toggle">
          ${isSubscribed ? 'Nonaktifkan Notifikasi' : 'Aktifkan Notifikasi'}
        </button>
      `;
      
      document.getElementById('notification-toggle').addEventListener('click', async () => {
        if (isSubscribed) {
          const success = await unsubscribeFromPushNotification();
          if (success) {
            alert('Notifikasi berhasil dinonaktifkan');
            setupNotificationSettings();
          }
        } else {
          const subscription = await subscribeToPushNotification();
          if (subscription) {
            alert('Notifikasi berhasil diaktifkan');
            setupNotificationSettings();
          }
        }
      });
    });
  }

  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const hash = window.location.hash;

      let focusElement = mainContent; 

      switch (hash) {
        case '#add-story':
          focusElement = document.getElementById('add-story-form') || mainContent;
          break;
        case '#login':
          focusElement = document.getElementById('login-form') || mainContent;
          break;
        case '#register':
          focusElement = document.getElementById('register-form') || mainContent;
          break;
        default:
          focusElement = mainContent;
      }

      focusElement.setAttribute('tabindex', '-1');
      focusElement.focus();
      window.history.replaceState(null, '', '#main-content');
    });
  }

  const renderPage = () => {
    stopCamera(); 

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        const token = localStorage.getItem('token');
        const hash = window.location.hash;

        // Handle story detail route like #detail/story-123
        if (hash.startsWith('#detail/')) {
          if (!token) {
            window.location.hash = '#login';
            return;
          }
          const storyId = hash.substring('#detail/'.length);
          handleStoryDetailPage(storyId);
          return;
        }
      
        if (!token && hash !== '#login' && hash !== '#register') {
          window.location.hash = '#login';
          return;
        }

        switch (hash) {
          case '#home':
            handleHomePage();
            break;
          case '#add-story':
            handleAddStoryPage();
            break;
          case '#login':
            handleLoginPage();
            break;
          case '#register':
            handleRegisterPage();
            break;
          case '#liked':
            handleLikedStoriesPage();
            break;
          default:
            handleNotFoundPage();
        }

        // Update notification settings if user is logged in
        if (token) {
          setupNotificationSettings();
        }
      });
    } else {
      mainContent.style.transition = 'opacity 0.5s ease-in-out';
      mainContent.style.opacity = '0';

      setTimeout(() => {
        stopCamera(); // Stop camera on every page change

        const token = localStorage.getItem('token');
        const hash = window.location.hash;

        // Handle story detail route like #detail/story-123
        if (hash.startsWith('#detail/')) {
          if (!token) {
            window.location.hash = '#login';
            return;
          }
          const storyId = hash.substring('#detail/'.length);
          handleStoryDetailPage(storyId);
          mainContent.style.opacity = '1';
          return;
        }

        // Redirect to login if not logged in
        if (!token && hash !== '#login' && hash !== '#register') {
          window.location.hash = '#login';
          return;
        }

        switch (hash) {
          case '#home':
            handleHomePage();
            break;
          case '#add-story':
            handleAddStoryPage();
            break;
          case '#login':
            handleLoginPage();
            break;
          case '#register':
            handleRegisterPage();
            break;
          case '#liked':
            handleLikedStoriesPage();
            break;
          default:
            handleNotFoundPage();
        }

        // Update notification settings if user is logged in
        if (token) {
          setupNotificationSettings();
        }

        mainContent.style.opacity = '1';
      }, 300);
    }
  };

  // Event listeners for hashchange and load
  window.addEventListener('hashchange', () => {
    updateNavLinks();
    renderPage();
  });
  window.addEventListener('load', () => {
    updateNavLinks();
    renderPage();
  });

  // Add network status indicator to the UI
  const createNetworkStatusUI = () => {
    const header = document.querySelector('header');
    if (!header) return;
    
    const statusContainer = document.createElement('div');
    statusContainer.className = 'network-status-container';
    statusContainer.innerHTML = `
      <span>Status: </span>
      <span id="network-status">online</span>
    `;
    
    header.appendChild(statusContainer);
    
    // Set initial status
    updateOnlineStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  };
  
  createNetworkStatusUI();

  // Check if content is available in cache on page load
  const preloadCachedContent = async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('dicoding-story-static-v1');
        const keys = await cache.keys();
        console.log('Cached resources:', keys.length);
        
        // Add visual indicator for users
        const mainContent = document.getElementById('main-content');
        if (keys.length > 0 && mainContent) {
          const offlineIndicator = document.createElement('div');
          offlineIndicator.className = 'offline-indicator';
          offlineIndicator.textContent = 'Konten tersedia offline';
          offlineIndicator.style.display = 'none';
          
          mainContent.parentNode.insertBefore(offlineIndicator, mainContent);
          
          // Only show when offline
          window.addEventListener('offline', () => {
            offlineIndicator.style.display = 'block';
          });
          
          window.addEventListener('online', () => {
            offlineIndicator.style.display = 'none';
          });
        }
      } catch (error) {
        console.error('Error checking cache:', error);
      }
    }
  };
  
  preloadCachedContent();
});
