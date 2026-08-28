import { fn } from 'storybook/test';
import CategoryFilter from './CategoryFilter';

/**
 * Filter kategori pada halaman beranda. Kategori diambil dari daftar thread
 * yang sudah dimuat, lalu difilter di sisi klien melalui Redux.
 */
export default {
  title: 'Komponen/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
  args: {
    categories: ['react', 'redux', 'javascript', 'testing'],
    selectedCategory: '',
    onSelect: fn(),
  },
};

export const Default = {};

export const KategoriTerpilih = {
  name: 'Kategori terpilih',
  args: { selectedCategory: 'redux' },
};

export const SatuKategori = {
  name: 'Hanya satu kategori',
  args: { categories: ['react'] },
};

export const TanpaKategori = {
  name: 'Tanpa kategori (tidak dirender)',
  args: { categories: [] },
};
