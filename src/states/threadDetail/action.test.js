/**
 * Skenario pengujian
 *
 * - asyncReceiveThreadDetail thunk
 *   - harus memanggil API detail thread dengan id yang diberikan
 *   - harus men-dispatch action pending lalu fulfilled ketika permintaan berhasil
 *   - harus men-dispatch action rejected ketika thread tidak ditemukan
 * - asyncCreateComment thunk
 *   - harus mengirim threadId dan isi komentar ke API
 *   - harus men-dispatch action fulfilled beserta komentar baru
 *   - harus men-dispatch action rejected ketika pengguna belum terotentikasi
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../utils/api';
import { asyncCreateComment, asyncReceiveThreadDetail } from './action';
import { commentFirst, threadDetail } from '../../tests/fixtures';

vi.mock('../../utils/api', () => ({
  default: {
    getThreadDetail: vi.fn(),
    createComment: vi.fn(),
  },
}));

const getState = () => ({});

let dispatch;

beforeEach(() => {
  dispatch = vi.fn();
});

describe('asyncReceiveThreadDetail thunk', () => {
  it('harus memanggil API detail thread dengan id yang diberikan', async () => {
    // arrange
    api.getThreadDetail.mockResolvedValue(threadDetail);

    // action
    await asyncReceiveThreadDetail('thread-1')(dispatch, getState, undefined);

    // assert
    expect(api.getThreadDetail).toHaveBeenCalledWith('thread-1');
  });

  it('harus men-dispatch action pending lalu fulfilled ketika permintaan berhasil', async () => {
    // arrange
    api.getThreadDetail.mockResolvedValue(threadDetail);

    // action
    await asyncReceiveThreadDetail('thread-1')(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].type).toBe('threadDetail/receiveThreadDetail/pending');
    expect(dispatch.mock.calls[1][0].type).toBe('threadDetail/receiveThreadDetail/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual(threadDetail);
  });

  it('harus men-dispatch action rejected ketika thread tidak ditemukan', async () => {
    // arrange
    api.getThreadDetail.mockRejectedValue(new Error('thread tidak ditemukan'));

    // action
    await asyncReceiveThreadDetail('thread-404')(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('threadDetail/receiveThreadDetail/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('thread tidak ditemukan');
  });
});

describe('asyncCreateComment thunk', () => {
  it('harus mengirim threadId dan isi komentar ke API', async () => {
    // arrange
    api.createComment.mockResolvedValue(commentFirst);

    // action
    await asyncCreateComment({
      threadId: 'thread-1',
      content: commentFirst.content,
    })(dispatch, getState, undefined);

    // assert
    expect(api.createComment).toHaveBeenCalledWith({
      threadId: 'thread-1',
      content: commentFirst.content,
    });
  });

  it('harus men-dispatch action fulfilled beserta komentar baru', async () => {
    // arrange
    api.createComment.mockResolvedValue(commentFirst);

    // action
    await asyncCreateComment({
      threadId: 'thread-1',
      content: commentFirst.content,
    })(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[0][0].type).toBe('threadDetail/createComment/pending');
    expect(dispatch.mock.calls[1][0].type).toBe('threadDetail/createComment/fulfilled');
    expect(dispatch.mock.calls[1][0].payload).toEqual(commentFirst);
  });

  it('harus men-dispatch action rejected ketika pengguna belum terotentikasi', async () => {
    // arrange
    api.createComment.mockRejectedValue(new Error('Missing authentication'));

    // action
    await asyncCreateComment({
      threadId: 'thread-1',
      content: 'Halo',
    })(dispatch, getState, undefined);

    // assert
    expect(dispatch.mock.calls[1][0].type).toBe('threadDetail/createComment/rejected');
    expect(dispatch.mock.calls[1][0].payload).toBe('Missing authentication');
  });
});
