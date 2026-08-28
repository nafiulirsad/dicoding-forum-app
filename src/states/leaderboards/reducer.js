import { createSlice } from '@reduxjs/toolkit';
import { asyncReceiveLeaderboards } from './action';

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncReceiveLeaderboards.fulfilled, (state, action) => action.payload);
  },
});

export default leaderboardsSlice.reducer;
