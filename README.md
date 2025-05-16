# Dicoding Story - Progressive Web App

Aplikasi Progressive Web App (PWA) untuk berbagi cerita dengan gambar dan lokasi.

## Fitur IndexedDB

Aplikasi ini menggunakan IndexedDB untuk menyimpan data cerita yang disukai secara lokal, sehingga pengguna dapat:

1. **Menyimpan Cerita yang Disukai**

   - Klik tombol like (ikon hati) di setiap cerita untuk menyukai cerita tersebut
   - Data cerita akan disimpan dalam IndexedDB browser

2. **Menampilkan Cerita yang Disukai**

   - Klik menu "Cerita Disukai" di navigasi untuk melihat semua cerita yang telah disukai
   - Cerita akan diurutkan berdasarkan waktu terakhir disukai

3. **Menghapus Cerita yang Disukai**
   - Klik tombol "Hapus Semua" di halaman Cerita Disukai untuk menghapus semua cerita yang disukai
   - Klik tombol like pada cerita yang telah disukai untuk membatalkan like (menghapus cerita dari daftar yang disukai)

## Manfaat Penggunaan IndexedDB

1. **Pengalaman Offline yang Lebih Baik**

   - Cerita yang disukai dapat diakses bahkan saat pengguna sedang offline
   - Data tetap tersimpan antar sesi, sehingga tidak hilang saat browser ditutup

2. **Performa dan Responsivitas**

   - Penyimpanan lokal lebih cepat dibandingkan dengan mengambil data dari server
   - Mengurangi beban server dengan menyimpan preferensi pengguna di sisi klien

3. **Privasi Pengguna**
   - Data tersimpan secara lokal di perangkat pengguna, tidak dikirim ke server
   - Preferensi pengguna tetap tersimpan tanpa perlu membuat profil di server

## Cara Penggunaan

1. **Menyukai Cerita:**

   - Masuk ke halaman utama atau halaman detail cerita
   - Klik ikon hati di cerita yang ingin disukai
   - Ikon akan berubah warna menjadi merah menandakan cerita telah disukai

2. **Melihat Cerita yang Disukai:**

   - Klik menu "Cerita Disukai" di navigasi
   - Semua cerita yang telah disukai akan ditampilkan
   - Jika tidak ada cerita yang disukai, akan muncul pesan "Anda belum menyukai cerita apapun"

3. **Menghapus Cerita dari Daftar Disukai:**
   - Klik ikon hati yang sudah berwarna merah untuk membatalkan like
   - Atau klik tombol "Hapus Semua" di halaman Cerita Disukai untuk menghapus semua cerita yang disukai sekaligus
