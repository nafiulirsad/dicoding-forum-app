import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

/**
 * Form masuk. Pengelolaan state dan validasi form ditangani oleh
 * React Hook Form sehingga komponen ini bebas dari state lokal manual
 * dan hanya melakukan render ulang pada field yang berubah.
 */
function LoginInput({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const submit = ({ email, password }) => onLogin({ email: email.trim(), password });

  return (
    <form className="form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form__group">
        <label className="form__label" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className="form__input"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          aria-invalid={errors.email ? 'true' : 'false'}
          {...register('email', {
            required: 'Email wajib diisi.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Format email tidak valid.',
            },
          })}
        />
        {errors.email && <p className="form__error" role="alert">{errors.email.message}</p>}
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="login-password">Kata sandi</label>
        <input
          id="login-password"
          className="form__input"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={errors.password ? 'true' : 'false'}
          {...register('password', {
            required: 'Kata sandi wajib diisi.',
            minLength: { value: 6, message: 'Kata sandi minimal 6 karakter.' },
          })}
        />
        {errors.password && <p className="form__error" role="alert">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        className="button button--primary button--block"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Memproses…' : 'Masuk'}
      </button>
    </form>
  );
}

LoginInput.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginInput;
