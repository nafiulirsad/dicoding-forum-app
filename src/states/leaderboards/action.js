import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const asyncReceiveLeaderboards = createAsyncThunk(
  'leaderboards/receiveLeaderboards',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getLeaderboards();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
