/**
 * Skenario pengujian
 *
 * - threads reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus mengembalikan daftar thread ketika diberi action asyncReceiveThreads/fulfilled
 *   - harus mengembalikan daftar thread ketika diberi action asyncPopulateUsersAndThreads/fulfilled
 *   - harus menambahkan thread baru di posisi teratas ketika diberi action asyncCreateThread/fulfilled
 *   - harus menyimpan kategori terpilih ketika diberi action setCategoryFilter
 *   - harus mengosongkan kategori terpilih ketika diberi action clearCategoryFilter
 *   - harus menerapkan up-vote secara optimistis ketika diberi action asyncToggleVoteThread/pending
 *   - harus memindahkan vote dari up ke down ketika pengguna menekan tombol sebaliknya
 *   - harus membatalkan vote ketika voteType bernilai neutral-vote
 *   - harus mengembalikan vote ke posisi semula ketika diberi action asyncToggleVoteThread/rejected
 */

import { describe, expect, it } from 'vitest';
import threadsReducer, { clearCategoryFilter, setCategoryFilter } from './reducer';
import { asyncCreateThread, asyncReceiveThreads } from './action';
import { asyncPopulateUsersAndThreads } from '../shared/action';
import { asyncToggleVoteThread } from '../votes/action';
import { rawThreadReact, rawThreadRedux, rawThreads, users } from '../../tests/fixtures';

describe('threads reducer', () => {
  it('harus mengembalikan state awal ketika diberi action yang tidak dikenal', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual({ items: [], category: '' });
  });

  it('harus mengembalikan daftar thread ketika diberi action asyncReceiveThreads/fulfilled', () => {
    // arrange
    const initialState = { items: [], category: '' };
    const action = asyncReceiveThreads.fulfilled(rawThreads, 'request-id');

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState.items).toEqual(rawThreads);
    expect(nextState.category).toBe('');
  });

  it('harus mengembalikan daftar thread ketika diberi action asyncPopulateUsersAndThreads/fulfilled', () => {
    // arrange
    const initialState = { items: [], category: 'react' };
    const action = asyncPopulateUsersAndThreads.fulfilled(
      { users, threads: rawThreads },
      'request-id',
    );

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState.items).toEqual(rawThreads);
    expect(nextState.category).toBe('react');
  });

  it('harus menambahkan thread baru di posisi teratas ketika diberi action asyncCreateThread/fulfilled', () => {
    // arrange
    const initialState = { items: [rawThreadRedux], category: '' };
    const action = asyncCreateThread.fulfilled(rawThreadReact, 'request-id', {
      title: rawThreadReact.title,
      body: rawThreadReact.body,
      category: rawThreadReact.category,
    });

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState.items).toHaveLength(2);
    expect(nextState.items[0]).toEqual(rawThreadReact);
  });

  it('harus menyimpan kategori terpilih ketika diberi action setCategoryFilter', () => {
    // arrange
    const initialState = { items: rawThreads, category: '' };

    // action
    const nextState = threadsReducer(initialState, setCategoryFilter('redux'));

    // assert
    expect(nextState.category).toBe('redux');
    expect(nextState.items).toEqual(rawThreads);
  });

  it('harus mengosongkan kategori terpilih ketika diberi action clearCategoryFilter', () => {
    // arrange
    const initialState = { items: rawThreads, category: 'redux' };

    // action
    const nextState = threadsReducer(initialState, clearCategoryFilter());

    // assert
    expect(nextState.category).toBe('');
  });

  it('harus menerapkan up-vote secara optimistis ketika diberi action asyncToggleVoteThread/pending', () => {
    // arrange
    const initialState = { items: [{ ...rawThreadReact }], category: '' };
    const action = asyncToggleVoteThread.pending('request-id', {
      threadId: 'thread-1',
      userId: 'users-9',
      voteType: 'up-vote',
      previousVoteType: 'neutral-vote',
    });

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState.items[0].upVotesBy).toEqual(['users-9']);
    expect(nextState.items[0].downVotesBy).toEqual([]);
  });

  it('harus memindahkan vote dari up ke down ketika pengguna menekan tombol sebaliknya', () => {
    // arrange
    const initialState = {
      items: [{ ...rawThreadReact, upVotesBy: ['users-9'], downVotesBy: [] }],
      category: '',
    };
    const action = asyncToggleVoteThread.pending('request-id', {
      threadId: 'thread-1',
      userId: 'users-9',
      voteType: 'down-vote',
      previousVoteType: 'up-vote',
    });

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState.items[0].upVotesBy).toEqual([]);
    expect(nextState.items[0].downVotesBy).toEqual(['users-9']);
  });

  it('harus membatalkan vote ketika voteType bernilai neutral-vote', () => {
    // arrange
    const initialState = {
      items: [{ ...rawThreadReact, upVotesBy: ['users-9'], downVotesBy: [] }],
      category: '',
    };
    const action = asyncToggleVoteThread.pending('request-id', {
      threadId: 'thread-1',
      userId: 'users-9',
      voteType: 'neutral-vote',
      previousVoteType: 'up-vote',
    });

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState.items[0].upVotesBy).toEqual([]);
    expect(nextState.items[0].downVotesBy).toEqual([]);
  });

  it('harus mengembalikan vote ke posisi semula ketika diberi action asyncToggleVoteThread/rejected', () => {
    // arrange
    const initialState = {
      items: [{ ...rawThreadReact, upVotesBy: ['users-9'], downVotesBy: [] }],
      category: '',
    };
    const action = asyncToggleVoteThread.rejected(
      new Error('gagal'),
      'request-id',
      {
        threadId: 'thread-1',
        userId: 'users-9',
        voteType: 'up-vote',
        previousVoteType: 'neutral-vote',
      },
      'Vote gagal dikirim.',
    );

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState.items[0].upVotesBy).toEqual([]);
    expect(nextState.items[0].downVotesBy).toEqual([]);
  });
});
