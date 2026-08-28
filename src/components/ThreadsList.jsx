import PropTypes from 'prop-types';
import ThreadItem from './ThreadItem';
import EmptyState from './EmptyState';
import { threadShape } from '../utils/propTypes';

function ThreadsList({ threads, authUserId = null, onVote }) {
  if (threads.length === 0) {
    return (
      <EmptyState
        title="Belum ada diskusi di sini"
        description="Jadilah orang pertama yang memulai diskusi pada kategori ini."
      />
    );
  }

  return (
    <div className="threads-list">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          authUserId={authUserId}
          onVote={onVote}
        />
      ))}
    </div>
  );
}

ThreadsList.propTypes = {
  threads: PropTypes.arrayOf(threadShape).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default ThreadsList;
