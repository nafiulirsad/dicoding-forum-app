import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const asyncReceiveUsers = createAsyncThunk(
  'users/receiveUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getAllUsers();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
