import { useEffect } from 'react';
import PropTypes from 'prop-types';

function Toast({ message = null, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;

    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`toast toast--${message.type}`} role="alert">
      <p className="toast__text">{message.text}</p>
      <button
        type="button"
        className="toast__close"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
      >
        ×
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
    text: PropTypes.string.isRequired,
  }),
  onDismiss: PropTypes.func.isRequired,
};

export default Toast;
