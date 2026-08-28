import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import RegisterInput from '../components/RegisterInput';
import { asyncLoginUser, asyncRegisterUser } from '../states/authUser/action';
import { setMessage } from '../states/ui/reducer';
import { selectAuthUser } from '../states/selectors';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = ({ name, email, password }) => {
    dispatch(asyncRegisterUser({ name, email, password }))
      .unwrap()
      .then(() => dispatch(asyncLoginUser({ email, password })).unwrap())
      .then(() => {
        dispatch(setMessage({ type: 'success', text: 'Pendaftaran berhasil. Selamat berdiskusi!' }));
        navigate('/', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Buat akun baru</h1>
        <p className="auth-card__subtitle">
          Satu akun untuk bertanya, menjawab, dan mengumpulkan skor komunitas.
        </p>
        <RegisterInput onRegister={handleRegister} />
        <p className="auth-card__footer">
          Sudah punya akun?
          {' '}
          <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
