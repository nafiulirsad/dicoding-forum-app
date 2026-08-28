/**
 * Skenario pengujian
 *
 * - asyncToggleVoteThread thunk
 *   - harus memanggil API vote thread sesuai jenis vote yang dipilih
 *   - harus men-dispatch action pending lalu fulfilled ketika vote berhasil
 *   - harus men-dispatch action rejected ketika vote gagal sehingga reducer dapat melakukan rollback
 *   - harus membawa data rollback (userId & previousVoteType) di dalam meta.arg
 * - asyncToggleVoteComment thunk
 *   - harus memanggil API vote komentar dengan threadId dan commentId yang benar
 *   - harus men-dispatch action fulfilled ketika vote komentar berhasil
 *   - harus men-dispatch action rejected ketika vote komentar gagal
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../utils/api';
import { asyncToggleVoteComment, asyncToggleVoteThread } from './action';

vi.mock('../../utils/api', () => ({
  default: {
    toggleVoteThread: vi.fn(),
    toggleVoteComment: vi.fn(),
  },
}));

const threadVoteArg = {
  threadId: 'thread-1',
  voteType: 'up-vote',
  previousVoteType: 'neutral-vote',
  userId: 'users-1',
};

const commentVoteArg = {
  threadId: 'thread-1',
  commentId: 'comment-1',
  voteType: 'down-vote',
  previousVoteType: 'up-vote',
  userId: 'users-1',
};

const getState = () => ({});

let dispatch;

beforeEach(() => {
  dispatch = vi.fn();
});

describe('asyncToggleVoteThread thunk', () => {
  it('harus memanggil API vote thread sesuai jenis vote yang dipilih', async () => {
    // arrange
    api.toggleVoteThread.mockResolvedValue({ id: 'vote-1' });

    // action
    await asyncToggleVoteThread(threadVoteArg)(dispatch, getState, undefined);

    // assert
    expect(api.toggleVoteThread).toHaveBeenCalledWith({
      threadId: 'thread-1',
      voteType: 'up-vote',
    });
  });

  it('harus men-dispatch action pending lalu fulfilled ketika vote berhasil', async () => {
    // arrange
    api.toggleVoteThread.mockResolvedValue({ id: 'vote-1' });

    // action
    await asyncToggleVoteThread(threadVoteArg)(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].type).toBe('votes/toggleVoteThread/pending');
    expect(dispatch.mock.calls[1][0].type).toBe('votes/toggleVoteThread/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual({
      threadId: 'thread-1',
      voteType: 'up-vote',
    });
  });

  it('harus men-dispatch action rejected ketika vote gagal sehingga reducer dapat melakukan rollback', async () => {
    // arrange
    api.toggleVoteThread.mockRejectedValue(new Error('Missing authentication'));

    // action
    await asyncToggleVoteThread(threadVoteArg)(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('votes/toggleVoteThread/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('Missing authentication');
  });

  it('harus membawa data rollback (userId & previousVoteType) di dalam meta.arg', async () => {
    // arrange
    api.toggleVoteThread.mockResolvedValue({ id: 'vote-1' });

    // action
    await asyncToggleVoteThread(threadVoteArg)(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].meta.arg).toEqual(threadVoteArg);
  });
});

describe('asyncToggleVoteComment thunk', () => {
  it('harus memanggil API vote komentar dengan threadId dan commentId yang benar', async () => {
    // arrange
    api.toggleVoteComment.mockResolvedValue({ id: 'vote-2' });

    // action
    await asyncToggleVoteComment(commentVoteArg)(dispatch, getState, undefined);

    // assert
    expect(api.toggleVoteComment).toHaveBeenCalledWith({
      threadId: 'thread-1',
      commentId: 'comment-1',
      voteType: 'down-vote',
    });
  });

  it('harus men-dispatch action fulfilled ketika vote komentar berhasil', async () => {
    // arrange
    api.toggleVoteComment.mockResolvedValue({ id: 'vote-2' });

    // action
    await asyncToggleVoteComment(commentVoteArg)(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('votes/toggleVoteComment/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual({
      threadId: 'thread-1',
      commentId: 'comment-1',
      voteType: 'down-vote',
    });
  });

  it('harus men-dispatch action rejected ketika vote komentar gagal', async () => {
    // arrange
    api.toggleVoteComment.mockRejectedValue(new Error('Comment not found'));

    // action
    await asyncToggleVoteComment(commentVoteArg)(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('votes/toggleVoteComment/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('Comment not found');
  });
});
