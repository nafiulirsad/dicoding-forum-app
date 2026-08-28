import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

/**
 * Form komentar pada halaman detail thread. Pengguna yang belum masuk
 * hanya melihat ajakan untuk login, bukan form isian.
 */
function CommentInput({ isAuthenticated, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: { content: '' },
  });

  const submit = ({ content }) => {
    onSubmit(content.trim());
    reset();
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-input comment-input--locked">
        <p>
          <Link to="/login">Masuk</Link>
          {' '}
          terlebih dahulu untuk ikut berkomentar pada diskusi ini.
        </p>
      </div>
    );
  }

  return (
    <form className="comment-input" onSubmit={handleSubmit(submit)} noValidate>
      <label className="form__label" htmlFor="comment-content">Beri komentar</label>
      <textarea
        id="comment-content"
        className="form__textarea"
        placeholder="Tulis tanggapan Anda…"
        rows={4}
        {...register('content', {
          required: true,
          validate: (value) => value.trim() !== '',
        })}
      />
      <button
        type="submit"
        className="button button--primary"
        disabled={!isValid || isSubmitting}
      >
        Kirim Komentar
      </button>
    </form>
  );
}

CommentInput.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CommentInput;
