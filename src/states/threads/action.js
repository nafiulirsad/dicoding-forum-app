import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const asyncReceiveThreads = createAsyncThunk(
  'threads/receiveThreads',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getAllThreads();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const asyncCreateThread = createAsyncThunk(
  'threads/createThread',
  async ({ title, body, category }, { rejectWithValue }) => {
    try {
      return await api.createThread({ title, body, category });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
