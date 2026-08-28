# Aplikasi Forum Diskusi — Automation Testing & CI/CD

Aplikasi forum diskusi berbasis **React + Redux Toolkit** yang memanfaatkan
[Dicoding Forum API](https://forum-api.dicoding.dev/v1/). Submission ini melanjutkan
aplikasi dari kelas sebelumnya dengan menambahkan **automation testing** (unit,
integration/component, dan end-to-end), **CI/CD** (GitHub Actions + Vercel), serta
pemanfaatan **React Ecosystem** (Storybook dan React Hook Form).

| | |
|---|---|
| 🌐 **Aplikasi (Vercel)** | <https://dicoding-forum-app-kappa.vercel.app> |
| 📦 **Repository** | <https://github.com/nafiulirsad/dicoding-forum-app> |
| ⚙️ **CI/CD** | GitHub Actions (`.github/workflows/ci.yml` & `cd.yml`) |

---

## ✨ Fitur Aplikasi

### Kriteria utama (dipertahankan dari submission sebelumnya)

| Fitur | Keterangan |
|---|---|
| Registrasi akun | Halaman `/register`, otomatis masuk setelah berhasil mendaftar |
| Login akun | Halaman `/login`, sesi disimpan pada `localStorage` dan dipulihkan saat aplikasi dibuka kembali |
| Daftar thread | Halaman `/`, menampilkan judul, cuplikan body, waktu, jumlah komentar, nama + avatar pembuat |
| Detail thread | Halaman `/threads/:id`, menampilkan judul, body, waktu, pembuat, dan seluruh komentar |
| Buat thread | Halaman `/threads/new` (khusus pengguna terotentikasi) |
| Buat komentar | Formulir komentar pada halaman detail thread |
| Loading indicator | Progress bar global di bagian atas halaman + spinner saat pemuatan awal |

### Fitur tambahan (saran submission)

| Saran | Implementasi |
|---|---|
| **Votes pada thread & komentar** | Tombol up-vote / down-vote pada daftar thread, detail thread, dan setiap komentar. Menekan tombol yang sama membatalkan vote. Perubahan diterapkan secara **optimistic** dan otomatis di-*rollback* bila request gagal. |
| **Leaderboard** | Halaman `/leaderboards` menampilkan peringkat, nama, avatar, dan skor pengguna. Baris pengguna yang sedang masuk diberi penanda "Anda". |
| **Filter kategori** | Chip kategori pada halaman beranda. Kategori dikumpulkan dari data thread dan filter dijalankan di sisi front-end melalui Redux Store. |
| **Stories komponen** | 6 berkas story Storybook (Avatar, VoteButtons, ThreadItem, CategoryFilter, LoginInput, LeaderboardList). |

Tambahan lain: mode gelap otomatis (`prefers-color-scheme`), desain responsif,
notifikasi *toast*, halaman 404, dukungan `prefers-reduced-motion`, serta atribut
aksesibilitas (`aria-*`, label form, fokus terlihat).

---

## 🧰 Tech Stack

| Kategori | Teknologi |
|---|---|
| UI Library | React 19 (`react-dom`) |
| State Management | Redux Toolkit + React Redux |
| Routing | React Router DOM v7 |
| **Form & Validasi** | **React Hook Form** *(React Ecosystem)* |
| **Dokumentasi Komponen** | **Storybook 10** + addon `docs` & `a11y` *(React Ecosystem)* |
| Unit / Component / Integration Test | Vitest + React Testing Library + jsdom |
| End-to-End Test | Cypress 15 |
| Build Tool | Vite 7 |
| Linter | ESLint 9 (flat config) + `eslint-config-dicodingacademy` |
| CI / CD | GitHub Actions + Vercel |

> Tidak menggunakan UI library / framework apa pun selain React.

---

## 🚀 Menjalankan Proyek

### Prasyarat
- Node.js 20.19+ / 22+
- npm 10 atau lebih baru

### Langkah

```bash
# 1. Pasang dependencies
npm install

# 2. Siapkan variabel lingkungan
cp .env.example .env

# 3. Jalankan mode pengembangan (http://localhost:5173)
npm run dev
```

### Daftar perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan development server pada port 5173 |
| `npm run build` | Membuat build produksi ke folder `dist/` |
| `npm run serve` | Pratinjau hasil build produksi |
| `npm run lint` | Menjalankan ESLint pada seluruh source code |
| `npm run lint:fix` | ESLint sekaligus memperbaiki yang bisa diperbaiki |
| **`npm test`** | **Menjalankan seluruh pengujian Vitest (reducer, thunk, komponen, integrasi)** |
| `npm run test:watch` | Menjalankan Vitest dalam mode watch |
| `npm run test:coverage` | Menjalankan Vitest beserta laporan coverage |
| **`npm run e2e`** | **Menjalankan development server lalu seluruh pengujian Cypress (headless)** |
| `npm run e2e:open` | Menjalankan development server lalu membuka Cypress Test Runner |
| `npm run storybook` | Menjalankan Storybook pada port 6006 |
| `npm run build-storybook` | Membuat build statis Storybook |

### Variabel lingkungan

| Nama | Wajib | Nilai bawaan | Keterangan |
|---|---|---|---|
| `VITE_API_BASE_URL` | tidak | `https://forum-api.dicoding.dev/v1` | Base URL Dicoding Forum API |

Tidak ada kredensial rahasia di dalam kode. Access token hasil login hanya disimpan
pada `localStorage` peramban pengguna. Kredensial deployment (`VERCEL_TOKEN`,
`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) disimpan sebagai **GitHub Actions Secrets**.

---

## 🧪 Automation Testing

Seluruh berkas pengujian diawali komentar **skenario pengujian** dan mengikuti pola
*arrange → action → assert*.

### Ringkasan

| Jenis | Jumlah berkas | Lokasi |
|---|---|---|
| Pengujian fungsi **reducer** | 7 | `src/states/*/reducer.test.js` |
| Pengujian fungsi **thunk** | 5 | `src/states/*/action.test.js` |
| Pengujian **React component** | 7 | `src/components/*.test.jsx` |
| Pengujian **integrasi** | 1 | `src/pages/HomePage.test.jsx` |
| Pengujian **helper murni** | 1 | `src/utils/index.test.js` |
| Pengujian **end-to-end** | 2 | `cypress/e2e/*.cy.js` |

Total: **140 test case** Vitest + **14 test case** Cypress.

### Unit test — reducer

| Berkas | Cakupan |
|---|---|
| `src/states/threads/reducer.test.js` | state awal, `asyncReceiveThreads`, `asyncPopulateUsersAndThreads`, `asyncCreateThread`, filter kategori, optimistic vote & rollback |
| `src/states/threadDetail/reducer.test.js` | pending/fulfilled/rejected detail thread, penambahan komentar, vote thread & komentar beserta rollback |
| `src/states/authUser/reducer.test.js` | `setAuthUser`, `unsetAuthUser`, login, logout, preload |
| `src/states/ui/reducer.test.js` | pesan notifikasi, penghitung loading, pengecualian action `votes/` dan `authUser/preload` |
| `src/states/users/reducer.test.js` | daftar pengguna & penambahan pengguna baru saat registrasi |
| `src/states/leaderboards/reducer.test.js` | pemuatan & pembaruan klasemen |
| `src/states/isPreload/reducer.test.js` | status pemulihan sesi |

### Unit test — thunk

| Berkas | Cakupan |
|---|---|
| `src/states/authUser/action.test.js` | `asyncLoginUser`, `asyncRegisterUser`, `asyncLogoutUser`, `asyncPreloadProcess` (berhasil & gagal) |
| `src/states/shared/action.test.js` | `asyncPopulateUsersAndThreads` (dua permintaan paralel, dua skenario gagal) |
| `src/states/threads/action.test.js` | `asyncReceiveThreads`, `asyncCreateThread` |
| `src/states/votes/action.test.js` | `asyncToggleVoteThread`, `asyncToggleVoteComment` beserta data rollback pada `meta.arg` |
| `src/states/threadDetail/action.test.js` | `asyncReceiveThreadDetail`, `asyncCreateComment` |

Lapisan jaringan (`src/utils/api.js`) di-*mock* memakai `vi.mock`, sehingga pengujian
thunk tidak pernah menyentuh jaringan sungguhan.

### Component & integration test

| Berkas | Cakupan |
|---|---|
| `src/components/LoginInput.test.jsx` | render, perubahan input, validasi wajib isi/format email/panjang kata sandi, pemanggilan `onLogin` |
| `src/components/RegisterInput.test.jsx` | render, perubahan input, validasi, pemangkasan spasi |
| `src/components/VoteButtons.test.jsx` | jumlah vote, penanda vote aktif, transisi up → netral → down |
| `src/components/CategoryFilter.test.jsx` | render chip, penanda kategori terpilih, callback pemilihan |
| `src/components/ThreadItem.test.jsx` | judul/pemilik/kategori, tautan detail, jumlah komentar, propagasi vote |
| `src/components/CommentInput.test.jsx` | keadaan terkunci, tombol nonaktif, pengiriman & reset form |
| `src/components/LeaderboardList.test.jsx` | daftar skor, peringkat, penanda "Anda" |
| `src/pages/HomePage.test.jsx` | **integrasi**: thunk → reducer → selector → komponen memakai Redux store sungguhan |

### End-to-end test (Cypress)

| Berkas | Skenario |
|---|---|
| `cypress/e2e/login.cy.js` | **alur login**: tampilan halaman, validasi form kosong/format email/panjang kata sandi, notifikasi galat saat kredensial salah, login berhasil → beranda + nama pengguna, tombol setelah masuk, logout, redirect halaman terproteksi |
| `cypress/e2e/home.cy.js` | beranda, filter kategori, navigasi ke detail thread & leaderboard, redirect vote saat belum masuk |

Permintaan ke Dicoding Forum API di-*stub* melalui `cy.intercept` (lihat
`cypress/support/commands.js`) agar pengujian bersifat deterministik, tidak
bergantung pada jaringan, dan aman dijalankan berulang kali di CI.

---

## 📚 React Ecosystem yang Dimanfaatkan

### 1. Storybook

Storybook dipakai untuk mengembangkan dan mendokumentasikan komponen secara terisolasi.

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # build statis ke storybook-static/
```

Terdapat **6 berkas story**: `Avatar`, `VoteButtons`, `ThreadItem`, `CategoryFilter`,
`LoginInput`, dan `LeaderboardList`. Story `LoginInput` bahkan memakai fungsi `play`
untuk menjalankan interaksi otomatis (mengisi form dan memicu pesan validasi).
Seluruh story dibungkus `MemoryRouter` melalui decorator global di `.storybook/preview.jsx`.

### 2. React Hook Form

Seluruh form aplikasi (`LoginInput`, `RegisterInput`, `ThreadInput`, `CommentInput`)
dikelola React Hook Form. Manfaatnya: validasi deklaratif (wajib isi, pola email,
panjang minimal), pesan galat yang terhubung ke input lewat `aria-invalid` dan
`role="alert"`, status `isValid`/`isSubmitting` untuk menonaktifkan tombol kirim,
serta render ulang yang lebih sedikit dibanding controlled component manual.

---

## ⚙️ CI/CD

### Continuous Integration — GitHub Actions

Berkas: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
Pemicu: setiap `push` ke `master` dan setiap `pull_request` yang menargetkan `master`.

Tahapan job **Lint, Unit & E2E Test, Build**:

1. `npm ci` — memasang dependencies
2. `npm run lint` — ESLint (Dicoding Academy Style Guide)
3. `npm test` — Vitest (reducer, thunk, komponen, integrasi)
4. `npm run build` — build produksi
5. `cypress-io/github-action` — menjalankan development server lalu pengujian end-to-end

### Continuous Deployment — Vercel

Berkas: [`.github/workflows/cd.yml`](.github/workflows/cd.yml)
Pemicu: `workflow_run` — dijalankan **hanya jika workflow CI pada branch `master`
selesai dengan status sukses**, sehingga kode yang gagal diuji tidak pernah
sampai ke production.

Deployment dilakukan memakai Vercel CLI (`vercel pull` → `vercel build --prod` →
`vercel deploy --prebuilt --prod`) dengan kredensial dari GitHub Actions Secrets.

### Branch Protection

Branch `master` diproteksi dengan aturan berikut:

- ✅ Wajib melalui pull request (push langsung ditolak)
- ✅ Status check **"Lint, Unit & E2E Test, Build"** wajib lolos sebelum merge
- ✅ Branch wajib *up to date* dengan `master` sebelum merge (*strict*)
- ✅ Force push dan penghapusan branch dinonaktifkan
- ✅ Riwayat commit wajib linear

Bukti konfigurasi tersedia pada folder [`screenshots/`](screenshots/):

| Berkas | Isi |
|---|---|
| `screenshots/1_ci_check_error.png` | CI check gagal karena pengujian tidak lolos |
| `screenshots/2_ci_check_pass.png` | CI check lolos setelah pengujian diperbaiki |
| `screenshots/3_branch_protection.png` | Branch protection pada halaman pull request |

---

## 🗂️ Struktur Proyek

```
.
├── .github/workflows/        # Konfigurasi CI (ci.yml) dan CD (cd.yml)
├── .storybook/               # Konfigurasi Storybook (main.js & preview.jsx)
├── cypress/
│   ├── e2e/                  # Berkas pengujian end-to-end
│   └── support/              # Custom command & stub Dicoding Forum API
├── screenshots/              # Bukti CI check & branch protection
├── cypress.config.js
├── eslint.config.js
├── vercel.json               # Konfigurasi build & SPA rewrite di Vercel
├── vite.config.js            # Konfigurasi Vite + Vitest
├── .env.example
└── src
    ├── index.jsx             # Entry point: StrictMode + Provider + BrowserRouter
    ├── App.jsx               # Layout utama & definisi route
    ├── setupTests.js         # Setup global Vitest (jest-dom, cleanup)
    │
    ├── components/           # ── UI: komponen presentasional reusable
    │   ├── *.jsx             #    komponen
    │   ├── *.stories.jsx     #    story Storybook
    │   └── *.test.jsx        #    pengujian komponen
    │
    ├── pages/                # ── UI: satu berkas untuk satu halaman
    │
    ├── states/               # ── STATE: action (thunk), reducer, store
    │   ├── index.js          #    configureStore + factory createStore untuk pengujian
    │   ├── selectors.js      #    selector & derived state
    │   ├── authUser/  isPreload/  leaderboards/  shared/
    │   ├── threadDetail/  threads/  ui/  users/  votes/
    │   └── */*.test.js       #    pengujian reducer & thunk
    │
    ├── tests/                # Fixture bersama & helper render (Provider + Router)
    ├── utils/                # api.js (satu-satunya pemanggilan REST API), helper, propTypes
    └── styles/style.css
```

**Pemisahan UI dan State** dilakukan pada level folder: seluruh logika state berada di
`src/states`, sedangkan `src/components` dan `src/pages` hanya menangani tampilan.
Komponen tidak pernah memanggil REST API secara langsung — komponen hanya
men-*dispatch* action, dan seluruh `fetch` terjadi di `src/utils/api.js` yang dipanggil
dari thunk pada `src/states/**/action.js`.

---

## 🧠 Desain State

```
store
├── authUser        : object | null   → profil pengguna yang sedang masuk
├── isPreload       : boolean         → status pemulihan sesi saat aplikasi dibuka
├── users           : array           → daftar pengguna (memetakan ownerId thread)
├── threads
│   ├── items       : array           → daftar thread dari API
│   └── category    : string          → kategori yang sedang difilter
├── threadDetail    : object | null   → detail thread + komentarnya
├── leaderboards    : array           → klasemen pengguna
└── ui
    ├── loadingCount: number          → jumlah request yang sedang berjalan
    └── message     : object | null   → notifikasi toast (success / error / info)
```

Indikator loading dikelola otomatis: sebuah *matcher* pada slice `ui` menaikkan
`loadingCount` pada setiap action `*/pending` dan menurunkannya pada `*/fulfilled`
maupun `*/rejected`. Action vote dikecualikan karena sudah memakai optimistic update.

---

## ✅ Pemenuhan Kriteria Submission

### Kriteria 1 — Automation Testing
- [x] Lebih dari dua pengujian fungsi **reducer** (7 berkas)
- [x] Lebih dari dua pengujian fungsi **thunk** (5 berkas)
- [x] Lebih dari dua pengujian **React component** (7 berkas + 1 pengujian integrasi)
- [x] Pengujian **end-to-end** untuk alur login (`cypress/e2e/login.cy.js`)
- [x] Skenario pengujian ditulis pada setiap berkas pengujian
- [x] Dapat dijalankan dengan `npm test` dan `npm run e2e`

### Kriteria 2 — Deployment Aplikasi
- [x] Deploy dengan teknik CI/CD
- [x] Continuous Integration memakai GitHub Actions
- [x] Continuous Deployment memakai Vercel
- [x] Branch `master` diproteksi
- [x] URL Vercel: <https://dicoding-forum-app-kappa.vercel.app>
- [x] Screenshot bukti pada folder `screenshots/`

### Kriteria 3 — React Ecosystem
- [x] **Storybook** (6 berkas story, addon docs & a11y)
- [x] **React Hook Form** (validasi seluruh form aplikasi)

### Kriteria 4 — Mempertahankan Kriteria Submission Sebelumnya
- [x] Fungsionalitas aplikasi (registrasi, login, daftar & detail thread, buat thread & komentar, loading indicator)
- [x] Bugs highlighting (ESLint + Dicoding Academy Style Guide, `React.StrictMode`)
- [x] Arsitektur aplikasi (state API di Redux Store, tidak ada `fetch` di komponen, UI terpisah dari state, komponen modular)

### Saran tambahan
- [x] Lebih dari tiga pengujian reducer, thunk, dan komponen
- [x] Lebih dari dua stories komponen (6 berkas story)
- [x] Fitur votes pada thread dan komentar
- [x] Halaman leaderboard
- [x] Filter daftar thread berdasarkan kategori

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan submission kelas Dicoding.
