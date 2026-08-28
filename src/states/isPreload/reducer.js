import { createSlice } from '@reduxjs/toolkit';
import { asyncPreloadProcess } from '../authUser/action';

const isPreloadSlice = createSlice({
  name: 'isPreload',
  initialState: true,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncPreloadProcess.fulfilled, () => false)
      .addCase(asyncPreloadProcess.rejected, () => false);
  },
});

export default isPreloadSlice.reducer;
