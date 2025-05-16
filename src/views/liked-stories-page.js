import '../components/story-list';
import { getLikedStories, clearLikedStories } from '../util/db';

export function renderLikedStoriesPage() {
  const mainContent = document.getElementById('main-content');
  
  // First render the application shell with skeleton loaders
  mainContent.innerHTML = `
    <div class="home-container">
      <div class="liked-stories-header">
        <h2 class="section-title">Cerita yang Disukai</h2>
        <button id="clear-liked-stories" class="button danger">Hapus Semua</button>
      </div>
      <div id="stories-container" class="stories-container" style="display: block; width: 100%; margin: 0 auto;">
        <p class="loading-message">Memuat cerita yang disukai...</p>
      </div>
    </div>
  `;
  
  // Set up clear button listener
  const clearButton = document.getElementById('clear-liked-stories');
  if (clearButton) {
    clearButton.addEventListener('click', async () => {
      if (confirm('Yakin ingin menghapus semua cerita yang disukai?')) {
        try {
          await clearLikedStories();
          loadLikedStories(); // Reload the page
        } catch (error) {
          console.error('Error clearing liked stories:', error);
        }
      }
    });
  }
  
  // Load liked stories
  loadLikedStories();
}

async function loadLikedStories() {
  const storiesContainer = document.getElementById('stories-container');
  if (!storiesContainer) return;
  
  try {
    const likedStories = await getLikedStories();
    
    if (likedStories.length === 0) {
      storiesContainer.innerHTML = `
        <div class="empty-state">
          <p>Anda belum menyukai cerita apapun</p>
          <a href="#" class="button">Kembali ke Beranda</a>
        </div>
      `;
      return;
    }
    
    // Sort by likedAt timestamp, newest first
    likedStories.sort((a, b) => {
      return new Date(b.likedAt) - new Date(a.likedAt);
    });
    
    const storyList = document.createElement('story-list');
    storyList.stories = likedStories;
    storyList.style.width = '100%';
    storyList.style.display = 'block';
    
    storiesContainer.innerHTML = '';
    storiesContainer.appendChild(storyList);
    
    // Add event listener for like status changes to refresh the list if needed
    document.addEventListener('likeStatusChanged', async (event) => {
      const { storyId, liked } = event.detail;
      if (!liked) {
        // A story was unliked, refresh the list
        loadLikedStories();
      }
    });
    
  } catch (error) {
    console.error('Error loading liked stories:', error);
    storiesContainer.innerHTML = `
      <div class="error-state">
        <p>Gagal memuat cerita yang disukai</p>
        <button id="retry-load" class="button">Coba Lagi</button>
      </div>
    `;
    
    const retryButton = document.getElementById('retry-load');
    if (retryButton) {
      retryButton.addEventListener('click', loadLikedStories);
    }
  }
} 