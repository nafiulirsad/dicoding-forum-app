/**
 * Skenario pengujian
 *
 * - stripHtml function
 *   - harus menghapus seluruh tag HTML dari teks
 *   - harus mengubah entitas &nbsp; menjadi spasi biasa
 * - truncate function
 *   - harus mengembalikan teks apa adanya ketika panjangnya masih di bawah batas
 *   - harus memotong teks dan menambahkan elipsis ketika melebihi batas
 * - mapThreadsWithOwner function
 *   - harus menyisipkan data pemilik ke dalam setiap thread
 *   - harus memakai data pemilik cadangan ketika pengguna tidak ditemukan
 * - getUniqueCategories function
 *   - harus mengembalikan kategori unik yang terurut
 *   - harus mengabaikan thread tanpa kategori
 * - getUserVoteType function
 *   - harus mengembalikan up-vote ketika id pengguna ada di dalam upVotesBy
 *   - harus mengembalikan down-vote ketika id pengguna ada di dalam downVotesBy
 *   - harus mengembalikan neutral-vote ketika pengguna belum masuk
 * - resolveVoteType function
 *   - harus mengembalikan neutral-vote ketika pengguna menekan tombol yang sama
 *   - harus mengembalikan jenis vote baru ketika pengguna menekan tombol berbeda
 */

import { describe, expect, it } from 'vitest';
import {
  getUniqueCategories,
  getUserVoteType,
  mapThreadsWithOwner,
  resolveVoteType,
  stripHtml,
  truncate,
} from './index';
import { rawThreads, userJohn, users } from '../tests/fixtures';

describe('stripHtml function', () => {
  it('harus menghapus seluruh tag HTML dari teks', () => {
    expect(stripHtml('<p>Halo <strong>dunia</strong></p>')).toBe('Halo dunia');
  });

  it('harus mengubah entitas &nbsp; menjadi spasi biasa', () => {
    expect(stripHtml('Halo&nbsp;dunia')).toBe('Halo dunia');
  });
});

describe('truncate function', () => {
  it('harus mengembalikan teks apa adanya ketika panjangnya masih di bawah batas', () => {
    expect(truncate('Teks pendek', 50)).toBe('Teks pendek');
  });

  it('harus memotong teks dan menambahkan elipsis ketika melebihi batas', () => {
    // arrange
    const text = 'a'.repeat(30);

    // action
    const result = truncate(text, 10);

    // assert
    expect(result).toBe(`${'a'.repeat(10)}…`);
  });
});

describe('mapThreadsWithOwner function', () => {
  it('harus menyisipkan data pemilik ke dalam setiap thread', () => {
    // action
    const result = mapThreadsWithOwner(rawThreads, users);

    // assert
    expect(result[0].owner).toEqual(userJohn);
    expect(result[1].owner.name).toBe('Jane Roe');
  });

  it('harus memakai data pemilik cadangan ketika pengguna tidak ditemukan', () => {
    // action
    const result = mapThreadsWithOwner([rawThreads[0]], []);

    // assert
    expect(result[0].owner.name).toBe('Pengguna');
    expect(result[0].owner.id).toBe(rawThreads[0].ownerId);
  });
});

describe('getUniqueCategories function', () => {
  it('harus mengembalikan kategori unik yang terurut', () => {
    // arrange
    const threads = [
      { category: 'redux' },
      { category: 'react' },
      { category: 'redux' },
    ];

    // action & assert
    expect(getUniqueCategories(threads)).toEqual(['react', 'redux']);
  });

  it('harus mengabaikan thread tanpa kategori', () => {
    // arrange
    const threads = [{ category: '' }, { category: 'react' }, {}];

    // action & assert
    expect(getUniqueCategories(threads)).toEqual(['react']);
  });
});

describe('getUserVoteType function', () => {
  it('harus mengembalikan up-vote ketika id pengguna ada di dalam upVotesBy', () => {
    const entity = { upVotesBy: ['users-1'], downVotesBy: [] };
    expect(getUserVoteType(entity, 'users-1')).toBe('up-vote');
  });

  it('harus mengembalikan down-vote ketika id pengguna ada di dalam downVotesBy', () => {
    const entity = { upVotesBy: [], downVotesBy: ['users-1'] };
    expect(getUserVoteType(entity, 'users-1')).toBe('down-vote');
  });

  it('harus mengembalikan neutral-vote ketika pengguna belum masuk', () => {
    const entity = { upVotesBy: ['users-1'], downVotesBy: [] };
    expect(getUserVoteType(entity, null)).toBe('neutral-vote');
  });
});

describe('resolveVoteType function', () => {
  it('harus mengembalikan neutral-vote ketika pengguna menekan tombol yang sama', () => {
    expect(resolveVoteType('up-vote', 'up-vote')).toBe('neutral-vote');
  });

  it('harus mengembalikan jenis vote baru ketika pengguna menekan tombol berbeda', () => {
    expect(resolveVoteType('up-vote', 'down-vote')).toBe('down-vote');
    expect(resolveVoteType('neutral-vote', 'up-vote')).toBe('up-vote');
  });
});
