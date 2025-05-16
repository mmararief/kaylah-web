import L from 'leaflet';
import '../components/like-button';

export function renderStoryDetailPage(story) {
  const mainContent = document.getElementById('main-content');

  if (!story) {
    mainContent.innerHTML = `
      <div class="story-detail-container">
        <p>Cerita tidak ditemukan atau terjadi kesalahan saat memuat.</p>
        <a href="#home">Kembali ke Beranda</a>
      </div>
    `;
    return;
  }

  const createdDate = story.createdAt ? new Date(story.createdAt).toLocaleDateString('id-ID', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Tidak diketahui';

  mainContent.innerHTML = `
    <div class="story-detail-container">
      <a href="#home" class="back-button">&larr; Kembali</a>
      <h2 class="story-detail-title">Cerita dari ${story.name}</h2>
      
      <div class="story-detail-content">
        <div class="story-detail-image-container">
          <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" class="story-detail-image">
        </div>
        
        <div class="story-detail-info">
          <div class="story-detail-header">
            <p class="story-detail-date">Diunggah pada: ${createdDate}</p>
            <div id="detail-like-button"></div>
          </div>
          
          <div class="story-detail-description">
            <h3>Deskripsi</h3>
            <p>${story.description}</p>
          </div>
          
          ${story.lat && story.lon ? `
            <div class="story-detail-location">
              <h3>Lokasi</h3>
              <div id="detail-map" class="story-detail-map"></div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  // Add like button
  const likeButtonContainer = document.getElementById('detail-like-button');
  if (likeButtonContainer) {
    const likeButton = document.createElement('like-button');
    likeButton.story = story;
    likeButtonContainer.appendChild(likeButton);
    
    // Add event listener for like status change
    likeButton.addEventListener('likeStatusChanged', (event) => {
      const { liked } = event.detail;
      console.log(`Story ${story.id} like status changed to ${liked ? 'liked' : 'unliked'}`);
    });
  }

  // Initialize map if latitude and longitude are available
  if (story.lat && story.lon && !isNaN(story.lat) && !isNaN(story.lon)) {
    setTimeout(() => {
      const mapContainer = document.getElementById('detail-map');
      if (mapContainer) {
        const map = L.map(mapContainer).setView([story.lat, story.lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(story.name)
          .openPopup();
      }
    }, 100);
  }
} 