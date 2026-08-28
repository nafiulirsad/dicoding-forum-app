/**
 * Skenario pengujian
 *
 * - users reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus mengembalikan daftar pengguna ketika diberi action asyncReceiveUsers/fulfilled
 *   - harus mengembalikan daftar pengguna ketika diberi action asyncPopulateUsersAndThreads/fulfilled
 *   - harus menambahkan pengguna baru ketika diberi action asyncRegisterUser/fulfilled
 */

import { describe, expect, it } from 'vitest';
import usersReducer from './reducer';
import { asyncReceiveUsers } from './action';
import { asyncPopulateUsersAndThreads } from '../shared/action';
import { asyncRegisterUser } from '../authUser/action';
import { rawThreads, userJane, userJohn, users } from '../../tests/fixtures';

describe('users reducer', () => {
  it('harus mengembalikan state awal ketika diberi action yang tidak dikenal', () => {
    // arrange
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = usersReducer(undefined, action);

    // assert
    expect(nextState).toEqual([]);
  });

  it('harus mengembalikan daftar pengguna ketika diberi action asyncReceiveUsers/fulfilled', () => {
    // arrange
    const action = asyncReceiveUsers.fulfilled(users, 'request-id');

    // action
    const nextState = usersReducer([], action);

    // assert
    expect(nextState).toEqual(users);
  });

  it('harus mengembalikan daftar pengguna ketika diberi action asyncPopulateUsersAndThreads/fulfilled', () => {
    // arrange
    const action = asyncPopulateUsersAndThreads.fulfilled(
      { users, threads: rawThreads },
      'request-id',
    );

    // action
    const nextState = usersReducer([], action);

    // assert
    expect(nextState).toEqual(users);
  });

  it('harus menambahkan pengguna baru ketika diberi action asyncRegisterUser/fulfilled', () => {
    // arrange
    const action = asyncRegisterUser.fulfilled(userJane, 'request-id', {
      name: userJane.name,
      email: userJane.email,
      password: 'rahasia123',
    });

    // action
    const nextState = usersReducer([userJohn], action);

    // assert
    expect(nextState).toEqual([userJohn, userJane]);
  });
});
