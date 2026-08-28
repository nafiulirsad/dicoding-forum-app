import PropTypes from 'prop-types';

function Spinner({ label = 'Memuat data…' }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner__circle" />
      <p className="spinner__label">{label}</p>
    </div>
  );
}

Spinner.propTypes = {
  label: PropTypes.string,
};

export default Spinner;
