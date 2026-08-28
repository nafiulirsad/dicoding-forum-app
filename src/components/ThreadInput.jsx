import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

/**
 * Form pembuatan diskusi baru. Tombol kirim tetap nonaktif selama judul
 * atau isi diskusi belum valid; status tersebut diambil dari `formState.isValid`
 * milik React Hook Form (mode `onChange`).
 */
function ThreadInput({ onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: { title: '', category: '', body: '' },
  });

  const submit = ({ title, category, body }) => {
    onSubmit({
      title: title.trim(),
      body: body.trim(),
      category: category.trim(),
    });
    reset();
  };

  return (
    <form className="form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form__group">
        <label className="form__label" htmlFor="thread-title">Judul diskusi</label>
        <input
          id="thread-title"
          className="form__input"
          type="text"
          placeholder="Contoh: Bagaimana cara mengelola state di React?"
          maxLength={120}
          aria-invalid={errors.title ? 'true' : 'false'}
          {...register('title', {
            required: 'Judul diskusi wajib diisi.',
            validate: (value) => value.trim() !== '' || 'Judul diskusi wajib diisi.',
          })}
        />
        {errors.title && <p className="form__error" role="alert">{errors.title.message}</p>}
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="thread-category">
          Kategori
          <span className="form__optional">(opsional)</span>
        </label>
        <input
          id="thread-category"
          className="form__input"
          type="text"
          placeholder="react, redux, javascript…"
          maxLength={30}
          {...register('category')}
        />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor="thread-body">Isi diskusi</label>
        <textarea
          id="thread-body"
          className="form__textarea"
          placeholder="Jelaskan pertanyaan atau ide Anda selengkap mungkin…"
          rows={10}
          aria-invalid={errors.body ? 'true' : 'false'}
          {...register('body', {
            required: 'Isi diskusi wajib diisi.',
            validate: (value) => value.trim() !== '' || 'Isi diskusi wajib diisi.',
          })}
        />
        {errors.body && <p className="form__error" role="alert">{errors.body.message}</p>}
      </div>

      <button
        type="submit"
        className="button button--primary button--block"
        disabled={!isValid || isSubmitting}
      >
        Publikasikan Diskusi
      </button>
    </form>
  );
}

ThreadInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ThreadInput;
