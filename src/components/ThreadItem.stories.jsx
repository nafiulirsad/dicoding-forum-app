import { fn } from 'storybook/test';
import ThreadItem from './ThreadItem';
import { threadWithOwner, userJane } from '../tests/fixtures';

/**
 * Kartu ringkasan satu thread pada halaman beranda.
 * Menampilkan pemilik, kategori, cuplikan isi, tombol vote, dan jumlah komentar.
 */
export default {
  title: 'Komponen/ThreadItem',
  component: ThreadItem,
  tags: ['autodocs'],
  args: {
    thread: threadWithOwner,
    authUserId: 'users-1',
    onVote: fn(),
  },
};

export const Default = {};

export const SudahDiVote = {
  name: 'Sudah di-vote pengguna',
  args: {
    thread: { ...threadWithOwner, upVotesBy: ['users-1'], totalComments: 12 },
  },
};

export const TanpaKategori = {
  name: 'Tanpa kategori',
  args: {
    thread: {
      ...threadWithOwner,
      category: '',
      owner: userJane,
      totalComments: 0,
    },
  },
};

export const IsiPanjang = {
  name: 'Isi diskusi panjang',
  args: {
    thread: {
      ...threadWithOwner,
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(8),
    },
  },
};
