/**
 * Skenario pengujian
 *
 * - VoteButtons component
 *   - harus menampilkan jumlah up-vote dan down-vote sesuai data yang diberikan
 *   - harus menandai tombol up-vote sebagai aktif ketika pengguna sudah memberi up-vote
 *   - harus menandai tombol down-vote sebagai aktif ketika pengguna sudah memberi down-vote
 *   - harus memanggil onVote dengan up-vote ketika pengguna belum pernah memberi vote
 *   - harus memanggil onVote dengan neutral-vote ketika pengguna menekan tombol yang sedang aktif
 *   - harus memanggil onVote dengan down-vote ketika pengguna berpindah dari up-vote
 *   - harus tetap memanggil onVote ketika pengguna belum masuk agar aplikasi dapat mengarahkan ke halaman login
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoteButtons from './VoteButtons';

const renderVoteButtons = (props = {}) => render(
  <VoteButtons
    upVotesBy={[]}
    downVotesBy={[]}
    authUserId="users-1"
    onVote={vi.fn()}
    {...props}
  />,
);

describe('VoteButtons component', () => {
  it('harus menampilkan jumlah up-vote dan down-vote sesuai data yang diberikan', () => {
    // arrange
    renderVoteButtons({ upVotesBy: ['users-2', 'users-3'], downVotesBy: ['users-4'] });

    // action & assert
    expect(screen.getByRole('button', { name: 'Suka' })).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: 'Tidak suka' })).toHaveTextContent('1');
  });

  it('harus menandai tombol up-vote sebagai aktif ketika pengguna sudah memberi up-vote', () => {
    // arrange
    renderVoteButtons({ upVotesBy: ['users-1'] });

    // action & assert
    expect(screen.getByRole('button', { name: 'Suka' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Tidak suka' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('harus menandai tombol down-vote sebagai aktif ketika pengguna sudah memberi down-vote', () => {
    // arrange
    renderVoteButtons({ downVotesBy: ['users-1'] });

    // action & assert
    expect(screen.getByRole('button', { name: 'Tidak suka' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('harus memanggil onVote dengan up-vote ketika pengguna belum pernah memberi vote', async () => {
    // arrange
    const user = userEvent.setup();
    const onVote = vi.fn();
    renderVoteButtons({ onVote });

    // action
    await user.click(screen.getByRole('button', { name: 'Suka' }));

    // assert
    expect(onVote).toHaveBeenCalledWith({
      voteType: 'up-vote',
      previousVoteType: 'neutral-vote',
    });
  });

  it('harus memanggil onVote dengan neutral-vote ketika pengguna menekan tombol yang sedang aktif', async () => {
    // arrange
    const user = userEvent.setup();
    const onVote = vi.fn();
    renderVoteButtons({ upVotesBy: ['users-1'], onVote });

    // action
    await user.click(screen.getByRole('button', { name: 'Suka' }));

    // assert
    expect(onVote).toHaveBeenCalledWith({
      voteType: 'neutral-vote',
      previousVoteType: 'up-vote',
    });
  });

  it('harus memanggil onVote dengan down-vote ketika pengguna berpindah dari up-vote', async () => {
    // arrange
    const user = userEvent.setup();
    const onVote = vi.fn();
    renderVoteButtons({ upVotesBy: ['users-1'], onVote });

    // action
    await user.click(screen.getByRole('button', { name: 'Tidak suka' }));

    // assert
    expect(onVote).toHaveBeenCalledWith({
      voteType: 'down-vote',
      previousVoteType: 'up-vote',
    });
  });

  it('harus tetap memanggil onVote ketika pengguna belum masuk agar aplikasi dapat mengarahkan ke halaman login', async () => {
    // arrange
    const user = userEvent.setup();
    const onVote = vi.fn();
    renderVoteButtons({ authUserId: null, onVote });

    // action
    await user.click(screen.getByRole('button', { name: 'Suka' }));

    // assert
    expect(onVote).toHaveBeenCalledWith({
      voteType: 'up-vote',
      previousVoteType: 'neutral-vote',
    });
  });
});
