import PropTypes from 'prop-types';
import LeaderboardItem from './LeaderboardItem';
import { leaderboardShape } from '../utils/propTypes';

function LeaderboardList({ leaderboards, authUserId = null }) {
  return (
    <section className="leaderboard" aria-label="Klasemen pengguna aktif">
      <header className="leaderboard__header">
        <span>Pengguna</span>
        <span>Skor</span>
      </header>
      <ol className="leaderboard__list">
        {leaderboards.map((leaderboard, index) => (
          <LeaderboardItem
            key={leaderboard.user.id}
            leaderboard={leaderboard}
            rank={index + 1}
            isCurrentUser={leaderboard.user.id === authUserId}
          />
        ))}
      </ol>
    </section>
  );
}

LeaderboardList.propTypes = {
  leaderboards: PropTypes.arrayOf(leaderboardShape).isRequired,
  authUserId: PropTypes.string,
};

export default LeaderboardList;
