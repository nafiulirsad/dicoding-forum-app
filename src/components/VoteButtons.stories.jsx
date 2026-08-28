import { fn } from 'storybook/test';
import VoteButtons from './VoteButtons';

/**
 * Tombol up-vote & down-vote yang dipakai ulang pada thread maupun komentar.
 * Posisi vote pengguna ditentukan dari keberadaan `authUserId`
 * di dalam `upVotesBy` atau `downVotesBy`.
 */
export default {
  title: 'Komponen/VoteButtons',
  component: VoteButtons,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: {
    upVotesBy: [],
    downVotesBy: [],
    authUserId: 'users-1',
    size: 'md',
    onVote: fn(),
  },
};

export const Netral = {
  args: { upVotesBy: ['users-9'], downVotesBy: [] },
};

export const SudahUpVote = {
  name: 'Sudah up-vote',
  args: { upVotesBy: ['users-1', 'users-9'], downVotesBy: [] },
};

export const SudahDownVote = {
  name: 'Sudah down-vote',
  args: { upVotesBy: [], downVotesBy: ['users-1'] },
};

export const BelumMasuk = {
  name: 'Pengguna belum masuk',
  args: { authUserId: null, upVotesBy: ['users-2', 'users-3'], downVotesBy: ['users-4'] },
};

export const UkuranKecil = {
  name: 'Ukuran kecil',
  args: { size: 'sm', upVotesBy: ['users-1'], downVotesBy: [] },
};
