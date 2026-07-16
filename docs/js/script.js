/* ==========================================================================
   KONFIGURASI PLAYLIST
   ---------------------------------------------------------------------
   Ganti bagian ini dengan lagu & foto kalian sendiri.
   - title  : judul lagu (bebas, boleh diganti jadi kalimat manis)
   - artist : nama penyanyi asli, atau bisa diganti nama kamu/pasangan
   - cover  : path foto untuk lagu ini (taruh file foto di folder assets/)
   - src    : path file audio (mp3/wav) untuk lagu ini (taruh di assets/)
   - note   : pesan pribadi yang muncul saat ikon "pesan" di bagian bawah
              disentuh (pengganti tampilan lirik). Boleh dikosongkan —
              kalau kosong, DEFAULT_NOTE di bawah yang dipakai.

   Boleh menambah/mengurangi jumlah lagu di array ini bebas sesuai kebutuhan.
   ========================================================================== */
const PLAYLIST = [
  {
    title: "Untuk Kamu",
    artist: "Backstreet Boys - Shape of My Heart",
    cover: "assets/cover.jpg",
    src: "assets/song-cover.mp3",
    note: "apaaaa yakkk, kalo mo tau amayy enaknya ngobrol langsung aja ga sih, btw kayaknya ide bagus fahri bisa buat website lagu buat kamu agar bisa dengerin lagu secara gratis",
  },

];

/* Tanda tangan di bagian bawah panel pesan — ganti sesuai nama kamu */
const SIGNATURE = "— dari aku, untuk kamu";

/* Dipakai kalau sebuah lagu tidak punya `note` sendiri */
const DEFAULT_NOTE = "apaaaa yakkk, kalo mo tau amayy enaknya ngobrol langsung aja ga sih, btw kayaknya ide bagus fahri bisa buat website lagu buat kamu agar bisa dengerin lagu secara gratis";

/* Warna aksen cadangan, dipakai kalau warna dari foto gagal dibaca
   (misalnya browser tertentu memblokir pembacaan pixel foto lokal) */
const FALLBACK_ACCENT_RGB = [150, 82, 68];

/* ==========================================================================
   AMBIL ELEMEN
   ========================================================================== */
const audio          = document.getElementById("audio");
const artEl           = document.getElementById("art");
const albumPhoto      = document.getElementById("albumPhoto");
const trackTitle      = document.getElementById("trackTitle");
const trackArtist     = document.getElementById("trackArtist");

const playBtn         = document.getElementById("playBtn");
const playIcon        = document.getElementById("playIcon");
const pauseIcon       = document.getElementById("pauseIcon");
const prevBtn         = document.getElementById("prevBtn");
const nextBtn         = document.getElementById("nextBtn");
const shuffleBtn      = document.getElementById("shuffleBtn");
const repeatBtn       = document.getElementById("repeatBtn");

const progressRange   = document.getElementById("progressRange");
const currentTimeEl   = document.getElementById("currentTime");
const durationTimeEl  = document.getElementById("durationTime");

const volumeRange     = document.getElementById("volumeRange");
const muteBtn         = document.getElementById("muteBtn");
const volWave         = document.getElementById("volWave");

const likeBtn         = document.getElementById("likeBtn");
const dotsWrap         = document.getElementById("dots");

const collapseBtn     = document.getElementById("collapseBtn");
const menuBtn          = document.getElementById("menuBtn");
const menuPop          = document.getElementById("menuPop");

const noteBtn          = document.getElementById("noteBtn");
const noteDot           = document.getElementById("noteDot");
const notePanel         = document.getElementById("notePanel");
const noteCloseBtn      = document.getElementById("noteCloseBtn");
const noteText           = document.getElementById("noteText");
const noteSign            = document.getElementById("noteSign");

const shareBtn          = document.getElementById("shareBtn");
const toast              = document.getElementById("toast");

const miniPlayer        = document.getElementById("miniPlayer");
const miniPhoto          = document.getElementById("miniPhoto");
const miniTitle           = document.getElementById("miniTitle");
const miniArtist           = document.getElementById("miniArtist");
const miniPlayBtn           = document.getElementById("miniPlayBtn");
const miniPlayIcon            = document.getElementById("miniPlayIcon");
const miniPauseIcon            = document.getElementById("miniPauseIcon");
const miniProgress               = document.getElementById("miniProgress");

