import { fetchStories } from '../util/api';
import { renderHomePage } from '../views/home';
import { initMap, loadMarkers } from '../util/map';

export const handleHomePage = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<p>Silakan login terlebih dahulu untuk melihat cerita.</p>';
    return;
  }

  try {
    const stories = await fetchStories(token);
    renderHomePage(stories);

    // Check if map container exists before initializing
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      // Initialize map and load markers
      initMap('map');
      loadMarkers(stories);
    }
  } catch (error) {
    console.error('Error fetching stories:', error);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<p>Gagal memuat cerita.</p>';
  }
};
