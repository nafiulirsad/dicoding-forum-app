/**
 * Skenario pengujian
 *
 * - ui reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus menyimpan pesan ketika diberi action setMessage
 *   - harus menghapus pesan ketika diberi action clearMessage
 *   - harus menaikkan loadingCount ketika diberi action bertipe /pending
 *   - harus menurunkan loadingCount ketika diberi action bertipe /fulfilled
 *   - harus menjaga loadingCount tidak pernah bernilai negatif
 *   - harus mengabaikan action votes/ karena memakai optimistic update
 *   - harus mengabaikan action authUser/preload agar tidak memunculkan loading bar
 *   - harus menyimpan pesan galat ketika diberi action bertipe /rejected
 *   - harus memakai error.message ketika action rejected tidak membawa payload
 */

import { describe, expect, it } from 'vitest';
import uiReducer, { clearMessage, setMessage } from './reducer';

const initialState = { loadingCount: 0, message: null };

describe('ui reducer', () => {
  it('harus mengembalikan state awal ketika diberi action yang tidak dikenal', () => {
    // arrange
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = uiReducer(undefined, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('harus menyimpan pesan ketika diberi action setMessage', () => {
    // arrange
    const message = { type: 'success', text: 'Diskusi berhasil dibuat.' };

    // action
    const nextState = uiReducer(initialState, setMessage(message));

    // assert
    expect(nextState.message).toEqual(message);
  });

  it('harus menghapus pesan ketika diberi action clearMessage', () => {
    // arrange
    const state = { loadingCount: 0, message: { type: 'info', text: 'Halo' } };

    // action
    const nextState = uiReducer(state, clearMessage());

    // assert
    expect(nextState.message).toBeNull();
  });

  it('harus menaikkan loadingCount ketika diberi action bertipe /pending', () => {
    // arrange
    const action = { type: 'threads/receiveThreads/pending' };

    // action
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState.loadingCount).toBe(1);
  });

  it('harus menurunkan loadingCount ketika diberi action bertipe /fulfilled', () => {
    // arrange
    const state = { loadingCount: 2, message: null };
    const action = { type: 'threads/receiveThreads/fulfilled' };

    // action
    const nextState = uiReducer(state, action);

    // assert
    expect(nextState.loadingCount).toBe(1);
  });

  it('harus menjaga loadingCount tidak pernah bernilai negatif', () => {
    // arrange
    const action = { type: 'threads/receiveThreads/fulfilled' };

    // action
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState.loadingCount).toBe(0);
  });

  it('harus mengabaikan action votes/ karena memakai optimistic update', () => {
    // arrange
    const action = { type: 'votes/toggleVoteThread/pending' };

    // action
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState.loadingCount).toBe(0);
  });

  it('harus mengabaikan action authUser/preload agar tidak memunculkan loading bar', () => {
    // arrange
    const action = { type: 'authUser/preload/pending' };

    // action
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState.loadingCount).toBe(0);
  });

  it('harus menyimpan pesan galat ketika diberi action bertipe /rejected', () => {
    // arrange
    const action = {
      type: 'authUser/login/rejected',
      payload: 'email is not registered',
    };

    // action
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState.message).toEqual({ type: 'error', text: 'email is not registered' });
  });

  it('harus memakai error.message ketika action rejected tidak membawa payload', () => {
    // arrange
    const action = {
      type: 'threads/createThread/rejected',
      error: { message: 'Network error' },
    };

    // action
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState.message).toEqual({ type: 'error', text: 'Network error' });
  });
});
