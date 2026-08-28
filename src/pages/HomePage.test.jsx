/**
 * Pengujian integrasi: HomePage dirender bersama Redux store sungguhan
 * (bukan store tiruan) sehingga alur thunk → reducer → selector → komponen
 * ikut teruji. Hanya lapisan jaringan (`utils/api`) yang ditiru.
 *
 * Skenario pengujian
 *
 * - HomePage integration
 *   - harus memuat daftar thread dari API lalu menampilkannya
 *   - harus menampilkan kategori unik dari daftar thread yang dimuat
 *   - harus menyaring daftar thread ketika sebuah kategori dipilih
 *   - harus menampilkan seluruh thread kembali ketika tombol "Semua" ditekan
 *   - harus mengarahkan pengguna yang belum masuk ke halaman login saat menekan tombol vote
 *   - harus memperbarui jumlah vote secara optimistis ketika pengguna yang sudah masuk memberi vote
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';
import api from '../utils/api';
import renderWithProviders from '../tests/renderWithProviders';
import { rawThreads, userJohn, users } from '../tests/fixtures';

vi.mock('../utils/api', () => ({
  default: {
    getAllUsers: vi.fn(),
    getAllThreads: vi.fn(),
    toggleVoteThread: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  api.getAllUsers.mockResolvedValue(users);
  api.getAllThreads.mockResolvedValue(rawThreads);
  api.toggleVoteThread.mockResolvedValue({ id: 'vote-1' });
});

describe('HomePage integration', () => {
  it('harus memuat daftar thread dari API lalu menampilkannya', async () => {
    // arrange & action
    renderWithProviders(<HomePage />);

    // assert
    expect(await screen.findByText(rawThreads[0].title)).toBeInTheDocument();
    expect(screen.getByText(rawThreads[1].title)).toBeInTheDocument();
    expect(screen.getByText('2 diskusi')).toBeInTheDocument();
  });

  it('harus menampilkan kategori unik dari daftar thread yang dimuat', async () => {
    // arrange & action
    renderWithProviders(<HomePage />);

    // assert
    expect(await screen.findByRole('button', { name: '#react' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#redux' })).toBeInTheDocument();
  });

  it('harus menyaring daftar thread ketika sebuah kategori dipilih', async () => {
    // arrange
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    const reactChip = await screen.findByRole('button', { name: '#react' });

    // action
    await user.click(reactChip);

    // assert
    await waitFor(() => {
      expect(screen.queryByText(rawThreads[1].title)).not.toBeInTheDocument();
    });
    expect(screen.getByText(rawThreads[0].title)).toBeInTheDocument();
    expect(screen.getByText('1 diskusi')).toBeInTheDocument();
  });

  it('harus menampilkan seluruh thread kembali ketika tombol "Semua" ditekan', async () => {
    // arrange
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    await user.click(await screen.findByRole('button', { name: '#react' }));

    // action
    await user.click(screen.getByRole('button', { name: 'Semua' }));

    // assert
    expect(await screen.findByText(rawThreads[1].title)).toBeInTheDocument();
    expect(screen.getByText('2 diskusi')).toBeInTheDocument();
  });

  it('harus mengarahkan pengguna yang belum masuk ke halaman login saat menekan tombol vote', async () => {
    // arrange
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    await screen.findByText(rawThreads[0].title);

    // action
    await user.click(screen.getAllByRole('button', { name: 'Suka' })[0]);

    // assert
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(api.toggleVoteThread).not.toHaveBeenCalled();
  });

  it('harus memperbarui jumlah vote secara optimistis ketika pengguna yang sudah masuk memberi vote', async () => {
    // arrange
    const user = userEvent.setup();
    const { store } = renderWithProviders(<HomePage />, {
      preloadedState: { authUser: userJohn, isPreload: false },
    });
    await screen.findByText(rawThreads[0].title);

    // action
    await user.click(screen.getAllByRole('button', { name: 'Suka' })[0]);

    // assert
    await waitFor(() => {
      expect(store.getState().threads.items[0].upVotesBy).toEqual([userJohn.id]);
    });
    expect(api.toggleVoteThread).toHaveBeenCalledWith({
      threadId: rawThreads[0].id,
      voteType: 'up-vote',
    });
  });
});
