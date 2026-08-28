import { createSlice } from '@reduxjs/toolkit';
import { asyncReceiveUsers } from './action';
import { asyncPopulateUsersAndThreads } from '../shared/action';
import { asyncRegisterUser } from '../authUser/action';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncReceiveUsers.fulfilled, (state, action) => action.payload)
      .addCase(asyncPopulateUsersAndThreads.fulfilled, (state, action) => action.payload.users)
      .addCase(asyncRegisterUser.fulfilled, (state, action) => [...state, action.payload]);
  },
});

export default usersSlice.reducer;
