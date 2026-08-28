/**
 * Skenario pengujian
 *
 * - asyncLoginUser thunk
 *   - harus men-dispatch action login/pending lalu login/fulfilled ketika kredensial benar
 *   - harus menyimpan access token dan mengambil profil pengguna ketika login berhasil
 *   - harus men-dispatch action login/rejected dan menghapus token ketika login gagal
 * - asyncRegisterUser thunk
 *   - harus men-dispatch action register/fulfilled ketika pendaftaran berhasil
 *   - harus men-dispatch action register/rejected ketika email sudah dipakai
 * - asyncLogoutUser thunk
 *   - harus menghapus access token dan men-dispatch action logout/fulfilled
 * - asyncPreloadProcess thunk
 *   - harus mengembalikan null tanpa memanggil API ketika access token tidak tersedia
 *   - harus men-dispatch action preload/fulfilled ketika token masih berlaku
 *   - harus menghapus token dan men-dispatch action preload/rejected ketika token tidak berlaku
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../utils/api';
import {
  asyncLoginUser,
  asyncLogoutUser,
  asyncPreloadProcess,
  asyncRegisterUser,
} from './action';
import { userJohn } from '../../tests/fixtures';

vi.mock('../../utils/api', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    getOwnProfile: vi.fn(),
    putAccessToken: vi.fn(),
    getAccessToken: vi.fn(),
  },
}));

const credentials = { email: 'john@example.com', password: 'rahasia123' };
const getState = () => ({});

let dispatch;

beforeEach(() => {
  dispatch = vi.fn();
});

describe('asyncLoginUser thunk', () => {
  it('harus men-dispatch action login/pending lalu login/fulfilled ketika kredensial benar', async () => {
    // arrange
    api.login.mockResolvedValue('token-123');
    api.getOwnProfile.mockResolvedValue(userJohn);

    // action
    await asyncLoginUser(credentials)(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].type).toBe('authUser/login/pending');
    expect(dispatch.mock.calls[1][0].type).toBe('authUser/login/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual(userJohn);
  });

  it('harus menyimpan access token dan mengambil profil pengguna ketika login berhasil', async () => {
    // arrange
    api.login.mockResolvedValue('token-123');
    api.getOwnProfile.mockResolvedValue(userJohn);

    // action
    await asyncLoginUser(credentials)(dispatch, getState, undefined);

    // assert
    expect(api.login).toHaveBeenCalledWith(credentials);
    expect(api.putAccessToken).toHaveBeenCalledWith('token-123');
    expect(api.getOwnProfile).toHaveBeenCalledTimes(1);
  });

  it('harus men-dispatch action login/rejected dan menghapus token ketika login gagal', async () => {
    // arrange
    api.login.mockRejectedValue(new Error('email or password is wrong'));

    // action
    await asyncLoginUser(credentials)(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].type).toBe('authUser/login/pending');
    expect(dispatch.mock.calls[1][0].type).toBe('authUser/login/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('email or password is wrong');
    expect(api.putAccessToken).toHaveBeenCalledWith('');
    expect(api.getOwnProfile).not.toHaveBeenCalled();
  });
});

describe('asyncRegisterUser thunk', () => {
  it('harus men-dispatch action register/fulfilled ketika pendaftaran berhasil', async () => {
    // arrange
    const payload = { name: 'John Doe', email: 'john@example.com', password: 'rahasia123' };
    api.register.mockResolvedValue(userJohn);

    // action
    await asyncRegisterUser(payload)(dispatch, getState, undefined);

    // assert
    expect(api.register).toHaveBeenCalledWith(payload);
    expect(dispatch.mock.calls[1][0].type).toBe('authUser/register/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual(userJohn);
  });

  it('harus men-dispatch action register/rejected ketika email sudah dipakai', async () => {
    // arrange
    api.register.mockRejectedValue(new Error('email is already taken'));

    // action
    await asyncRegisterUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'rahasia123',
    })(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('authUser/register/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('email is already taken');
  });
});

describe('asyncLogoutUser thunk', () => {
  it('harus menghapus access token dan men-dispatch action logout/fulfilled', async () => {
    // arrange & action
    await asyncLogoutUser()(dispatch, getState, undefined);

    // assert
    expect(api.putAccessToken).toHaveBeenCalledWith('');
    expect(dispatch.mock.calls[1][0].type).toBe('authUser/logout/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toBeNull();
  });
});

describe('asyncPreloadProcess thunk', () => {
  it('harus mengembalikan null tanpa memanggil API ketika access token tidak tersedia', async () => {
    // arrange
    api.getAccessToken.mockReturnValue(null);

    // action
    await asyncPreloadProcess()(dispatch, getState, undefined);

    // assert
    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(dispatch.mock.calls[1][0].type).toBe('authUser/preload/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toBeNull();
  });

  it('harus men-dispatch action preload/fulfilled ketika token masih berlaku', async () => {
    // arrange
    api.getAccessToken.mockReturnValue('token-123');
    api.getOwnProfile.mockResolvedValue(userJohn);

    // action
    await asyncPreloadProcess()(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('authUser/preload/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual(userJohn);
  });

  it('harus menghapus token dan men-dispatch action preload/rejected ketika token tidak berlaku', async () => {
    // arrange
    api.getAccessToken.mockReturnValue('token-kedaluwarsa');
    api.getOwnProfile.mockRejectedValue(new Error('token maximum age exceeded'));

    // action
    await asyncPreloadProcess()(dispatch, getState, undefined);

    // assert
    expect(api.putAccessToken).toHaveBeenCalledWith('');
    expect(dispatch.mock.calls[1][0].type).toBe('authUser/preload/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('token maximum age exceeded');
  });
});
