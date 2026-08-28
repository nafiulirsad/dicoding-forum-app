import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ThreadDetailCard from '../components/ThreadDetailCard';
import CommentsList from '../components/CommentsList';
import CommentInput from '../components/CommentInput';
import Spinner from '../components/Spinner';
import { asyncCreateComment, asyncReceiveThreadDetail } from '../states/threadDetail/action';
import { asyncToggleVoteComment, asyncToggleVoteThread } from '../states/votes/action';
import { setMessage } from '../states/ui/reducer';
import { selectAuthUser, selectIsLoading, selectThreadDetail } from '../states/selectors';

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const threadDetail = useSelector(selectThreadDetail);
  const authUser = useSelector(selectAuthUser);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(id));
  }, [dispatch, id]);

  const requireAuth = () => {
    dispatch(setMessage({ type: 'info', text: 'Masuk terlebih dahulu untuk berinteraksi.' }));
    navigate('/login');
  };

  const handleVoteThread = ({ threadId, voteType, previousVoteType }) => {
    if (!authUser) {
      requireAuth();
      return;
    }

    dispatch(asyncToggleVoteThread({
      threadId, voteType, previousVoteType, userId: authUser.id,
    }));
  };

  const handleVoteComment = ({ commentId, voteType, previousVoteType }) => {
    if (!authUser) {
      requireAuth();
      return;
    }

    dispatch(asyncToggleVoteComment({
      threadId: id, commentId, voteType, previousVoteType, userId: authUser.id,
    }));
  };

  const handleCreateComment = (content) => {
    dispatch(asyncCreateComment({ threadId: id, content }))
      .unwrap()
      .then(() => dispatch(setMessage({ type: 'success', text: 'Komentar berhasil dikirim.' })))
      .catch(() => {});
  };

  if (!threadDetail) {
    return isLoading
      ? <Spinner label="Memuat diskusi…" />
      : <p className="page-message">Diskusi tidak ditemukan.</p>;
  }

  return (
    <div className="detail-page">
      <button type="button" className="button button--ghost button--sm" onClick={() => navigate(-1)}>
        ← Kembali
      </button>

      <ThreadDetailCard
        threadDetail={threadDetail}
        authUserId={authUser?.id}
        onVote={handleVoteThread}
      />

      <CommentInput isAuthenticated={Boolean(authUser)} onSubmit={handleCreateComment} />

      <CommentsList
        comments={threadDetail.comments}
        authUserId={authUser?.id}
        onVote={handleVoteComment}
      />
    </div>
  );
}

export default DetailPage;
