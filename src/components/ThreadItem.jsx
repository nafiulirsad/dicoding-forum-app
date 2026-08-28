import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import VoteButtons from './VoteButtons';
import { showFormattedDate, truncate } from '../utils';
import { threadShape } from '../utils/propTypes';

function ThreadItem({ thread, authUserId = null, onVote }) {
  const navigate = useNavigate();

  const {
    id, title, body, category, createdAt, totalComments, upVotesBy, downVotesBy, owner,
  } = thread;

  return (
    <article className="thread-item">
      <header className="thread-item__header">
        <Avatar src={owner.avatar} name={owner.name} size="sm" />
        <div className="thread-item__meta">
          <span className="thread-item__owner">{owner.name}</span>
          <span className="thread-item__time">{showFormattedDate(createdAt)}</span>
        </div>
        {category && <span className="thread-item__category">#{category}</span>}
      </header>

      <h2 className="thread-item__title">
        <Link to={`/threads/${id}`}>{title}</Link>
      </h2>

      <p className="thread-item__body">{truncate(body)}</p>

      <footer className="thread-item__footer">
        <VoteButtons
          upVotesBy={upVotesBy}
          downVotesBy={downVotesBy}
          authUserId={authUserId}
          onVote={({ voteType, previousVoteType }) => onVote({ threadId: id, voteType, previousVoteType })}
          size="sm"
        />
        <button
          type="button"
          className="thread-item__comments"
          onClick={() => navigate(`/threads/${id}`)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 4h16v11H8l-4 4z" />
          </svg>
          <span>
            {totalComments ?? 0}
            {' '}
            komentar
          </span>
        </button>
      </footer>
    </article>
  );
}

ThreadItem.propTypes = {
  thread: threadShape.isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default ThreadItem;
