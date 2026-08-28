/**
 * Kumpulan helper murni (pure function) yang dipakai lintas komponen.
 */

const MILLISECONDS = {
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};

/**
 * Mengubah tanggal ISO menjadi keterangan waktu relatif berbahasa Indonesia.
 * @param {string} isoDate tanggal dalam format ISO 8601
 * @returns {string} contoh: "3 jam lalu"
 */
export function showFormattedDate(isoDate) {
  const target = new Date(isoDate);

  if (Number.isNaN(target.getTime())) {
    return 'Waktu tidak diketahui';
  }

  const diff = Date.now() - target.getTime();

  if (diff < MILLISECONDS.minute) return 'Baru saja';
  if (diff < MILLISECONDS.hour) return `${Math.floor(diff / MILLISECONDS.minute)} menit lalu`;
  if (diff < MILLISECONDS.day) return `${Math.floor(diff / MILLISECONDS.hour)} jam lalu`;
  if (diff < MILLISECONDS.month) return `${Math.floor(diff / MILLISECONDS.day)} hari lalu`;
  if (diff < MILLISECONDS.year) return `${Math.floor(diff / MILLISECONDS.month)} bulan lalu`;

  return target.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Membersihkan tag HTML dari body thread agar aman ditampilkan sebagai teks biasa.
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * Memotong teks panjang menjadi cuplikan.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text = '', maxLength = 180) {
  const clean = stripHtml(text);
  return clean.length <= maxLength ? clean : `${clean.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Menggabungkan daftar thread dengan data pengguna sehingga tiap thread
 * membawa informasi pemiliknya (nama & avatar).
 * @param {Array} threads
 * @param {Array} users
 * @returns {Array}
 */
export function mapThreadsWithOwner(threads = [], users = []) {
  return threads.map((thread) => ({
    ...thread,
    owner: users.find((user) => user.id === thread.ownerId) ?? {
      id: thread.ownerId,
      name: 'Pengguna',
      avatar: 'https://ui-avatars.com/api/?name=U&background=random',
    },
  }));
}

/**
 * Mengambil daftar kategori unik dari kumpulan thread.
 * @param {Array} threads
 * @returns {Array<string>}
 */
export function getUniqueCategories(threads = []) {
  return [...new Set(threads.map((thread) => thread.category).filter(Boolean))].sort();
}

/**
 * Mengetahui posisi vote pengguna terhadap sebuah thread/komentar.
 * @param {{ upVotesBy: Array<string>, downVotesBy: Array<string> }} entity
 * @param {string|null} userId
 * @returns {'up-vote'|'down-vote'|'neutral-vote'}
 */
export function getUserVoteType(entity, userId) {
  if (!userId || !entity) return 'neutral-vote';
  if (entity.upVotesBy?.includes(userId)) return 'up-vote';
  if (entity.downVotesBy?.includes(userId)) return 'down-vote';
  return 'neutral-vote';
}

/**
 * Menentukan vote berikutnya. Menekan tombol yang sama akan membatalkan vote.
 * @param {'up-vote'|'down-vote'|'neutral-vote'} currentVote
 * @param {'up-vote'|'down-vote'} intent
 * @returns {'up-vote'|'down-vote'|'neutral-vote'}
 */
export function resolveVoteType(currentVote, intent) {
  return currentVote === intent ? 'neutral-vote' : intent;
}
