import PropTypes from 'prop-types';
import Avatar from './Avatar';
import { leaderboardShape } from '../utils/propTypes';

function LeaderboardItem({ leaderboard, rank, isCurrentUser = false }) {
  const { user, score } = leaderboard;

  return (
    <li className={`leaderboard-item ${isCurrentUser ? 'leaderboard-item--me' : ''}`}>
      <span className={`leaderboard-item__rank leaderboard-item__rank--${rank <= 3 ? rank : 'other'}`}>
        {rank}
      </span>
      <Avatar src={user.avatar} name={user.name} size="sm" />
      <span className="leaderboard-item__name">
        {user.name}
        {isCurrentUser && <span className="leaderboard-item__badge">Anda</span>}
      </span>
      <span className="leaderboard-item__score">{score}</span>
    </li>
  );
}

LeaderboardItem.propTypes = {
  leaderboard: leaderboardShape.isRequired,
  rank: PropTypes.number.isRequired,
  isCurrentUser: PropTypes.bool,
};

export default LeaderboardItem;
