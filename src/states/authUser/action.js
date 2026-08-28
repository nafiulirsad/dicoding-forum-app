import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const asyncRegisterUser = createAsyncThunk(
  'authUser/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      return await api.register({ name, email, password });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const asyncLoginUser = createAsyncThunk(
  'authUser/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const token = await api.login({ email, password });
      api.putAccessToken(token);
      return await api.getOwnProfile();
    } catch (error) {
      api.putAccessToken('');
      return rejectWithValue(error.message);
    }
  },
);

export const asyncLogoutUser = createAsyncThunk('authUser/logout', async () => {
  api.putAccessToken('');
  return null;
});

export const asyncPreloadProcess = createAsyncThunk(
  'authUser/preload',
  async (_, { rejectWithValue }) => {
    if (!api.getAccessToken()) {
      return null;
    }

    try {
      return await api.getOwnProfile();
    } catch (error) {
      api.putAccessToken('');
      return rejectWithValue(error.message);
    }
  },
);
