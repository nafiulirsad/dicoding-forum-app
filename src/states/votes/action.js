import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

/**
 * Vote pada thread. Perubahan state diterapkan lebih dulu (optimistic)
 * pada tahap `pending`, lalu dikembalikan ke posisi semula bila request gagal.
 */
export const asyncToggleVoteThread = createAsyncThunk(
  'votes/toggleVoteThread',
  async ({ threadId, voteType }, { rejectWithValue }) => {
    try {
      await api.toggleVoteThread({ threadId, voteType });
      return { threadId, voteType };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const asyncToggleVoteComment = createAsyncThunk(
  'votes/toggleVoteComment',
  async ({ threadId, commentId, voteType }, { rejectWithValue }) => {
    try {
      await api.toggleVoteComment({ threadId, commentId, voteType });
      return { threadId, commentId, voteType };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
