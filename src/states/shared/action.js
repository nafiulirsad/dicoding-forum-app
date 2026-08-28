import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

/**
 * Mengambil daftar pengguna dan daftar thread sekaligus. Daftar pengguna
 * dibutuhkan karena endpoint `/threads` hanya mengembalikan `ownerId`.
 */
export const asyncPopulateUsersAndThreads = createAsyncThunk(
  'shared/populateUsersAndThreads',
  async (_, { rejectWithValue }) => {
    try {
      const [users, threads] = await Promise.all([api.getAllUsers(), api.getAllThreads()]);
      return { users, threads };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
