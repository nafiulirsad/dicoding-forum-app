import { createSelector } from '@reduxjs/toolkit';
import { getUniqueCategories, mapThreadsWithOwner } from '../utils';

export const selectAuthUser = (state) => state.authUser;
export const selectIsPreload = (state) => state.isPreload;
export const selectUsers = (state) => state.users;
export const selectThreadItems = (state) => state.threads.items;
export const selectCategoryFilter = (state) => state.threads.category;
export const selectThreadDetail = (state) => state.threadDetail;
export const selectLeaderboards = (state) => state.leaderboards;
export const selectIsLoading = (state) => state.ui.loadingCount > 0;
export const selectMessage = (state) => state.ui.message;

export const selectCategories = createSelector([selectThreadItems], getUniqueCategories);

export const selectThreadsWithOwner = createSelector(
  [selectThreadItems, selectUsers],
  mapThreadsWithOwner,
);

export const selectVisibleThreads = createSelector(
  [selectThreadsWithOwner, selectCategoryFilter],
  (threads, category) => (category ? threads.filter((thread) => thread.category === category) : threads),
);
