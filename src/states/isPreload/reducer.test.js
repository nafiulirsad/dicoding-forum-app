/**
 * Skenario pengujian
 *
 * - isPreload reducer
 *   - harus mengembalikan state awal true ketika diberi action yang tidak dikenal
 *   - harus mengembalikan false ketika diberi action asyncPreloadProcess/fulfilled
 *   - harus mengembalikan false ketika diberi action asyncPreloadProcess/rejected
 *   - harus tetap true selama action asyncPreloadProcess/pending berlangsung
 */

import { describe, expect, it } from 'vitest';
import isPreloadReducer from './reducer';
import { asyncPreloadProcess } from '../authUser/action';
import { userJohn } from '../../tests/fixtures';

describe('isPreload reducer', () => {
  it('harus mengembalikan state awal true ketika diberi action yang tidak dikenal', () => {
    // arrange
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = isPreloadReducer(undefined, action);

    // assert
    expect(nextState).toBe(true);
  });

  it('harus mengembalikan false ketika diberi action asyncPreloadProcess/fulfilled', () => {
    // arrange
    const action = asyncPreloadProcess.fulfilled(userJohn, 'request-id');

    // action
    const nextState = isPreloadReducer(true, action);

    // assert
    expect(nextState).toBe(false);
  });

  it('harus mengembalikan false ketika diberi action asyncPreloadProcess/rejected', () => {
    // arrange
    const action = asyncPreloadProcess.rejected(
      new Error('gagal'),
      'request-id',
      undefined,
      'Token tidak valid.',
    );

    // action
    const nextState = isPreloadReducer(true, action);

    // assert
    expect(nextState).toBe(false);
  });

  it('harus tetap true selama action asyncPreloadProcess/pending berlangsung', () => {
    // arrange
    const action = asyncPreloadProcess.pending('request-id');

    // action
    const nextState = isPreloadReducer(true, action);

    // assert
    expect(nextState).toBe(true);
  });
});