const colorCanvas       = document.getElementById("colorCanvas");

/* ==========================================================================
   STATE
   ========================================================================== */
let currentIndex = 0;
let isPlaying = false;
let isSeeking = false;
let lastVolume = 0.7;
let isShuffled = false;
let repeatMode = "off"; // "off" | "all" | "one"
let noteSeen = false;
let toastTimer = null;

/* ==========================================================================
   UTIL
   ========================================================================== */
function formatTime(seconds){
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

/* ==========================================================================
   WARNA AKSEN DARI FOTO
   ---------------------------------------------------------------------
   Membaca rata-rata warna yang cukup jenuh & tidak terlalu gelap/terang
   dari foto sampul yang sedang tampil, lalu memakainya untuk mewarnai
   latar ambient — supaya setiap foto punya nuansa warnanya sendiri,
   persis seperti layar "Now Playing" aslinya.
   ========================================================================== */
function readDominantColor(imgEl){
  return new Promise((resolve) => {
    try {
      const ctx = colorCanvas.getContext("2d", { willReadFrequently: true });
      const w = colorCanvas.width, h = colorCanvas.height;

      const draw = () => {
        try {
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(imgEl, 0, 0, w, h);
          const { data } = ctx.getImageData(0, 0, w, h);

          let r = 0, g = 0, b = 0, weightSum = 0;
          for (let i = 0; i < data.length; i += 4){
            const alpha = data[i + 3];
            if (alpha < 200) continue;

            const rr = data[i], gg = data[i + 1], bb = data[i + 2];
            const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
            const sat = max === 0 ? 0 : (max - min) / max;
            const lum = (rr * 0.299 + gg * 0.587 + bb * 0.114) / 255;

            if (lum < 0.05 || lum > 0.94) continue; // buang hitam/putih ekstrem

            const weight = 0.3 + sat * 1.5;
            r += rr * weight; g += gg * weight; b += bb * weight;
            weightSum += weight;
          }

          if (weightSum === 0){ resolve(null); return; }
          resolve([Math.round(r / weightSum), Math.round(g / weightSum), Math.round(b / weightSum)]);
        } catch (err){
          resolve(null); // kemungkinan canvas ter-"taint" — pakai warna cadangan
        }
      };

      if (imgEl.complete && imgEl.naturalWidth){
        draw();
      } else {
        imgEl.addEventListener("load", draw, { once: true });
      }
    } catch (err){
      resolve(null);
    }
  });
}

async function applyAccentFromPhoto(imgEl){
  const rgb = await readDominantColor(imgEl);
  const [r, g, b] = rgb || FALLBACK_ACCENT_RGB;
  document.documentElement.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
}

/* ==========================================================================
   RENDER TITIK PLAYLIST
   ========================================================================== */
function renderDots(){
  dotsWrap.innerHTML = "";
  if (PLAYLIST.length <= 1) return; // tidak perlu titik kalau cuma 1 lagu

  PLAYLIST.forEach((track, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Putar ${track.title}`);
    dot.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
    if (i === currentIndex) dot.classList.add("is-active");
    dot.addEventListener("click", () => loadTrack(i, true));
    dotsWrap.appendChild(dot);
  });
}

function updateDots(){
  [...dotsWrap.children].forEach((dot, i) => {
    dot.classList.toggle("is-active", i === currentIndex);
    dot.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
  });
}

/* ==========================================================================
   MUAT LAGU
   ========================================================================== */
function loadTrack(index, autoplay){
  currentIndex = (index + PLAYLIST.length) % PLAYLIST.length;
  const track = PLAYLIST[currentIndex];

  // transisi foto dengan fade halus
  albumPhoto.classList.add("is-fading");
  setTimeout(() => {
    albumPhoto.src = track.cover;
    albumPhoto.alt = `Foto sampul untuk lagu ${track.title}`;
    albumPhoto.classList.remove("is-fading");
    applyAccentFromPhoto(albumPhoto);
  }, 160);

  miniPhoto.src = track.cover;
  miniPhoto.alt = "";

  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  miniTitle.textContent = track.title;
  miniArtist.textContent = track.artist;

  audio.src = track.src;
  progressRange.value = 0;
  progressRange.style.setProperty("--progress", "0%");
  miniProgress.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationTimeEl.textContent = "0:00";

  updateDots();

  if (autoplay){
    play();
  } else {
    updatePlayState(false);
  }
}

/* ==========================================================================
   PLAY / PAUSE
   ========================================================================== */
function play(){
  audio.play().then(() => {
    updatePlayState(true);
  }).catch(() => {
    // browser memblokir autoplay tanpa interaksi — abaikan dengan tenang
    updatePlayState(false);
  });
}

function pause(){
  audio.pause();
  updatePlayState(false);
}

function togglePlay(){
  if (isPlaying) pause(); else play();
}

function updatePlayState(playing){
  isPlaying = playing;

  playIcon.style.display = playing ? "none" : "block";
  pauseIcon.style.display = playing ? "block" : "none";
  miniPlayIcon.style.display = playing ? "none" : "block";
  miniPauseIcon.style.display = playing ? "block" : "none";

  playBtn.setAttribute("aria-label", playing ? "Jeda" : "Putar");
  playBtn.classList.toggle("is-playing", playing);

  document.body.classList.toggle("is-playing", playing);
}

/* ==========================================================================
   NAVIGASI LAGU
   ========================================================================== */
function playNext(){
  if (PLAYLIST.length <= 1){
    audio.currentTime = 0;
    play();
    return;
  }
  let next;
  if (isShuffled){
    do { next = Math.floor(Math.random() * PLAYLIST.length); }
    while (next === currentIndex && PLAYLIST.length > 1);
  } else {
    next = currentIndex + 1;
  }
  loadTrack(next, true);
}

function playPrev(){
  // kalau sudah lewat 3 detik, ulang lagu ini dulu (perilaku umum pemutar musik)
  if (audio.currentTime > 3){
    audio.currentTime = 0;
    return;
  }
  loadTrack(currentIndex - 1, true);
}

/* ==========================================================================
   PROGRESS BAR
   ========================================================================== */
audio.addEventListener("loadedmetadata", () => {
  durationTimeEl.textContent = formatTime(audio.duration);
  progressRange.max = audio.duration || 0;
});

audio.addEventListener("timeupdate", () => {
  if (isSeeking) return;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressRange.value = audio.currentTime;
  progressRange.style.setProperty("--progress", `${pct}%`);
  miniProgress.style.width = `${pct}%`;
});

audio.addEventListener("ended", () => {
  if (repeatMode === "one"){
    audio.currentTime = 0;
    play();
    return;
  }
  const isLastTrack = !isShuffled && currentIndex === PLAYLIST.length - 1;
  if (isLastTrack && repeatMode === "off"){
    audio.currentTime = 0;
    updatePlayState(false);
    return;
  }
  playNext();
});

progressRange.addEventListener("input", () => {
  isSeeking = true;
  const pct = audio.duration ? (progressRange.value / audio.duration) * 100 : 0;
  progressRange.style.setProperty("--progress", `${pct}%`);
  miniProgress.style.width = `${pct}%`;
  currentTimeEl.textContent = formatTime(progressRange.value);
});

progressRange.addEventListener("change", () => {
  audio.currentTime = progressRange.value;
  isSeeking = false;
});

/* ==========================================================================
   VOLUME
   ========================================================================== */
function updateVolumeIcon(vol){
  volWave.style.display = vol === 0 ? "none" : "block";
  muteBtn.setAttribute("aria-label", vol === 0 ? "Suarakan" : "Bisukan");
}

volumeRange.addEventListener("input", () => {
  const vol = Number(volumeRange.value) / 100;
  audio.volume = vol;
  volumeRange.style.setProperty("--vol", `${volumeRange.value}%`);
  updateVolumeIcon(vol);
  if (vol > 0) lastVolume = vol;
});

muteBtn.addEventListener("click", () => {
  if (audio.volume > 0){
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeRange.value = 0;
  } else {
    audio.volume = lastVolume || 0.7;
    volumeRange.value = Math.round(audio.volume * 100);
  }
  volumeRange.style.setProperty("--vol", `${volumeRange.value}%`);
  updateVolumeIcon(audio.volume);
});

/* ==========================================================================
   TOMBOL SUKA
   ========================================================================== */
likeBtn.addEventListener("click", () => {
  const liked = likeBtn.classList.toggle("is-liked");
  likeBtn.setAttribute("aria-pressed", liked ? "true" : "false");
  showToast(liked ? "Ditambahkan ke Disukai" : "Dihapus dari Disukai");
});

/* ==========================================================================
   ACAK & ULANGI
   ========================================================================== */
shuffleBtn.addEventListener("click", () => {
  isShuffled = !isShuffled;
  shuffleBtn.classList.toggle("is-active", isShuffled);
  shuffleBtn.setAttribute("aria-pressed", String(isShuffled));
});

repeatBtn.addEventListener("click", () => {
  repeatMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
  repeatBtn.classList.toggle("is-active", repeatMode !== "off");
  repeatBtn.classList.toggle("is-one", repeatMode === "one");
  repeatBtn.setAttribute("aria-pressed", String(repeatMode !== "off"));
});

/* ==========================================================================
   CIUTKAN / PERBESAR (MINI PLAYER)
   ========================================================================== */
function setCollapsed(collapsed){
  document.body.classList.toggle("is-collapsed", collapsed);
  collapseBtn.setAttribute("aria-expanded", String(!collapsed));
}
collapseBtn.addEventListener("click", () => setCollapsed(true));
miniPlayer.addEventListener("click", () => setCollapsed(false));
miniPlayer.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " "){
    e.preventDefault();
    setCollapsed(false);
  }
});
miniPlayBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePlay();
});

/* ==========================================================================
   MENU "..."
   ========================================================================== */
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = menuPop.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (e) => {
  if (!menuPop.contains(e.target) && e.target !== menuBtn){
    menuPop.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

/* ==========================================================================
   PANEL PESAN (pengganti tampilan lirik)
   ========================================================================== */
function openNote(){
  const track = PLAYLIST[currentIndex];
  noteText.textContent = track.note || DEFAULT_NOTE;
  noteSign.textContent = SIGNATURE;

  notePanel.hidden = false;
  requestAnimationFrame(() => notePanel.classList.add("is-open"));
  noteBtn.setAttribute("aria-expanded", "true");

  if (!noteSeen){
    noteSeen = true;
    noteBtn.classList.add("is-seen");
  }
}
function closeNote(){
  notePanel.classList.remove("is-open");
  noteBtn.setAttribute("aria-expanded", "false");
  setTimeout(() => { notePanel.hidden = true; }, 360);
}
noteBtn.addEventListener("click", openNote);
noteCloseBtn.addEventListener("click", closeNote);
notePanel.addEventListener("click", (e) => {
  if (e.target === notePanel) closeNote();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && notePanel.classList.contains("is-open")) closeNote();
});

/* ==========================================================================
   BAGIKAN
   ========================================================================== */
shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: `${trackTitle.textContent} — untuk kamu`,
    url: window.location.href,
  };
  try {
    if (navigator.share){
      await navigator.share(shareData);
    } else if (navigator.clipboard){
      await navigator.clipboard.writeText(window.location.href);
      showToast("Tautan disalin");
    }
  } catch (err){
    // dibatalkan oleh pengguna — tidak perlu ditangani
  }
});

/* ==========================================================================
   EVENT TOMBOL UTAMA
   ========================================================================== */
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

/* Dukungan tombol spasi untuk play/pause, kecuali sedang fokus di slider
   atau tombol lain (biar tombol itu tetap bisa diaktifkan pakai spasi) */
document.addEventListener("keydown", (e) => {
  const focusedTag = document.activeElement.tagName;
  const isOnControl = focusedTag === "INPUT" || focusedTag === "BUTTON" || focusedTag === "A";
  if (e.code === "Space" && !isOnControl){
    e.preventDefault();
    togglePlay();
  }
});

/* ==========================================================================
   INISIALISASI
   ========================================================================== */
audio.volume = Number(volumeRange.value) / 100;
volumeRange.style.setProperty("--vol", `${volumeRange.value}%`);
renderDots();
loadTrack(0, false);
