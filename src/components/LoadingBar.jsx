import PropTypes from 'prop-types';

/**
 * Indikator loading global yang tampil di bagian atas halaman
 * setiap kali aplikasi sedang memuat data dari API.
 */
function LoadingBar({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="loading-bar" role="progressbar" aria-label="Memuat data" aria-busy="true">
      <div className="loading-bar__indicator" />
    </div>
  );
}

LoadingBar.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default LoadingBar;
