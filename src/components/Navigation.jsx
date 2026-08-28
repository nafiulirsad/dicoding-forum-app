import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import Avatar from './Avatar';
import { userShape } from '../utils/propTypes';

function Navigation({ authUser = null, onLogout }) {
  return (
    <header className="navigation">
      <div className="navigation__inner">
        <Link to="/" className="navigation__brand">
          <span className="navigation__logo" aria-hidden="true">🗣️</span>
          <span className="navigation__brand-text">Forum Diskusi</span>
        </Link>

        <nav className="navigation__menu" aria-label="Menu utama">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'navigation__link navigation__link--active' : 'navigation__link')} end>
            Beranda
          </NavLink>
          <NavLink to="/leaderboards" className={({ isActive }) => (isActive ? 'navigation__link navigation__link--active' : 'navigation__link')}>
            Leaderboard
          </NavLink>
        </nav>

        <div className="navigation__actions">
          {authUser ? (
            <>
              <Link to="/threads/new" className="button button--primary button--sm">
                Buat Diskusi
              </Link>
              <div className="navigation__profile">
                <Avatar src={authUser.avatar} name={authUser.name} size="sm" />
                <span className="navigation__username">{authUser.name}</span>
              </div>
              <button type="button" className="button button--ghost button--sm" onClick={onLogout}>
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="button button--ghost button--sm">Masuk</Link>
              <Link to="/register" className="button button--primary button--sm">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

Navigation.propTypes = {
  authUser: userShape,
  onLogout: PropTypes.func.isRequired,
};

export default Navigation;
