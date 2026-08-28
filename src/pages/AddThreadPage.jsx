import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ThreadInput from '../components/ThreadInput';
import { asyncCreateThread } from '../states/threads/action';
import { setMessage } from '../states/ui/reducer';

function AddThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateThread = ({ title, body, category }) => {
    dispatch(asyncCreateThread({ title, body, category }))
      .unwrap()
      .then((thread) => {
        dispatch(setMessage({ type: 'success', text: 'Diskusi berhasil dibuat.' }));
        navigate(`/threads/${thread.id}`);
      })
      .catch(() => {});
  };

  return (
    <div className="add-thread-page">
      <div className="section-heading">
        <h1 className="section-heading__title">Buat diskusi baru</h1>
      </div>
      <p className="page-description">
        Tuliskan pertanyaan atau ide Anda dengan jelas agar mudah dipahami anggota lain.
      </p>
      <ThreadInput onSubmit={handleCreateThread} />
    </div>
  );
}

export default AddThreadPage;
