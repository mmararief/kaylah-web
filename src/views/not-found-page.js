export function renderNotFoundPage() {
  const mainContent = document.getElementById('main-content');
  
  mainContent.innerHTML = `
    <div class="not-found-container">
      <div class="not-found-content">
        <h2 class="not-found-title">404</h2>
        <div class="not-found-image">
          <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" fill="#EBE8DB" stroke="#D76C82" stroke-width="4" />
            <circle cx="65" cy="80" r="10" fill="#3D0301" />
            <circle cx="135" cy="80" r="10" fill="#3D0301" />
            <path d="M65 130 Q100 100 135 130" stroke="#3D0301" stroke-width="6" fill="none" />
            <path d="M50 50 L70 70 M80 40 L60 60" stroke="#B03052" stroke-width="4" />
            <path d="M150 50 L130 70 M120 40 L140 60" stroke="#B03052" stroke-width="4" />
          </svg>
        </div>
        <h3 class="not-found-subtitle">Halaman Tidak Ditemukan</h3>
        <p class="not-found-message">Maaf, halaman yang Anda cari tidak dapat ditemukan atau tidak tersedia.</p>
        <div class="not-found-actions">
          <a href="#home" class="button primary">Kembali ke Beranda</a>
          <a href="#liked" class="button secondary">Cerita Disukai</a>
        </div>
      </div>
    </div>
  `;
} 