export const renderAddStoryPage = () => {
  const html = `
    <div class="add-story-container">
      <h2 class="section-title">Tambah Cerita Baru</h2>
      
      <div class="add-story-card">
        <form id="add-story-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="description">Deskripsi Cerita:</label>
            <textarea id="description" name="description" required placeholder="Ceritakan pengalaman menarikmu..."></textarea>
          </div>

          <div class="form-group">
            <label>Foto Cerita:</label>
            <div class="photo-input-container">
              <div class="preview-container">
                <img id="photo-preview" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E" alt="Preview Foto">
              </div>
              <div class="upload-options">
                <div class="upload-option">
                  <label for="photo" class="custom-file-upload">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 7V5H5V7H19ZM15 11H9V9H15V11ZM19 3C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19ZM5 19H19V5H5V19ZM9 13H15V15H9V13Z" fill="currentColor"/>
                    </svg>
                    <span>Pilih File</span>
                  </label>
                  <input type="file" id="photo" name="photo" accept="image/*" required>
                </div>
                <div class="upload-option">
                  <button id="capture-button" type="button" class="camera-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
                      <path d="M20 4H16.83L15.59 2.65C15.22 2.24 14.68 2 14.12 2H9.88C9.32 2 8.78 2.24 8.4 2.65L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" fill="currentColor"/>
                    </svg>
                    <span>Ambil Foto</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="camera-container">
              <video id="video" autoplay></video>
              <canvas id="canvas" style="display: none;"></canvas>
            </div>
          </div>

          <div class="form-group">
            <label>Lokasi:</label>
            <div class="location-container">
              <div id="map" class="story-map"></div>
              <div class="location-inputs">
                <div class="input-group">
                  <label for="lat">Latitude:</label>
                  <input type="number" id="lat" name="lat" step="any" placeholder="Klik pada peta">
                </div>
                <div class="input-group">
                  <label for="lon">Longitude:</label>
                  <input type="number" id="lon" name="lon" step="any" placeholder="Klik pada peta">
                </div>
                <button type="button" id="get-location" class="location-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="currentColor"/>
                  </svg>
                  <span>Dapatkan Lokasi Saat Ini</span>
                </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor"/>
              </svg>
              Tambah Cerita
            </button>
            <a href="#home" class="cancel-button">Batal</a>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('main-content').innerHTML = html;
};
