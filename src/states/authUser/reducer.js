import { createSlice } from '@reduxjs/toolkit';
import {
  asyncLoginUser,
  asyncLogoutUser,
  asyncPreloadProcess,
} from './action';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: null,
  reducers: {
    setAuthUser: (state, action) => action.payload,
    unsetAuthUser: () => null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncLoginUser.fulfilled, (state, action) => action.payload)
      .addCase(asyncLogoutUser.fulfilled, () => null)
      .addCase(asyncPreloadProcess.fulfilled, (state, action) => action.payload)
      .addCase(asyncPreloadProcess.rejected, () => null);
  },
});

export const { setAuthUser, unsetAuthUser } = authUserSlice.actions;

export default authUserSlice.reducer;
