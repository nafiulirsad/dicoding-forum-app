import PropTypes from 'prop-types';

function EmptyState({ title, description = '', children = null }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">💬</span>
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__description">{description}</p>}
      {children}
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default EmptyState;
