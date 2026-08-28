import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

/**
 * Form pendaftaran akun baru. Validasi (wajib isi, format email,
 * panjang minimal kata sandi) dijalankan di sisi klien oleh React Hook Form
 * sebelum permintaan dikirim ke API.
 */
function RegisterInput({ onRegister }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '' },
  });

  const submit = ({ name, email, password }) => onRegister({
    name: name.trim(),
    email: email.trim(),
    password,
  });

  return (
    <form className="form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form__group">
        <label className="form__label" htmlFor="register-name">Nama lengkap</label>
        <input
          id="register-name"
          className="form__input"
          type="text"
          autoComplete="name"
          placeholder="Nama Anda"
          aria-invalid={errors.name ? 'true' : 'false'}
          {...register('name', {
            required: 'Nama wajib diisi.',
            minLength: { value: 3, message: 'Nama minimal 3 karakter.' },
          })}
        />
        {errors.name && <p className="form__error" role="alert">{errors.name.message}</p>}
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="register-email">Email</label>
        <input
          id="register-email"
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
        <label className="form__label" htmlFor="register-password">Kata sandi</label>
        <input
          id="register-password"
          className="form__input"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 6 karakter"
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
        {isSubmitting ? 'Memproses…' : 'Daftar Sekarang'}
      </button>
    </form>
  );
}

RegisterInput.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default RegisterInput;
