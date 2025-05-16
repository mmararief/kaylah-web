import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let map;
let markers = [];

export const initMap = (containerId = 'map', onMapClick) => {
  // Check if element exists
  const mapElement = document.getElementById(containerId);
  if (!mapElement) return null;
  
  // Check if map is already initialized on this element
  if (mapElement._leafletMap) {
    map = mapElement._leafletMap;
    return map;
  }
  
  map = L.map(containerId).setView([-2.548926, 118.0148634], 5); // Default to Indonesia

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if (onMapClick) {
    map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      onMapClick(lat, lng);
    });
  }
  
  // Store reference to map in DOM element
  mapElement._leafletMap = map;
  
  return map;
};

// Create a custom icon using SVG that matches our design
const customIcon = L.divIcon({
  html: `
    <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0C8.064 0 0 8.064 0 18C0 31.5 18 48 18 48C18 48 36 31.5 36 18C36 8.064 27.936 0 18 0ZM18 24.3C14.508 24.3 11.7 21.492 11.7 18C11.7 14.508 14.508 11.7 18 11.7C21.492 11.7 24.3 14.508 24.3 18C24.3 21.492 21.492 24.3 18 24.3Z" fill="#B03052"/>
    </svg>
  `,
  className: '',
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -48]
});

export const addMarker = (lat, lon, popupText) => {
  if (!map) return null;
  
  const marker = L.marker([lat, lon], {
    icon: customIcon,
    title: popupText || 'Selected Location',
    alt: popupText || 'Selected Location',
  }).addTo(map);
  
  if (popupText) {
    marker.bindPopup(popupText).openPopup();
  }
  
  markers.push(marker);
  
  // Center map on the new marker with some animation
  map.setView([lat, lon], map.getZoom() || 13, {
    animate: true,
    duration: 0.5
  });
  
  return marker;
};

export const clearMarkers = () => {
  markers.forEach(marker => marker.remove());
  markers = [];
};

export const loadMarkers = (stories) => {
  if (!map) return;
  clearMarkers();

  const bounds = L.latLngBounds();
  let hasValidCoordinates = false;

  stories.forEach(story => {
    if (story.lat && story.lon) {
      const popupText = `
        <div class="map-popup">
          <strong>${story.name || 'No Title'}</strong>
          <p>${story.description ? story.description.substring(0, 100) + (story.description.length > 100 ? '...' : '') : 'No Description'}</p>
          <a href="#detail/${story.id}" class="map-popup-link">Lihat Detail</a>
        </div>
      `;
      addMarker(story.lat, story.lon, popupText);
      bounds.extend([story.lat, story.lon]);
      hasValidCoordinates = true;
    }
  });

  if (hasValidCoordinates) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
};

export const removeMarker = (marker) => {
  if (!marker) return;
  marker.remove();
  markers = markers.filter(m => m !== marker);
};
