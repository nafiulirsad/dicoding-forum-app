/**
 * Skenario pengujian
 *
 * - ThreadItem component
 *   - harus menampilkan judul, nama pemilik, dan kategori thread
 *   - harus menampilkan jumlah komentar thread
 *   - harus menampilkan cuplikan isi thread tanpa tag HTML
 *   - harus menautkan judul thread ke halaman detail
 *   - harus memanggil onVote beserta id thread ketika tombol suka ditekan
 *   - tidak boleh menampilkan kategori ketika thread tidak memiliki kategori
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';
import { threadWithOwner } from '../tests/fixtures';

const renderThreadItem = (props = {}) => render(
  <MemoryRouter>
    <ThreadItem
      thread={threadWithOwner}
      authUserId="users-1"
      onVote={vi.fn()}
      {...props}
    />
  </MemoryRouter>,
);

describe('ThreadItem component', () => {
  it('harus menampilkan judul, nama pemilik, dan kategori thread', () => {
    // arrange
    renderThreadItem();

    // action & assert
    expect(screen.getByText(threadWithOwner.title)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('harus menampilkan jumlah komentar thread', () => {
    // arrange
    renderThreadItem();

    // action & assert
    expect(screen.getByRole('button', { name: /2 komentar/i })).toBeInTheDocument();
  });

  it('harus menampilkan cuplikan isi thread tanpa tag HTML', () => {
    // arrange
    renderThreadItem({
      thread: { ...threadWithOwner, body: '<p>Halo <strong>dunia</strong></p>' },
    });

    // action & assert
    expect(screen.getByText('Halo dunia')).toBeInTheDocument();
  });

  it('harus menautkan judul thread ke halaman detail', () => {
    // arrange
    renderThreadItem();

    // action & assert
    expect(screen.getByRole('link', { name: threadWithOwner.title }))
      .toHaveAttribute('href', '/threads/thread-1');
  });

  it('harus memanggil onVote beserta id thread ketika tombol suka ditekan', async () => {
    // arrange
    const user = userEvent.setup();
    const onVote = vi.fn();
    renderThreadItem({ onVote });

    // action
    await user.click(screen.getByRole('button', { name: 'Suka' }));

    // assert
    expect(onVote).toHaveBeenCalledWith({
      threadId: 'thread-1',
      voteType: 'up-vote',
      previousVoteType: 'neutral-vote',
    });
  });

  it('tidak boleh menampilkan kategori ketika thread tidak memiliki kategori', () => {
    // arrange
    renderThreadItem({ thread: { ...threadWithOwner, category: '' } });

    // action & assert
    expect(screen.queryByText('#react')).not.toBeInTheDocument();
  });
});
