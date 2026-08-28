import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LeaderboardList from '../components/LeaderboardList';
import Spinner from '../components/Spinner';
import { asyncReceiveLeaderboards } from '../states/leaderboards/action';
import { selectAuthUser, selectIsLoading, selectLeaderboards } from '../states/selectors';

function LeaderboardsPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector(selectLeaderboards);
  const authUser = useSelector(selectAuthUser);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  return (
    <div className="leaderboards-page">
      <div className="section-heading">
        <h1 className="section-heading__title">Klasemen pengguna aktif</h1>
      </div>
      <p className="page-description">
        Skor diperoleh dari aktivitas membuat diskusi, berkomentar, dan menerima vote.
      </p>

      {isLoading && leaderboards.length === 0
        ? <Spinner label="Memuat klasemen…" />
        : <LeaderboardList leaderboards={leaderboards} authUserId={authUser?.id} />}
    </div>
  );
}

export default LeaderboardsPage;
