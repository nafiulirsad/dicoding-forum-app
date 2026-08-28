import PropTypes from 'prop-types';

function Avatar({ src = '', name, size = 'md' }) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;

  return (
    <img
      className={`avatar avatar--${size}`}
      src={src || fallback}
      alt={`Avatar ${name}`}
      title={name}
      loading="lazy"
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Avatar;
