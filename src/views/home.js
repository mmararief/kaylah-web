import '../components/story-list';

export function renderHomePage(stories) {
  const mainContent = document.getElementById('main-content');
  
  // First render the application shell with skeleton loaders
  mainContent.innerHTML = `
    <div class="home-container">
      <h2 class="section-title">Cerita Terbaru</h2>
      <div id="map" style="height: 250px; margin-bottom: 20px; border-radius: 8px; display: none;"></div>
      <div id="stories-container" class="stories-container" style="display: block; width: 100%; margin: 0 auto;">
        ${!stories ? generateSkeletons(6) : ''}
      </div>
    </div>
  `;

  // If we already have stories, render them immediately
  if (stories && Array.isArray(stories)) {
    const storyList = document.createElement('story-list');
    storyList.stories = stories;
    storyList.style.width = '100%';
    storyList.style.display = 'block';
    
    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = '';
    
    // Add some style to the stories container
    storiesContainer.style.width = '100%';
    storiesContainer.style.display = 'block';
    storiesContainer.style.margin = '0 auto';
    
    storiesContainer.appendChild(storyList);
    
    // Show map if stories have location
    const hasLocations = stories.some(story => 
      story.lat && story.lon && !isNaN(story.lat) && !isNaN(story.lon)
    );
    
    if (hasLocations) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.style.display = 'block';
      }
    }
  } else {
    // Otherwise, manually fetch stories if we're online
    if (navigator.onLine) {
      const token = localStorage.getItem('token');
      if (token) {
        // Show "loading" message
        const loadingMsg = document.createElement('p');
        loadingMsg.textContent = 'Memuat cerita...';
        loadingMsg.id = 'loading-message';
        loadingMsg.className = 'loading-message';
        
        const storiesContainer = document.getElementById('stories-container');
        if (storiesContainer) {
          storiesContainer.appendChild(loadingMsg);
        }
      }
    } else {
      // Show offline message if we have no stories and we're offline
      const offlineMsg = document.createElement('div');
      offlineMsg.className = 'offline-message';
      offlineMsg.innerHTML = `
        <p>Anda sedang offline. Koneksi internet diperlukan untuk melihat cerita terbaru.</p>
        <p>Silakan cek koneksi internet Anda dan coba lagi.</p>
      `;
      
      const storiesContainer = document.getElementById('stories-container');
      if (storiesContainer) {
        storiesContainer.innerHTML = '';
        storiesContainer.appendChild(offlineMsg);
      }
    }
  }
}

// Generate skeleton loaders for content that's loading
function generateSkeletons(count) {
  let skeletons = `
    <style>
      .stories-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        width: 100%;
      }
      
      @media (min-width: 600px) {
        .stories-container {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (min-width: 1024px) {
        .stories-container {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      .story-skeleton {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .skeleton-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      
      .skeleton-image {
        width: 100%;
        height: 0;
        padding-bottom: 70%;
        position: relative;
        margin-bottom: 0.75rem;
        border-radius: 8px;
      }
    </style>
  `;
  
  for (let i = 0; i < count; i++) {
    skeletons += `
      <div class="story-skeleton">
        <div class="skeleton-header">
          <div class="skeleton-loader" style="width: 40%; height: 15px;"></div>
          <div class="skeleton-loader" style="width: 20%; height: 10px;"></div>
        </div>
        <div class="skeleton-loader skeleton-image"></div>
        <div class="skeleton-loader" style="width: 90%; height: 15px; margin-bottom: 8px;"></div>
        <div class="skeleton-loader" style="width: 70%; height: 15px; margin-bottom: 8px;"></div>
        <div class="skeleton-loader" style="width: 50%; height: 15px; margin-top: auto; margin-bottom: 0;"></div>
      </div>
    `;
  }
  return skeletons;
}
