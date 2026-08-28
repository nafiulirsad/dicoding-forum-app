import { createSlice } from '@reduxjs/toolkit';
import { asyncCreateComment, asyncReceiveThreadDetail } from './action';
import { asyncToggleVoteComment, asyncToggleVoteThread } from '../votes/action';
import applyVote from '../votes/applyVote';

function voteOnComment(state, { commentId, userId, voteType }) {
  const comment = state?.comments?.find((item) => item.id === commentId);
  applyVote(comment, userId, voteType);
}

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    clearThreadDetail: () => null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncReceiveThreadDetail.pending, () => null)
      .addCase(asyncReceiveThreadDetail.fulfilled, (state, action) => action.payload)
      .addCase(asyncReceiveThreadDetail.rejected, () => null)
      .addCase(asyncCreateComment.fulfilled, (state, action) => {
        state?.comments?.unshift(action.payload);
      })
      .addCase(asyncToggleVoteThread.pending, (state, action) => {
        const { threadId, userId, voteType } = action.meta.arg;
        if (state?.id === threadId) applyVote(state, userId, voteType);
      })
      .addCase(asyncToggleVoteThread.rejected, (state, action) => {
        const { threadId, userId, previousVoteType } = action.meta.arg;
        if (state?.id === threadId) applyVote(state, userId, previousVoteType);
      })
      .addCase(asyncToggleVoteComment.pending, (state, action) => {
        const { commentId, userId, voteType } = action.meta.arg;
        voteOnComment(state, { commentId, userId, voteType });
      })
      .addCase(asyncToggleVoteComment.rejected, (state, action) => {
        const { commentId, userId, previousVoteType } = action.meta.arg;
        voteOnComment(state, { commentId, userId, voteType: previousVoteType });
      });
  },
});

export const { clearThreadDetail } = threadDetailSlice.actions;

export default threadDetailSlice.reducer;
