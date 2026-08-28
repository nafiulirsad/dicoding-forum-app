/**
 * Skenario pengujian
 *
 * - leaderboards reducer
 *   - harus mengembalikan state awal ketika diberi action yang tidak dikenal
 *   - harus mengembalikan daftar klasemen ketika diberi action asyncReceiveLeaderboards/fulfilled
 *   - harus mengganti klasemen lama dengan klasemen terbaru
 *   - harus mempertahankan state ketika permintaan klasemen gagal
 */

import { describe, expect, it } from 'vitest';
import leaderboardsReducer from './reducer';
import { asyncReceiveLeaderboards } from './action';
import { leaderboards, userJane } from '../../tests/fixtures';

describe('leaderboards reducer', () => {
  it('harus mengembalikan state awal ketika diberi action yang tidak dikenal', () => {
    // arrange
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = leaderboardsReducer(undefined, action);

    // assert
    expect(nextState).toEqual([]);
  });

  it('harus mengembalikan daftar klasemen ketika diberi action asyncReceiveLeaderboards/fulfilled', () => {
    // arrange
    const action = asyncReceiveLeaderboards.fulfilled(leaderboards, 'request-id');

    // action
    const nextState = leaderboardsReducer([], action);

    // assert
    expect(nextState).toEqual(leaderboards);
  });

  it('harus mengganti klasemen lama dengan klasemen terbaru', () => {
    // arrange
    const previousState = leaderboards;
    const latest = [{ user: userJane, score: 99 }];
    const action = asyncReceiveLeaderboards.fulfilled(latest, 'request-id');

    // action
    const nextState = leaderboardsReducer(previousState, action);

    // assert
    expect(nextState).toEqual(latest);
  });

  it('harus mempertahankan state ketika permintaan klasemen gagal', () => {
    // arrange
    const action = asyncReceiveLeaderboards.rejected(
      new Error('gagal'),
      'request-id',
      undefined,
      'Gagal memuat klasemen.',
    );

    // action
    const nextState = leaderboardsReducer(leaderboards, action);

    // assert
    expect(nextState).toEqual(leaderboards);
  });
});
