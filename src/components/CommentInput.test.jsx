/**
 * Skenario pengujian
 *
 * - CommentInput component
 *   - harus menampilkan ajakan masuk dan menyembunyikan form ketika pengguna belum terotentikasi
 *   - harus menampilkan form komentar ketika pengguna sudah terotentikasi
 *   - harus menonaktifkan tombol kirim ketika komentar masih kosong
 *   - harus menonaktifkan tombol kirim ketika komentar hanya berisi spasi
 *   - harus memanggil onSubmit dengan isi komentar yang sudah dipangkas spasinya
 *   - harus mengosongkan kembali kolom komentar setelah komentar terkirim
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CommentInput from './CommentInput';

const renderCommentInput = (props = {}) => render(
  <MemoryRouter>
    <CommentInput isAuthenticated onSubmit={vi.fn()} {...props} />
  </MemoryRouter>,
);

describe('CommentInput component', () => {
  it('harus menampilkan ajakan masuk dan menyembunyikan form ketika pengguna belum terotentikasi', () => {
    // arrange
    renderCommentInput({ isAuthenticated: false });

    // action & assert
    expect(screen.getByRole('link', { name: 'Masuk' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Beri komentar')).not.toBeInTheDocument();
  });

  it('harus menampilkan form komentar ketika pengguna sudah terotentikasi', () => {
    // arrange
    renderCommentInput();

    // action & assert
    expect(screen.getByLabelText('Beri komentar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kirim Komentar' })).toBeInTheDocument();
  });

  it('harus menonaktifkan tombol kirim ketika komentar masih kosong', () => {
    // arrange
    renderCommentInput();

    // action & assert
    expect(screen.getByRole('button', { name: 'Kirim Komentar' })).toBeDisabled();
  });

  it('harus menonaktifkan tombol kirim ketika komentar hanya berisi spasi', async () => {
    // arrange
    const user = userEvent.setup();
    renderCommentInput();

    // action
    await user.type(screen.getByLabelText('Beri komentar'), '   ');

    // assert
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Kirim Komentar' })).toBeDisabled();
    });
  });

  it('harus memanggil onSubmit dengan isi komentar yang sudah dipangkas spasinya', async () => {
    // arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderCommentInput({ onSubmit });

    // action
    await user.type(screen.getByLabelText('Beri komentar'), '  Terima kasih!  ');
    await user.click(screen.getByRole('button', { name: 'Kirim Komentar' }));

    // assert
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Terima kasih!'));
  });

  it('harus mengosongkan kembali kolom komentar setelah komentar terkirim', async () => {
    // arrange
    const user = userEvent.setup();
    renderCommentInput({ onSubmit: vi.fn() });

    // action
    await user.type(screen.getByLabelText('Beri komentar'), 'Komentar pertama');
    await user.click(screen.getByRole('button', { name: 'Kirim Komentar' }));

    // assert
    await waitFor(() => expect(screen.getByLabelText('Beri komentar')).toHaveValue(''));
  });
});
