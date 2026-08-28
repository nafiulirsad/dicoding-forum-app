import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import ThreadsList from '../components/ThreadsList';
import Spinner from '../components/Spinner';
import { asyncPopulateUsersAndThreads } from '../states/shared/action';
import { asyncToggleVoteThread } from '../states/votes/action';
import { setCategoryFilter } from '../states/threads/reducer';
import { setMessage } from '../states/ui/reducer';
import {
  selectAuthUser,
  selectCategories,
  selectCategoryFilter,
  selectIsLoading,
  selectThreadItems,
  selectVisibleThreads,
} from '../states/selectors';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const threads = useSelector(selectVisibleThreads);
  const allThreads = useSelector(selectThreadItems);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectCategoryFilter);
  const authUser = useSelector(selectAuthUser);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  const handleVote = ({ threadId, voteType, previousVoteType }) => {
    if (!authUser) {
      dispatch(setMessage({ type: 'info', text: 'Masuk terlebih dahulu untuk memberi vote.' }));
      navigate('/login');
      return;
    }

    dispatch(asyncToggleVoteThread({
      threadId, voteType, previousVoteType, userId: authUser.id,
    }));
  };

  const isInitialLoading = isLoading && allThreads.length === 0;

  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="hero__title">Ruang diskusi para pembelajar</h1>
        <p className="hero__subtitle">
          Ajukan pertanyaan, bagikan pengalaman, dan temukan sudut pandang baru dari komunitas.
        </p>
        {authUser ? (
          <Link to="/threads/new" className="button button--primary">Mulai Diskusi Baru</Link>
        ) : (
          <Link to="/register" className="button button--primary">Gabung Sekarang</Link>
        )}
      </section>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={(category) => dispatch(setCategoryFilter(category))}
      />

      <section aria-label="Daftar diskusi">
        <div className="section-heading">
          <h2 className="section-heading__title">
            {selectedCategory ? `Diskusi #${selectedCategory}` : 'Diskusi terbaru'}
          </h2>
          <span className="section-heading__count">
            {threads.length}
            {' '}
            diskusi
          </span>
        </div>

        {isInitialLoading
          ? <Spinner label="Memuat diskusi…" />
          : (
            <ThreadsList
              threads={threads}
              authUserId={authUser?.id}
              onVote={handleVote}
            />
          )}
      </section>
    </div>
  );
}

export default HomePage;
