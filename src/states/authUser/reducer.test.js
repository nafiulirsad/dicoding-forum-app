/**
 * Skenario pengujian
 *
 * - authUser reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus mengembalikan data pengguna ketika diberi action setAuthUser
 *   - harus mengembalikan null ketika diberi action unsetAuthUser
 *   - harus mengembalikan data pengguna ketika diberi action asyncLoginUser/fulfilled
 *   - harus mengembalikan null ketika diberi action asyncLogoutUser/fulfilled
 *   - harus mengembalikan data pengguna ketika diberi action asyncPreloadProcess/fulfilled
 *   - harus mengembalikan null ketika diberi action asyncPreloadProcess/rejected
 */

import { describe, expect, it } from 'vitest';
import authUserReducer, { setAuthUser, unsetAuthUser } from './reducer';
import { asyncLoginUser, asyncLogoutUser, asyncPreloadProcess } from './action';
import { userJohn } from '../../tests/fixtures';

describe('authUser reducer', () => {
  it('harus mengembalikan state awal ketika diberi action yang tidak dikenal', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('harus mengembalikan data pengguna ketika diberi action setAuthUser', () => {
    // arrange
    const initialState = null;

    // action
    const nextState = authUserReducer(initialState, setAuthUser(userJohn));

    // assert
    expect(nextState).toEqual(userJohn);
  });

  it('harus mengembalikan null ketika diberi action unsetAuthUser', () => {
    // arrange
    const initialState = userJohn;

    // action
    const nextState = authUserReducer(initialState, unsetAuthUser());

    // assert
    expect(nextState).toBeNull();
  });

  it('harus mengembalikan data pengguna ketika diberi action asyncLoginUser/fulfilled', () => {
    // arrange
    const initialState = null;
    const action = asyncLoginUser.fulfilled(userJohn, 'request-id', {
      email: userJohn.email,
      password: 'rahasia123',
    });

    // action
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toEqual(userJohn);
  });

  it('harus mengembalikan null ketika diberi action asyncLogoutUser/fulfilled', () => {
    // arrange
    const initialState = userJohn;
    const action = asyncLogoutUser.fulfilled(null, 'request-id');

    // action
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('harus mengembalikan data pengguna ketika diberi action asyncPreloadProcess/fulfilled', () => {
    // arrange
    const initialState = null;
    const action = asyncPreloadProcess.fulfilled(userJohn, 'request-id');

    // action
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toEqual(userJohn);
  });

  it('harus mengembalikan null ketika diberi action asyncPreloadProcess/rejected', () => {
    // arrange
    const initialState = userJohn;
    const action = asyncPreloadProcess.rejected(
      new Error('token kedaluwarsa'),
      'request-id',
      undefined,
      'Token tidak valid.',
    );

    // action
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });
});
