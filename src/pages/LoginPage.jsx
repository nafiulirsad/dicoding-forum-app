import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoginInput from '../components/LoginInput';
import { asyncLoginUser } from '../states/authUser/action';
import { setMessage } from '../states/ui/reducer';
import { selectAuthUser } from '../states/selectors';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useSelector(selectAuthUser);

  const redirectTo = location.state?.from ?? '/';

  if (authUser) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleLogin = ({ email, password }) => {
    dispatch(asyncLoginUser({ email, password }))
      .unwrap()
      .then((user) => {
        dispatch(setMessage({ type: 'success', text: `Selamat datang kembali, ${user.name}!` }));
        navigate(redirectTo, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Masuk ke akun Anda</h1>
        <p className="auth-card__subtitle">
          Gunakan akun Dicoding Forum API Anda untuk mulai berdiskusi.
        </p>
        <LoginInput onLogin={handleLogin} />
        <p className="auth-card__footer">
          Belum punya akun?
          {' '}
          <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
