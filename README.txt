╭──────────────────────────────────────────────╮
│   KARTU MUSIK UNTUK PACAR — PANDUAN SINGKAT   │
╰──────────────────────────────────────────────╯

Halo! Ini adalah proyek web pemutar musik bergaya layar "Now Playing" ala
Spotify, yang bisa kamu kustomisasi dengan foto dan lagu kalian sendiri,
lalu kirim sebagai halaman web (bisa dibuka langsung dari HP Android
maupun laptop). Warna latar akan otomatis menyesuaikan dari foto sampul
yang kamu pasang, dan ada fitur "pesan" tersembunyi di bagian bawah
(ikon amplop) yang bisa kamu isi dengan pesan pribadi untuk dia.


1. ISI FOLDER
──────────────
  index.html          -> halaman utama, cukup dibuka di browser
  css/style.css        -> semua tampilan & animasi
  js/script.js          -> logika pemutar musik & daftar lagu
  assets/cover.jpg      -> foto contoh (placeholder), GANTI dengan foto kalian
  assets/song-cover.mp3 -> lagu contoh, GANTI dengan lagu asli


2. CARA MENGGANTI FOTO
────────────────────────
  - Siapkan foto kalian (disarankan rasio 1:1 / persegi, minimal 600x600px
    agar hasil crop di kotak sampul (kotak dengan sudut tumpul, seperti
    sampul album Spotify) terlihat rapi.
  - Beri nama file, misalnya: foto1.jpg
  - Taruh di dalam folder assets/
  - Buka js/script.js, cari bagian PLAYLIST di paling atas, lalu ganti
    nilai "cover" sesuai nama file foto kamu, contoh:

      cover: "assets/foto1.jpg",

  - Warna latar halaman akan otomatis mengikuti warna dominan dari foto
    ini (dibaca langsung di browser, bukan foto yang diunggah ke server
    mana pun) — jadi setiap foto beda akan menghasilkan nuansa warna
    yang berbeda juga.


3. CARA MENGGANTI LAGU
─────────────────────────
  - Siapkan file lagu format .mp3 (paling aman & ukurannya kecil).
  - Taruh di dalam folder assets/, misal: lagu1.mp3
  - Buka js/script.js, di bagian PLAYLIST, ganti nilai "src":

      src: "assets/lagu1.mp3",

  - Perhatikan hak cipta: lagu asli (yang dibeli/streaming resmi) tidak
    disertakan di project ini karena alasan hak cipta. Kamu bisa memakai
    lagu favorit kalian berdua yang sudah kamu miliki filenya sendiri,
    atau merekam cover/instrumen sendiri.


4. MENAMBAH / MENGURANGI JUMLAH LAGU
───────────────────────────────────────
  Array PLAYLIST di js/script.js bisa ditambah atau dikurangi bebas.
  Setiap lagu bisa diisi 5 informasi (yang terakhir opsional):

      {
        title:  "Judul Lagu",
        artist: "Nama Penyanyi / Nama Kamu",
        cover:  "assets/nama-foto.jpg",
        src:    "assets/nama-lagu.mp3",
        note:   "Pesan pribadi buat dia, muncul saat ikon amplop disentuh.",
      },

  Kalau hanya ada 1 lagu, titik indikator playlist di bawah tombol kontrol
  akan otomatis hilang (karena tidak dibutuhkan).


5. MENGGANTI JUDUL, NAMA & PESAN
────────────────────────────────────
  - Ubah "title" dan "artist" di setiap lagu pada PLAYLIST — bisa diisi
    kalimat apa pun yang berarti buat kalian berdua.
  - Ubah "note" di tiap lagu untuk pesan yang muncul saat ikon amplop
    (di deretan ikon paling bawah) disentuh. Kalau tidak diisi, teks di
    variabel DEFAULT_NOTE (dekat bagian atas file) yang dipakai.
  - Variabel SIGNATURE (juga dekat bagian atas file) adalah tanda tangan
    kecil di bawah pesan, contoh: "— dari Abang, untuk Ucii".


6. CARA MEMBUKA / MENGIRIM
──────────────────────────────
  - Cara paling simpel: klik dua kali file index.html, akan terbuka di
    browser (Chrome/Firefox/Safari) di laptop maupun HP.
  - Supaya foto & lagu ikut terbawa, JANGAN kirim file index.html saja —
    kirim seluruh folder (atau file .zip ini apa adanya), lalu suruh
    dia klik dua kali index.html setelah folder diekstrak.
  - Kalau ingin dia bisa buka lewat link (tanpa perlu download folder),
    kamu bisa unggah seluruh folder ini ke layanan hosting gratis seperti
    Netlify Drop, Vercel, atau GitHub Pages — tinggal seret folder,
    lalu dapat link untuk dibagikan.


7. FITUR-FITUR KECIL YANG BISA DICOBA
──────────────────────────────────────────
  - Panah bawah di kiri atas -> menciutkan layar jadi mini player di
    bagian bawah layar (seperti mini player Spotify). Sentuh mini
    player itu lagi untuk membesarkannya kembali.
  - Ikon amplop di deretan bawah -> membuka panel pesan pribadi (lihat
    poin 5 di atas untuk cara mengisinya). Ada titik hijau kecil di
    ikonnya sampai pesan pertama kali dibuka.
  - Ikon titik tiga (⋯) di kanan atas -> menampilkan pesan singkat kecil.
  - Tombol acak & ulangi di kiri-kanan tombol play berfungsi sungguhan
    kalau lagu di PLAYLIST lebih dari satu.
  - Ikon hati akan berubah hijau (gaya "Liked Songs" Spotify) saat
    disentuh, lengkap dengan notifikasi kecil di bawah layar.

8. CATATAN TEKNIS
──────────────────
  - Sudah responsif untuk layar HP Android (sudah dites di ukuran umum
    360px–412px lebar layar) maupun tablet/laptop.
  - Mendukung navigasi keyboard (tombol spasi untuk play/pause) dan
    pembaca layar dasar (aria-label).
  - Menghormati pengaturan "Reduce Motion" di HP/laptop bagi yang
    sensitif terhadap animasi.
  - Warna latar diambil dari foto sampul langsung di browser pengguna
    (bukan diproses di server). Kalau karena satu dan lain hal browser
    gagal membacanya, halaman otomatis memakai warna cadangan — tampilan
    tetap rapi, tidak ada yang rusak.
  - Tidak memerlukan koneksi internet untuk berjalan, KECUALI untuk
    memuat font (Google Fonts). Kalau tidak ada internet, huruf akan
    otomatis berpindah ke huruf cadangan bawaan sistem — tampilan tetap
    rapi.

Selamat mengerjakan, semoga pacar kamu suka! 🤍
