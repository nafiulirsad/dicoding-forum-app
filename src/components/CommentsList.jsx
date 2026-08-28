import PropTypes from 'prop-types';
import CommentItem from './CommentItem';
import { commentShape } from '../utils/propTypes';

function CommentsList({ comments, authUserId = null, onVote }) {
  return (
    <section className="comments" aria-label="Daftar komentar">
      <h2 className="comments__title">
        Komentar (
        {comments.length}
        )
      </h2>

      {comments.length === 0 ? (
        <p className="comments__empty">Belum ada komentar. Jadilah yang pertama berkomentar.</p>
      ) : (
        <div className="comments__list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              authUserId={authUserId}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </section>
  );
}

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(commentShape).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default CommentsList;
