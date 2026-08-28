import PropTypes from 'prop-types';
import Avatar from './Avatar';
import VoteButtons from './VoteButtons';
import { showFormattedDate, stripHtml } from '../utils';
import { threadDetailShape } from '../utils/propTypes';

function ThreadDetailCard({ threadDetail, authUserId = null, onVote }) {
  const {
    id, title, body, category, createdAt, owner, upVotesBy, downVotesBy, comments,
  } = threadDetail;

  return (
    <article className="thread-detail">
      {category && <span className="thread-detail__category">#{category}</span>}
      <h1 className="thread-detail__title">{title}</h1>

      <div className="thread-detail__owner">
        <Avatar src={owner.avatar} name={owner.name} size="md" />
        <div>
          <p className="thread-detail__owner-name">{owner.name}</p>
          <p className="thread-detail__time">{showFormattedDate(createdAt)}</p>
        </div>
      </div>

      <div className="thread-detail__body">
        <p>{stripHtml(body)}</p>
      </div>

      <footer className="thread-detail__footer">
        <VoteButtons
          upVotesBy={upVotesBy}
          downVotesBy={downVotesBy}
          authUserId={authUserId}
          onVote={({ voteType, previousVoteType }) => onVote({ threadId: id, voteType, previousVoteType })}
        />
        <span className="thread-detail__comment-count">
          {comments.length}
          {' '}
          komentar
        </span>
      </footer>
    </article>
  );
}

ThreadDetailCard.propTypes = {
  threadDetail: threadDetailShape.isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default ThreadDetailCard;
