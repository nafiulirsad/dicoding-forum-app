# Aplikasi Forum Diskusi

Aplikasi forum diskusi berbasis **React + Redux** yang memanfaatkan
[Dicoding Forum API](https://forum-api.dicoding.dev/v1/). Pengguna dapat mendaftar,
masuk, membaca daftar diskusi, membuka detail diskusi beserta komentarnya, membuat
diskusi dan komentar baru, memberi vote, memfilter diskusi berdasarkan kategori,
serta melihat klasemen (leaderboard) pengguna paling aktif.

---

## ✨ Fitur

### Kriteria utama

| Fitur | Keterangan |
|---|---|
| Registrasi akun | Halaman `/register`, langsung otomatis masuk setelah berhasil mendaftar |
| Login akun | Halaman `/login`, sesi disimpan pada `localStorage` dan dipulihkan saat aplikasi dibuka kembali |
| Daftar thread | Halaman `/`, menampilkan judul, cuplikan body, waktu, jumlah komentar, nama + avatar pembuat |
| Detail thread | Halaman `/threads/:id`, menampilkan judul, body, waktu, pembuat, dan seluruh komentar |
| Buat thread | Halaman `/threads/new` (khusus pengguna terotentikasi) |
| Buat komentar | Formulir komentar pada halaman detail thread |
| Loading indicator | Progress bar global di bagian atas halaman + spinner pada saat pemuatan awal setiap halaman |

### Fitur tambahan (saran submission)

| Saran | Implementasi |
|---|---|
| **Votes pada thread & komentar** | Tombol up-vote / down-vote pada daftar thread, detail thread, dan setiap komentar. Tombol aktif berubah warna (hijau untuk suka, merah untuk tidak suka), jumlah vote ditampilkan, menekan tombol yang sama akan membatalkan vote. Perubahan diterapkan secara **optimistic** dan otomatis di-*rollback* bila request gagal. |
| **Leaderboard** | Halaman `/leaderboards` menampilkan peringkat, nama, avatar, dan skor pengguna. Baris milik pengguna yang sedang masuk diberi penanda khusus. |
| **Filter kategori** | Chip kategori pada halaman beranda. Kategori dikumpulkan dari data thread dan filter dijalankan murni di sisi front-end melalui Redux Store. |

Tambahan lain: mode gelap otomatis (`prefers-color-scheme`), desain responsif,
notifikasi *toast* untuk keberhasilan/kegagalan aksi, halaman 404, dukungan
`prefers-reduced-motion`, serta atribut aksesibilitas (`aria-*`, label form, fokus terlihat).

---

## 🧰 Tech Stack

| Kategori | Teknologi |
|---|---|
| UI Library | React 19 (`react-dom`) |
| State Management | Redux Toolkit + React Redux |
| Routing | React Router DOM v7 |
| Build Tool | Vite |
| Linter | ESLint 9 (flat config) + `eslint-config-dicodingacademy` |
| Validasi Props | `prop-types` |
| Styling | CSS murni (custom properties, BEM-like naming) |

> Tidak menggunakan UI library / framework apa pun selain React.

---

## 🗂️ Struktur Proyek

```
.
├── eslint.config.js          # Konfigurasi ESLint (Dicoding Academy Style Guide)
├── index.html
├── vite.config.js
├── .env.example              # Contoh variabel lingkungan
└── src
    ├── index.jsx             # Entry point: StrictMode + Provider + BrowserRouter
    ├── App.jsx               # Layout utama & definisi route
    │
    ├── components/           # ── UI: komponen presentasional yang reusable
    │   ├── Avatar.jsx
    │   ├── CategoryFilter.jsx
    │   ├── CommentInput.jsx
    │   ├── CommentItem.jsx
    │   ├── CommentsList.jsx
    │   ├── EmptyState.jsx
    │   ├── LeaderboardItem.jsx
    │   ├── LeaderboardList.jsx
    │   ├── LoadingBar.jsx
    │   ├── LoginInput.jsx
    │   ├── Navigation.jsx
    │   ├── RegisterInput.jsx
    │   ├── RequireAuth.jsx
    │   ├── Spinner.jsx
    │   ├── ThreadDetailCard.jsx
    │   ├── ThreadInput.jsx
    │   ├── ThreadItem.jsx
    │   ├── ThreadsList.jsx
    │   ├── Toast.jsx
    │   └── VoteButtons.jsx
    │
    ├── pages/                # ── UI: satu berkas untuk satu halaman
    │   ├── AddThreadPage.jsx
    │   ├── DetailPage.jsx
    │   ├── HomePage.jsx
    │   ├── LeaderboardsPage.jsx
    │   ├── LoginPage.jsx
    │   ├── NotFoundPage.jsx
    │   └── RegisterPage.jsx
    │
    ├── states/               # ── STATE: seluruh action, reducer, dan store
    │   ├── index.js          # configureStore
    │   ├── selectors.js      # selector & derived state (reselect)
    │   ├── authUser/         # action.js + reducer.js
    │   ├── isPreload/
    │   ├── leaderboards/
    │   ├── shared/           # action lintas-slice (users + threads sekaligus)
    │   ├── threadDetail/
    │   ├── threads/
    │   ├── ui/               # loading indicator & pesan notifikasi
    │   ├── users/
    │   └── votes/            # action vote + helper optimistic update
    │
    ├── hooks/
    │   └── useInput.js       # custom hook untuk controlled component
    │
    ├── utils/
    │   ├── api.js            # SATU-SATUNYA tempat pemanggilan REST API
    │   ├── index.js          # helper murni (format waktu, truncate, vote, dll.)
    │   └── propTypes.js      # definisi shape props yang dipakai bersama
    │
    └── styles/
        └── style.css
```

**Pemisahan UI dan State** dilakukan pada level folder: seluruh logika state berada di
`src/states`, sedangkan `src/components` dan `src/pages` hanya menangani tampilan.
Komponen tidak pernah memanggil REST API secara langsung — komponen hanya
men-*dispatch* action, dan pemanggilan API sepenuhnya terjadi di dalam
*thunk* pada `src/states/**/action.js` yang memakai lapisan `src/utils/api.js`.

---

## 🧠 Desain State

```
store
├── authUser        : object | null   → profil pengguna yang sedang masuk
├── isPreload       : boolean         → status pemulihan sesi saat aplikasi dibuka
├── users           : array           → daftar pengguna (untuk memetakan ownerId thread)
├── threads
│   ├── items       : array           → daftar thread dari API
│   └── category    : string          → kategori yang sedang difilter
├── threadDetail    : object | null   → detail thread + komentarnya
├── leaderboards    : array           → klasemen pengguna
└── ui
    ├── loadingCount: number          → jumlah request yang sedang berjalan
    └── message     : object | null   → notifikasi toast (success / error / info)
```

Action asinkron yang tersedia:

| Action | Kegunaan |
|---|---|
| `asyncPreloadProcess` | Memulihkan sesi dari token yang tersimpan |
| `asyncRegisterUser`, `asyncLoginUser`, `asyncLogoutUser` | Otentikasi |
| `asyncPopulateUsersAndThreads` | Mengambil daftar pengguna dan thread sekaligus |
| `asyncReceiveThreads`, `asyncCreateThread` | Daftar & pembuatan thread |
| `asyncReceiveThreadDetail`, `asyncCreateComment` | Detail thread & komentar |
| `asyncReceiveLeaderboards` | Klasemen pengguna |
| `asyncToggleVoteThread`, `asyncToggleVoteComment` | Vote dengan optimistic update |

Indikator loading dikelola otomatis: satu *matcher* pada slice `ui` menaikkan
`loadingCount` pada setiap action `*/pending` dan menurunkannya pada
`*/fulfilled` maupun `*/rejected`. Action vote dikecualikan karena sudah memakai
optimistic update sehingga tidak perlu memblokir tampilan.

---

## 🚀 Menjalankan Proyek

### Prasyarat
- Node.js 18 atau lebih baru
- npm 9 atau lebih baru

### Langkah

```bash
# 1. Pasang dependencies
npm install

# 2. Siapkan variabel lingkungan
cp .env.example .env

# 3. Jalankan mode pengembangan (http://localhost:5173)
npm run dev
```

### Perintah lain

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat build produksi ke folder `dist/` |
| `npm run serve` | Melihat pratinjau hasil build produksi |
| `npm run lint` | Menjalankan ESLint pada seluruh source code |
| `npm run lint:fix` | Menjalankan ESLint sekaligus memperbaiki yang bisa diperbaiki |

### Variabel lingkungan

| Nama | Wajib | Nilai bawaan | Keterangan |
|---|---|---|---|
| `VITE_API_BASE_URL` | tidak | `https://forum-api.dicoding.dev/v1` | Base URL Dicoding Forum API |

Tidak ada kredensial rahasia yang disimpan di dalam kode. Access token hasil login
hanya disimpan pada `localStorage` peramban pengguna.

---

## ✅ Pemenuhan Kriteria Submission

### Kriteria 1 — Fungsionalitas Aplikasi
- [x] Cara mendaftar akun (`/register`)
- [x] Cara login akun (`/login`)
- [x] Menampilkan daftar thread (`/`) beserta judul, cuplikan body, waktu, jumlah komentar, nama & avatar pembuat
- [x] Detail thread beserta komentarnya (`/threads/:id`), lengkap dengan avatar pembuat thread dan komentar
- [x] Pengguna dapat membuat thread (`/threads/new`, wajib login)
- [x] Pengguna dapat membuat komentar (wajib login)
- [x] Loading indicator saat memuat data dari API

### Kriteria 2 — Bugs Highlighting
- [x] Menggunakan ESLint (`eslint.config.js`)
- [x] Menerapkan **Dicoding Academy JavaScript Style Guide** melalui `eslint-config-dicodingacademy`
- [x] `npm run lint` bersih tanpa error maupun warning
- [x] Menggunakan `React.StrictMode` (lihat `src/index.jsx`)

### Kriteria 3 — Arsitektur Aplikasi
- [x] Seluruh state yang bersumber dari API disimpan pada Redux Store; hanya state form (controlled component) yang dikelola lokal melalui `useInput`
- [x] Tidak ada pemanggilan REST API di dalam lifecycle/efek komponen — komponen hanya men-*dispatch* action, seluruh `fetch` berada di `src/utils/api.js` yang dipanggil dari thunk
- [x] Kode UI (`components/`, `pages/`) terpisah dari kode state (`states/`)
- [x] Komponen bersifat modular dan reusable (misalnya `VoteButtons` dipakai ulang untuk thread dan komentar, `Avatar` dipakai di seluruh halaman)

### Saran tambahan
- [x] Saran 1: Fitur votes pada thread dan komentar (dengan optimistic update)
- [x] Saran 2: Halaman leaderboard
- [x] Saran 3: Filter daftar thread berdasarkan kategori

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan submission kelas Dicoding.
