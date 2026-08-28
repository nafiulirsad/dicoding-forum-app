import { createSlice } from '@reduxjs/toolkit';
import { asyncCreateThread, asyncReceiveThreads } from './action';
import { asyncPopulateUsersAndThreads } from '../shared/action';
import { asyncToggleVoteThread } from '../votes/action';
import applyVote from '../votes/applyVote';

const initialState = {
  items: [],
  category: '',
};

function voteOnThread(state, { threadId, userId, voteType }) {
  const thread = state.items.find((item) => item.id === threadId);
  applyVote(thread, userId, voteType);
}

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setCategoryFilter: (state, action) => {
      state.category = action.payload;
    },
    clearCategoryFilter: (state) => {
      state.category = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncReceiveThreads.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(asyncPopulateUsersAndThreads.fulfilled, (state, action) => {
        state.items = action.payload.threads;
      })
      .addCase(asyncCreateThread.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(asyncToggleVoteThread.pending, (state, action) => {
        const { threadId, userId, voteType } = action.meta.arg;
        voteOnThread(state, { threadId, userId, voteType });
      })
      .addCase(asyncToggleVoteThread.rejected, (state, action) => {
        const { threadId, userId, previousVoteType } = action.meta.arg;
        voteOnThread(state, { threadId, userId, voteType: previousVoteType });
      });
  },
});

export const { setCategoryFilter, clearCategoryFilter } = threadsSlice.actions;

export default threadsSlice.reducer;
