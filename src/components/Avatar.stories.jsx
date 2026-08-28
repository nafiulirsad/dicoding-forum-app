import Avatar from './Avatar';

/**
 * Avatar dipakai pada navigasi, daftar thread, komentar, dan leaderboard.
 * Ketika `src` kosong, komponen otomatis memakai layanan ui-avatars
 * sebagai gambar cadangan berdasarkan nama pengguna.
 */
export default {
  title: 'Komponen/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    name: { control: 'text' },
    src: { control: 'text' },
  },
  args: {
    name: 'John Doe',
    src: '',
    size: 'md',
  },
};

export const Default = {};

export const Small = {
  args: { size: 'sm' },
};

export const Large = {
  args: { size: 'lg' },
};

export const WithCustomImage = {
  name: 'Dengan gambar kustom',
  args: {
    src: 'https://ui-avatars.com/api/?name=Jane+Roe&background=f43f5e&color=fff',
    name: 'Jane Roe',
    size: 'lg',
  },
};
