/**
 * Skenario pengujian
 *
 * - asyncPopulateUsersAndThreads thunk
 *   - harus men-dispatch action pending lalu fulfilled ketika kedua permintaan berhasil
 *   - harus mengambil daftar pengguna dan thread secara paralel
 *   - harus men-dispatch action rejected ketika permintaan daftar thread gagal
 *   - harus men-dispatch action rejected ketika permintaan daftar pengguna gagal
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../utils/api';
import { asyncPopulateUsersAndThreads } from './action';
import { rawThreads, users } from '../../tests/fixtures';

vi.mock('../../utils/api', () => ({
  default: {
    getAllUsers: vi.fn(),
    getAllThreads: vi.fn(),
  },
}));

const getState = () => ({});

let dispatch;

beforeEach(() => {
  dispatch = vi.fn();
});

describe('asyncPopulateUsersAndThreads thunk', () => {
  it('harus men-dispatch action pending lalu fulfilled ketika kedua permintaan berhasil', async () => {
    // arrange
    api.getAllUsers.mockResolvedValue(users);
    api.getAllThreads.mockResolvedValue(rawThreads);

    // action
    await asyncPopulateUsersAndThreads()(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].type).toBe('shared/populateUsersAndThreads/pending');
    expect(dispatch.mock.calls[1][0].type).toBe('shared/populateUsersAndThreads/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual({ users, threads: rawThreads });
  });

  it('harus mengambil daftar pengguna dan thread secara paralel', async () => {
    // arrange
    api.getAllUsers.mockResolvedValue(users);
    api.getAllThreads.mockResolvedValue(rawThreads);

    // action
    await asyncPopulateUsersAndThreads()(dispatch, getState, undefined);

    // assert
    expect(api.getAllUsers).toHaveBeenCalledTimes(1);
    expect(api.getAllThreads).toHaveBeenCalledTimes(1);
  });

  it('harus men-dispatch action rejected ketika permintaan daftar thread gagal', async () => {
    // arrange
    api.getAllUsers.mockResolvedValue(users);
    api.getAllThreads.mockRejectedValue(new Error('Gagal memuat daftar diskusi.'));

    // action
    await asyncPopulateUsersAndThreads()(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('shared/populateUsersAndThreads/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('Gagal memuat daftar diskusi.');
  });

  it('harus men-dispatch action rejected ketika permintaan daftar pengguna gagal', async () => {
    // arrange
    api.getAllUsers.mockRejectedValue(new Error('Gagal memuat daftar pengguna.'));
    api.getAllThreads.mockResolvedValue(rawThreads);

    // action
    await asyncPopulateUsersAndThreads()(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('shared/populateUsersAndThreads/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('Gagal memuat daftar pengguna.');
  });
});
