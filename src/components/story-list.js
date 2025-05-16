import L from 'leaflet';

function escapeHtml(text) {
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
  set stories(value) {
    this._stories = value;
    this.render();
  }

  render() {
    if (!this._stories || this._stories.length === 0) {
      this.innerHTML = '<p>No stories available</p>';
      return;
    }

    var html = '<ul>';
    for (var i = 0; i < this._stories.length; i++) {
      var story = this._stories[i];
      var createdDate = 'Unknown';
      if (story.createdAt) {
        var d = new Date(story.createdAt);
        createdDate = d.toLocaleDateString();
      }
      html += '<li>' +
                '<a href="#detail/' + encodeURIComponent(story.id) + '" class="story-link">' +
                  '<div class="story-header">' +
                    '<div class="story-author">' + escapeHtml(story.name) + '</div>' +
                    '<div class="story-date">' + createdDate + '</div>' +
                  '</div>' +
                  '<img src="' + escapeHtml(story.photoUrl) + '" alt="Story by ' + escapeHtml(story.name) + '" />' +
                  '<div class="story-description">' + escapeHtml(story.description) + '</div>';
      
      if (story.lat !== undefined && story.lon !== undefined && story.lat !== null && story.lon !== null && !isNaN(story.lat) && !isNaN(story.lon)) {
        html += '<div class="story-location">📍 Lihat lokasi di halaman detail</div>';
      }
                
      html += '</a></li>';
    }
    html += '</ul>';
    this.innerHTML = html;
  }
}

customElements.define('story-list', StoryList);
