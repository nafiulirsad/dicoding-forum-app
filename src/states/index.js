import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './authUser/reducer';
import isPreloadReducer from './isPreload/reducer';
import usersReducer from './users/reducer';
import threadsReducer from './threads/reducer';
import threadDetailReducer from './threadDetail/reducer';
import leaderboardsReducer from './leaderboards/reducer';
import uiReducer from './ui/reducer';

export const rootReducer = {
  authUser: authUserReducer,
  isPreload: isPreloadReducer,
  users: usersReducer,
  threads: threadsReducer,
  threadDetail: threadDetailReducer,
  leaderboards: leaderboardsReducer,
  ui: uiReducer,
};

/**
 * Membuat instance store baru. Aplikasi memakai satu store global,
 * sedangkan pengujian integrasi membuat store baru pada setiap kasus uji
 * agar state tidak bocor antar-pengujian.
 *
 * @param {object} [preloadedState] state awal opsional
 */
export function createStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

const store = createStore();

export default store;
