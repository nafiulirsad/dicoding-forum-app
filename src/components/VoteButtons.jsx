import PropTypes from 'prop-types';
import { getUserVoteType, resolveVoteType } from '../utils';

/**
 * Tombol up-vote & down-vote yang dipakai ulang pada thread maupun komentar.
 * Menekan tombol yang sedang aktif akan membatalkan vote (neutral-vote).
 */
function VoteButtons({ upVotesBy, downVotesBy, authUserId = null, onVote, size = 'md' }) {
  const currentVote = getUserVoteType({ upVotesBy, downVotesBy }, authUserId);

  const handleClick = (intent) => {
    onVote({
      voteType: resolveVoteType(currentVote, intent),
      previousVoteType: currentVote,
    });
  };

  return (
    <div className={`vote vote--${size}`}>
      <button
        type="button"
        className={`vote__button ${currentVote === 'up-vote' ? 'vote__button--up-active' : ''}`}
        onClick={() => handleClick('up-vote')}
        aria-pressed={currentVote === 'up-vote'}
        aria-label="Suka"
        title="Suka"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 4.5 4 12.5h4.5V19h7v-6.5H20z" />
        </svg>
        <span className="vote__count">{upVotesBy.length}</span>
      </button>

      <button
        type="button"
        className={`vote__button ${currentVote === 'down-vote' ? 'vote__button--down-active' : ''}`}
        onClick={() => handleClick('down-vote')}
        aria-pressed={currentVote === 'down-vote'}
        aria-label="Tidak suka"
        title="Tidak suka"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 19.5 20 11.5h-4.5V5h-7v6.5H4z" />
        </svg>
        <span className="vote__count">{downVotesBy.length}</span>
      </button>
    </div>
  );
}

VoteButtons.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md']),
};

export default VoteButtons;
