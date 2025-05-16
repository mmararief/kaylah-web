import { addStory } from '../util/api';
import { renderAddStoryPage } from '../views/add-story-page';
import { initCamera, stopCamera } from '../util/camera';
import { initMap, addMarker } from '../util/map';
import { checkSubscription } from '../util/notification';

let currentMarker = null;

export const handleAddStoryPage = () => {
  renderAddStoryPage();

  const form = document.getElementById('add-story-form');
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureButton = document.getElementById('capture-button');
  const photoInput = document.getElementById('photo');

  const onMapClick = (lat, lng) => {
    if (currentMarker) {
      currentMarker.remove();
    }
    addMarker(lat, lng);
    form.lat.value = lat;
    form.lon.value = lng;
  };

  initCamera(video, canvas, captureButton, photoInput);
  initMap('map', onMapClick);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = form.description.value;
    const photo = form.photo.files[0];
    const lat = form.lat.value ? parseFloat(form.lat.value) : null;
    const lon = form.lon.value ? parseFloat(form.lon.value) : null;

    try {
      const result = await addStory(description, photo, lat, lon);
      if (!result.error) {
        alert('Cerita berhasil ditambahkan!');
        
        // Check if user is subscribed to push notifications
        const isSubscribed = await checkSubscription();
        
        // Show local notification if not using push notifications
        if (!isSubscribed && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Story berhasil dibuat', {
            body: `Anda telah membuat story baru dengan deskripsi: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`,
            icon: 'icon-192x192.png'
          });
        }
        
        stopCamera();
        window.location.hash = '#home';
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menambahkan cerita.');
    }
  });
};

export const cleanupAddStoryPage = () => {
  stopCamera();
  if (currentMarker) {
    currentMarker.remove();
    currentMarker = null;
  }
};
