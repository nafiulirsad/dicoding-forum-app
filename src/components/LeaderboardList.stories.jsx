import LeaderboardList from './LeaderboardList';
import { leaderboards, userJane, userJohn } from '../tests/fixtures';

/**
 * Klasemen pengguna paling aktif. Baris milik pengguna yang sedang masuk
 * diberi penanda "Anda" agar mudah ditemukan.
 */
export default {
  title: 'Komponen/LeaderboardList',
  component: LeaderboardList,
  tags: ['autodocs'],
  args: {
    leaderboards,
    authUserId: null,
  },
};

export const Default = {};

export const MenyorotiPenggunaSaatIni = {
  name: 'Menyoroti pengguna saat ini',
  args: { authUserId: 'users-2' },
};

export const KlasemenPanjang = {
  name: 'Klasemen panjang',
  args: {
    leaderboards: Array.from({ length: 6 }, (_, index) => ({
      user: {
        ...(index % 2 === 0 ? userJohn : userJane),
        id: `users-${index + 1}`,
        name: `Peserta ${index + 1}`,
      },
      score: 100 - index * 13,
    })),
  },
};
