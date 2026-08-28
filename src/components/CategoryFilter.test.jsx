/**
 * Skenario pengujian
 *
 * - CategoryFilter component
 *   - harus menampilkan tombol "Semua" beserta seluruh kategori yang tersedia
 *   - tidak boleh merender apa pun ketika daftar kategori kosong
 *   - harus menandai kategori yang sedang dipilih
 *   - harus memanggil onSelect dengan nama kategori ketika sebuah kategori ditekan
 *   - harus memanggil onSelect dengan string kosong ketika tombol "Semua" ditekan
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from './CategoryFilter';

const categories = ['react', 'redux', 'javascript'];

describe('CategoryFilter component', () => {
  it('harus menampilkan tombol "Semua" beserta seluruh kategori yang tersedia', () => {
    // arrange
    render(
      <CategoryFilter categories={categories} selectedCategory="" onSelect={vi.fn()} />,
    );

    // action & assert
    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#react' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#redux' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#javascript' })).toBeInTheDocument();
  });

  it('tidak boleh merender apa pun ketika daftar kategori kosong', () => {
    // arrange
    const { container } = render(
      <CategoryFilter categories={[]} selectedCategory="" onSelect={vi.fn()} />,
    );

    // action & assert
    expect(container).toBeEmptyDOMElement();
  });

  it('harus menandai kategori yang sedang dipilih', () => {
    // arrange
    render(
      <CategoryFilter categories={categories} selectedCategory="redux" onSelect={vi.fn()} />,
    );

    // action & assert
    expect(screen.getByRole('button', { name: '#redux' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Semua' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('harus memanggil onSelect dengan nama kategori ketika sebuah kategori ditekan', async () => {
    // arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CategoryFilter categories={categories} selectedCategory="" onSelect={onSelect} />,
    );

    // action
    await user.click(screen.getByRole('button', { name: '#react' }));

    // assert
    expect(onSelect).toHaveBeenCalledWith('reactjs');
  });

  it('harus memanggil onSelect dengan string kosong ketika tombol "Semua" ditekan', async () => {
    // arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CategoryFilter categories={categories} selectedCategory="react" onSelect={onSelect} />,
    );

    // action
    await user.click(screen.getByRole('button', { name: 'Semua' }));

    // assert
    expect(onSelect).toHaveBeenCalledWith('');
  });
});
