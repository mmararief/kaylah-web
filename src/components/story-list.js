import L from 'leaflet';
import './like-button';

function escapeHtml(text) {
  if (!text) return '';
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

class StoryList extends HTMLElement {
  constructor() {
    super();
    this._stories = [];
    this._likeStatusChangedHandler = this._handleLikeStatusChanged.bind(this);
  }
  
  set stories(value) {
    this._stories = value;
    this.render();
  }
  
  connectedCallback() {
    this.addEventListener('likeStatusChanged', this._likeStatusChangedHandler);
  }
  
  disconnectedCallback() {
    this.removeEventListener('likeStatusChanged', this._likeStatusChangedHandler);
  }
  
  _handleLikeStatusChanged(event) {
    const { storyId, liked } = event.detail;
    console.log(`Story ${storyId} like status changed to ${liked ? 'liked' : 'unliked'}`);
    
    // Update UI if needed based on like status change
    // (This is handled automatically by the like-button component)
  }

  render() {
    if (!this._stories || this._stories.length === 0) {
      this.innerHTML = '<p class="no-stories">Tidak ada cerita tersedia</p>';
      return;
    }

    // Add CSS styles inline to override any existing styles
    const styles = `
      <style>
        story-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          width: 100%;
        }
        
        @media (min-width: 600px) {
          story-list ul {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          story-list ul {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        story-list li {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.05);
          cursor: pointer;
          height: auto;
          width: 100%;
          margin-bottom: 0;
        }
        
        story-list .story-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }
        
        story-list .story-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        
        story-list .story-author {
          font-weight: bold;
          color: #B03052;
          font-size: 1rem;
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        story-list .story-date {
          font-size: 0.85rem;
          color: #777;
          white-space: nowrap;
        }
        
        story-list .story-image-container {
          width: 100%;
          height: 0;
          padding-bottom: 70%;  /* Creates a consistent aspect ratio */
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }
        
        story-list img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          border-radius: 8px;
        }
        
        story-list li:hover img {
          transform: scale(1.03);
        }
        
        story-list .story-description {
          font-size: 0.95rem;
          line-height: 1.5;
          color: #333;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 4.5em;
          flex-grow: 1;
        }
        
        story-list .story-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid #f0f0f0;
        }
        
        story-list .story-location {
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          color: #666;
        }
      </style>
    `;

    let html = styles + '<ul>';
    for (let i = 0; i < this._stories.length; i++) {
      const story = this._stories[i];
      let createdDate = 'Unknown';
      if (story.createdAt) {
        const d = new Date(story.createdAt);
        createdDate = d.toLocaleDateString();
      }
      
      // Truncate description if it's too long
      let description = story.description || '';
      const name = story.name || 'Unknown';
      
      const hasLocation = story.lat !== undefined && story.lon !== undefined && 
                            story.lat !== null && story.lon !== null && 
                            !isNaN(story.lat) && !isNaN(story.lon);
      
      html += `
        <li data-story-id="${story.id}">
          <a href="#detail/${encodeURIComponent(story.id)}" class="story-link">
            <div class="story-header">
              <div class="story-author">${escapeHtml(name)}</div>
              <div class="story-date">${createdDate}</div>
            </div>
            <div class="story-image-container">
              <img src="${escapeHtml(story.photoUrl)}" alt="Story by ${escapeHtml(name)}" loading="lazy" />
            </div>
            <div class="story-description">${escapeHtml(description)}</div>
          </a>
          <div class="story-footer">
            ${hasLocation ? '<div class="story-location">📍 Lihat lokasi di halaman detail</div>' : '<div></div>'}
            <div class="story-actions" id="like-button-container-${story.id}"></div>
          </div>
        </li>
      `;
    }
    html += '</ul>';
    
    this.innerHTML = html;
    
    // Add like buttons after DOM is populated
    this._stories.forEach(story => {
      const likeButtonContainer = this.querySelector(`#like-button-container-${story.id}`);
      if (likeButtonContainer) {
        const likeButton = document.createElement('like-button');
        likeButton.story = story;
        likeButtonContainer.appendChild(likeButton);
      }
    });
  }
}

customElements.define('story-list', StoryList);
