import { addStory } from '../util/api';
import { renderAddStoryPage } from '../views/add-story-page';
import { initCamera, stopCamera, capturePhoto } from '../util/camera';
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
  const photoPreview = document.getElementById('photo-preview');
  const getLocationButton = document.getElementById('get-location');
  const cameraContainer = document.querySelector('.camera-container');

  // Handle map initialization and click events
  const onMapClick = (lat, lng) => {
    if (currentMarker) {
      currentMarker.remove();
    }
    currentMarker = addMarker(lat, lng);
    form.lat.value = lat.toFixed(6);
    form.lon.value = lng.toFixed(6);
  };

  // Initialize map
  initMap('map', onMapClick);

  // Handle file input change for preview
  photoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
        photoPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle camera button click
  captureButton.addEventListener('click', async () => {
    if (cameraContainer.classList.contains('active')) {
      // Camera is already active, take a picture
      const blob = await capturePhoto(video, canvas);
      if (blob) {
        // Create a file from the blob
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        
        // Create a FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;
        
        // Update preview
        photoPreview.src = URL.createObjectURL(blob);
        
        // Hide camera
        cameraContainer.classList.remove('active');
        stopCamera();
      }
    } else {
      // Activate camera
      cameraContainer.classList.add('active');
      const success = await initCamera(video, canvas, null, photoInput);
      
      if (!success) {
        alert('Gagal mengakses kamera. Pastikan izin kamera diaktifkan.');
        cameraContainer.classList.remove('active');
      }
    }
  });

  // Handle get current location button
  getLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
      getLocationButton.textContent = 'Mendapatkan lokasi...';
      getLocationButton.disabled = true;
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Update form fields
          form.lat.value = lat.toFixed(6);
          form.lon.value = lng.toFixed(6);
          
          // Update map
          if (currentMarker) {
            currentMarker.remove();
          }
          currentMarker = addMarker(lat, lng);
          
          // Center map view
          const map = document.getElementById('map')._leafletMap;
          if (map) {
            map.setView([lat, lng], 13);
          }
          
          // Reset button
          getLocationButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="currentColor"/>
            </svg>
            <span>Dapatkan Lokasi Saat Ini</span>
          `;
          getLocationButton.disabled = false;
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
          getLocationButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="currentColor"/>
            </svg>
            <span>Dapatkan Lokasi Saat Ini</span>
          `;
          getLocationButton.disabled = false;
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation tidak didukung di browser Anda.');
    }
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = form.querySelector('.submit-button');
    const originalButtonText = submitButton.innerHTML;
    
    try {
      // Show loading state
      submitButton.innerHTML = 'Mengunggah...';
      submitButton.disabled = true;
      
      const description = form.description.value;
      const photo = form.photo.files[0];
      const lat = form.lat.value ? parseFloat(form.lat.value) : null;
      const lon = form.lon.value ? parseFloat(form.lon.value) : null;

      if (!photo) {
        alert('Silakan pilih foto terlebih dahulu.');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        return;
      }

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
        alert(result.message || 'Terjadi kesalahan saat menambahkan cerita.');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menambahkan cerita.');
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
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
