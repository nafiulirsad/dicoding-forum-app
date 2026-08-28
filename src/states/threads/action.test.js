/**
 * Skenario pengujian
 *
 * - asyncReceiveThreads thunk
 *   - harus men-dispatch action pending lalu fulfilled ketika permintaan berhasil
 *   - harus men-dispatch action rejected ketika permintaan gagal
 * - asyncCreateThread thunk
 *   - harus meneruskan judul, isi, dan kategori ke API
 *   - harus men-dispatch action pending lalu fulfilled beserta thread baru
 *   - harus men-dispatch action rejected beserta pesan galat ketika permintaan gagal
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../utils/api';
import { asyncCreateThread, asyncReceiveThreads } from './action';
import { rawThreadReact, rawThreads } from '../../tests/fixtures';

vi.mock('../../utils/api', () => ({
  default: {
    getAllThreads: vi.fn(),
    createThread: vi.fn(),
  },
}));

const newThreadPayload = {
  title: rawThreadReact.title,
  body: rawThreadReact.body,
  category: rawThreadReact.category,
};

const getState = () => ({});

let dispatch;

beforeEach(() => {
  dispatch = vi.fn();
});

describe('asyncReceiveThreads thunk', () => {
  it('harus men-dispatch action pending lalu fulfilled ketika permintaan berhasil', async () => {
    // arrange
    api.getAllThreads.mockResolvedValue(rawThreads);

    // action
    await asyncReceiveThreads()(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].type).toBe('threads/receiveThreads/pending');
    expect(dispatch.mock.calls[1][0].type).toBe('threads/receiveThreads/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual(rawThreads);
  });

  it('harus men-dispatch action rejected ketika permintaan gagal', async () => {
    // arrange
    api.getAllThreads.mockRejectedValue(new Error('Tidak dapat terhubung ke server.'));

    // action
    await asyncReceiveThreads()(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('threads/receiveThreads/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('Tidak dapat terhubung ke server.');
  });
});

describe('asyncCreateThread thunk', () => {
  it('harus meneruskan judul, isi, dan kategori ke API', async () => {
    // arrange
    api.createThread.mockResolvedValue(rawThreadReact);

    // action
    await asyncCreateThread(newThreadPayload)(dispatch, getState, undefined);

    // assert
    expect(api.createThread).toHaveBeenCalledWith(newThreadPayload);
  });

  it('harus men-dispatch action pending lalu fulfilled beserta thread baru', async () => {
    // arrange
    api.createThread.mockResolvedValue(rawThreadReact);

    // action
    await asyncCreateThread(newThreadPayload)(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].type).toBe('threads/createThread/pending');
    expect(dispatch.mock.calls[1][0].type).toBe('threads/createThread/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual(rawThreadReact);
  });

  it('harus men-dispatch action rejected beserta pesan galat ketika permintaan gagal', async () => {
    // arrange
    api.createThread.mockRejectedValue(new Error('"title" is not allowed to be empty'));

    // action
    await asyncCreateThread({ title: '', body: '', category: '' })(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('threads/createThread/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('"title" is not allowed to be empty');
  });
});
