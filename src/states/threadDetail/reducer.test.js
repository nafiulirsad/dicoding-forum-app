/**
 * Skenario pengujian
 *
 * - threadDetail reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus mengosongkan detail thread ketika diberi action asyncReceiveThreadDetail/pending
 *   - harus mengembalikan detail thread ketika diberi action asyncReceiveThreadDetail/fulfilled
 *   - harus mengosongkan detail thread ketika diberi action asyncReceiveThreadDetail/rejected
 *   - harus mengosongkan detail thread ketika diberi action clearThreadDetail
 *   - harus menambahkan komentar baru di posisi teratas ketika diberi action asyncCreateComment/fulfilled
 *   - harus menerapkan vote thread secara optimistis ketika id thread sesuai
 *   - harus mengabaikan vote thread ketika id thread tidak sesuai
 *   - harus menerapkan vote komentar secara optimistis ketika diberi action asyncToggleVoteComment/pending
 *   - harus mengembalikan vote komentar ke posisi semula ketika diberi action asyncToggleVoteComment/rejected
 */

import { describe, expect, it } from 'vitest';
import threadDetailReducer, { clearThreadDetail } from './reducer';
import { asyncCreateComment, asyncReceiveThreadDetail } from './action';
import { asyncToggleVoteComment, asyncToggleVoteThread } from '../votes/action';
import { commentFirst, threadDetail, userJane } from '../../tests/fixtures';

const newComment = {
  id: 'comment-2',
  content: 'Setuju, Redux Toolkit lebih ringkas.',
  createdAt: '2026-08-22T08:19:09.775Z',
  owner: userJane,
  upVotesBy: [],
  downVotesBy: [],
};

describe('threadDetail reducer', () => {
  it('harus mengembalikan state awal ketika diberi action yang tidak dikenal', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('harus mengosongkan detail thread ketika diberi action asyncReceiveThreadDetail/pending', () => {
    // arrange
    const initialState = threadDetail;
    const action = asyncReceiveThreadDetail.pending('request-id', 'thread-1');

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('harus mengembalikan detail thread ketika diberi action asyncReceiveThreadDetail/fulfilled', () => {
    // arrange
    const initialState = null;
    const action = asyncReceiveThreadDetail.fulfilled(threadDetail, 'request-id', 'thread-1');

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual(threadDetail);
  });

  it('harus mengosongkan detail thread ketika diberi action asyncReceiveThreadDetail/rejected', () => {
    // arrange
    const initialState = threadDetail;
    const action = asyncReceiveThreadDetail.rejected(
      new Error('gagal'),
      'request-id',
      'thread-1',
      'Thread tidak ditemukan.',
    );

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('harus mengosongkan detail thread ketika diberi action clearThreadDetail', () => {
    // arrange
    const initialState = threadDetail;

    // action
    const nextState = threadDetailReducer(initialState, clearThreadDetail());

    // assert
    expect(nextState).toBeNull();
  });

  it('harus menambahkan komentar baru di posisi teratas ketika diberi action asyncCreateComment/fulfilled', () => {
    // arrange
    const initialState = { ...threadDetail, comments: [commentFirst] };
    const action = asyncCreateComment.fulfilled(newComment, 'request-id', {
      threadId: 'thread-1',
      content: newComment.content,
    });

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.comments).toHaveLength(2);
    expect(nextState.comments[0]).toEqual(newComment);
  });

  it('harus menerapkan vote thread secara optimistis ketika id thread sesuai', () => {
    // arrange
    const initialState = { ...threadDetail, upVotesBy: [], downVotesBy: [] };
    const action = asyncToggleVoteThread.pending('request-id', {
      threadId: 'thread-1',
      userId: 'users-2',
      voteType: 'up-vote',
      previousVoteType: 'neutral-vote',
    });

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.upVotesBy).toEqual(['users-2']);
  });

  it('harus mengabaikan vote thread ketika id thread tidak sesuai', () => {
    // arrange
    const initialState = { ...threadDetail, upVotesBy: [], downVotesBy: [] };
    const action = asyncToggleVoteThread.pending('request-id', {
      threadId: 'thread-999',
      userId: 'users-2',
      voteType: 'up-vote',
      previousVoteType: 'neutral-vote',
    });

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.upVotesBy).toEqual([]);
  });

  it('harus menerapkan vote komentar secara optimistis ketika diberi action asyncToggleVoteComment/pending', () => {
    // arrange
    const initialState = { ...threadDetail, comments: [{ ...commentFirst }] };
    const action = asyncToggleVoteComment.pending('request-id', {
      threadId: 'thread-1',
      commentId: 'comment-1',
      userId: 'users-1',
      voteType: 'down-vote',
      previousVoteType: 'neutral-vote',
    });

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.comments[0].downVotesBy).toEqual(['users-1']);
    expect(nextState.comments[0].upVotesBy).toEqual([]);
  });

  it('harus mengembalikan vote komentar ke posisi semula ketika diberi action asyncToggleVoteComment/rejected', () => {
    // arrange
    const initialState = {
      ...threadDetail,
      comments: [{ ...commentFirst, downVotesBy: ['users-1'] }],
    };
    const action = asyncToggleVoteComment.rejected(
      new Error('gagal'),
      'request-id',
      {
        threadId: 'thread-1',
        commentId: 'comment-1',
        userId: 'users-1',
        voteType: 'down-vote',
        previousVoteType: 'neutral-vote',
      },
      'Vote gagal dikirim.',
    );

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState.comments[0].downVotesBy).toEqual([]);
    expect(nextState.comments[0].upVotesBy).toEqual([]);
  });
});
