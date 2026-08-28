/**
 * Skenario pengujian
 *
 * - LeaderboardList component
 *   - harus menampilkan seluruh pengguna beserta skornya
 *   - harus menampilkan peringkat sesuai urutan data yang diterima
 *   - harus menandai baris milik pengguna yang sedang masuk dengan label "Anda"
 *   - tidak boleh menampilkan label "Anda" ketika pengguna belum masuk
 *   - harus menampilkan daftar kosong ketika klasemen belum tersedia
 */

import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import LeaderboardList from './LeaderboardList';
import { leaderboards } from '../tests/fixtures';

describe('LeaderboardList component', () => {
  it('harus menampilkan seluruh pengguna beserta skornya', () => {
    // arrange
    render(<LeaderboardList leaderboards={leaderboards} authUserId={null} />);

    // action & assert
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Jane Roe')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('harus menampilkan peringkat sesuai urutan data yang diterima', () => {
    // arrange
    render(<LeaderboardList leaderboards={leaderboards} authUserId={null} />);

    // action
    const rows = screen.getAllByRole('listitem');

    // assert
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText('1')).toBeInTheDocument();
    expect(within(rows[1]).getByText('2')).toBeInTheDocument();
  });

  it('harus menandai baris milik pengguna yang sedang masuk dengan label "Anda"', () => {
    // arrange
    render(<LeaderboardList leaderboards={leaderboards} authUserId="users-2" />);

    // action
    const rows = screen.getAllByRole('listitem');

    // assert
    expect(within(rows[1]).getByText('Anda')).toBeInTheDocument();
    expect(within(rows[0]).queryByText('Anda')).not.toBeInTheDocument();
  });

  it('tidak boleh menampilkan label "Anda" ketika pengguna belum masuk', () => {
    // arrange
    render(<LeaderboardList leaderboards={leaderboards} authUserId={null} />);

    // action & assert
    expect(screen.queryByText('Anda')).not.toBeInTheDocument();
  });

  it('harus menampilkan daftar kosong ketika klasemen belum tersedia', () => {
    // arrange
    render(<LeaderboardList leaderboards={[]} authUserId={null} />);

    // action & assert
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
