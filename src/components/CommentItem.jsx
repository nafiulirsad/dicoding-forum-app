import PropTypes from 'prop-types';
import Avatar from './Avatar';
import VoteButtons from './VoteButtons';
import { showFormattedDate, stripHtml } from '../utils';
import { commentShape } from '../utils/propTypes';

function CommentItem({ comment, authUserId = null, onVote }) {
  const {
    id, content, createdAt, owner, upVotesBy, downVotesBy,
  } = comment;

  return (
    <article className="comment-item">
      <header className="comment-item__header">
        <Avatar src={owner.avatar} name={owner.name} size="sm" />
        <div className="comment-item__meta">
          <span className="comment-item__owner">{owner.name}</span>
          <span className="comment-item__time">{showFormattedDate(createdAt)}</span>
        </div>
      </header>

      <p className="comment-item__content">{stripHtml(content)}</p>

      <footer className="comment-item__footer">
        <VoteButtons
          upVotesBy={upVotesBy}
          downVotesBy={downVotesBy}
          authUserId={authUserId}
          onVote={({ voteType, previousVoteType }) => onVote({ commentId: id, voteType, previousVoteType })}
          size="sm"
        />
      </footer>
    </article>
  );
}

CommentItem.propTypes = {
  comment: commentShape.isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default CommentItem;
