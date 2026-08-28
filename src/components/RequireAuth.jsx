import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Pembungkus route yang hanya boleh diakses pengguna terotentikasi.
 * Pengguna yang belum masuk diarahkan ke halaman login dan dikembalikan
 * ke halaman tujuan setelah berhasil masuk.
 */
function RequireAuth({ isAuthenticated, children }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

RequireAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
