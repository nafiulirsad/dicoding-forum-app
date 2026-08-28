import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import LoadingBar from './components/LoadingBar';
import Toast from './components/Toast';
import Spinner from './components/Spinner';
import RequireAuth from './components/RequireAuth';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import AddThreadPage from './pages/AddThreadPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import { asyncLogoutUser, asyncPreloadProcess } from './states/authUser/action';
import { clearMessage, setMessage } from './states/ui/reducer';
import {
  selectAuthUser,
  selectIsLoading,
  selectIsPreload,
  selectMessage,
} from './states/selectors';

function App() {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const isPreload = useSelector(selectIsPreload);
  const isLoading = useSelector(selectIsLoading);
  const message = useSelector(selectMessage);

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(asyncLogoutUser());
    dispatch(setMessage({ type: 'success', text: 'Anda berhasil keluar.' }));
  }, [dispatch]);

  const handleDismissMessage = useCallback(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  if (isPreload) {
    return (
      <div className="app-preload">
        <Spinner label="Menyiapkan aplikasi…" />
      </div>
    );
  }

  return (
    <div className="app">
      <LoadingBar isLoading={isLoading} />
      <Navigation authUser={authUser} onLogout={handleLogout} />

      <main className="app__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/threads/:id" element={<DetailPage />} />
          <Route
            path="/threads/new"
            element={(
              <RequireAuth isAuthenticated={Boolean(authUser)}>
                <AddThreadPage />
              </RequireAuth>
            )}
          />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="app__footer">
        <p>
          Forum Diskusi · Dibangun dengan React &amp; Redux · Data dari Dicoding Forum API
        </p>
      </footer>

      <Toast message={message} onDismiss={handleDismissMessage} />
    </div>
  );
}

export default App;
