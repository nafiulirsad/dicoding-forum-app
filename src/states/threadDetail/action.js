import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const asyncReceiveThreadDetail = createAsyncThunk(
  'threadDetail/receiveThreadDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      return await api.getThreadDetail(threadId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const asyncCreateComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      return await api.createComment({ threadId, content });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
