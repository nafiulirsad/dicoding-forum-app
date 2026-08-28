import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loadingCount: 0,
  message: null,
};

/** Vote memakai optimistic update sehingga tidak perlu memicu loading bar. */
const isSilent = (type) => type.startsWith('votes/') || type.startsWith('authUser/preload');
const isPending = (type) => type.endsWith('/pending');
const isSettled = (type) => type.endsWith('/fulfilled') || type.endsWith('/rejected');

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => isPending(action.type) && !isSilent(action.type),
        (state) => {
          state.loadingCount += 1;
        },
      )
      .addMatcher(
        (action) => isSettled(action.type) && !isSilent(action.type),
        (state) => {
          state.loadingCount = Math.max(0, state.loadingCount - 1);
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && !action.type.startsWith('authUser/preload'),
        (state, action) => {
          state.message = {
            type: 'error',
            text: action.payload ?? action.error?.message ?? 'Terjadi kesalahan.',
          };
        },
      );
  },
});

export const { setMessage, clearMessage } = uiSlice.actions;

export default uiSlice.reducer;
