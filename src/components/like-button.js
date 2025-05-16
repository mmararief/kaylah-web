import { likeStory, unlikeStory, isStoryLiked } from '../util/db';

class LikeButton extends HTMLElement {
  constructor() {
    super();
    this._story = null;
    this._liked = false;
    this._likeButtonClickHandler = this._handleLikeButtonClick.bind(this);
  }

  set story(story) {
    this._story = story;
    this._checkLikeStatus();
  }

  async _checkLikeStatus() {
    if (!this._story) return;
    
    try {
      this._liked = await isStoryLiked(this._story.id);
      this.render();
    } catch (error) {
      console.error('Error checking like status:', error);
      this._liked = false;
      this.render();
    }
  }

  async _handleLikeButtonClick(event) {
    event.preventDefault();
    
    if (!this._story) return;
    
    try {
      // Toggle liked state
      if (this._liked) {
        await unlikeStory(this._story.id);
        this._liked = false;
      } else {
        await likeStory(this._story);
        this._liked = true;
      }
      
      this.render();
      
      // Dispatch event that the like status has changed
      this.dispatchEvent(new CustomEvent('likeStatusChanged', {
        detail: {
          storyId: this._story.id,
          liked: this._liked
        },
        bubbles: true
      }));
    } catch (error) {
      console.error('Error handling like button click:', error);
    }
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click', this._likeButtonClickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._likeButtonClickHandler);
  }

  render() {
    const fillColor = this._liked ? '#B03052' : 'none';
    const strokeColor = this._liked ? '#B03052' : '#666';
    const likeText = this._liked ? 'Disukai' : 'Suka';
    
    this.innerHTML = `
      <button class="like-button ${this._liked ? 'liked' : ''}" aria-label="${likeText}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>${likeText}</span>
      </button>
    `;
  }
}

customElements.define('like-button', LikeButton);

export default LikeButton; 