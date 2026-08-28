/**
 * Menerapkan perubahan vote pada sebuah entitas (thread atau komentar)
 * secara langsung. Dipakai untuk optimistic update maupun proses rollback.
 * Aman dipanggil di dalam reducer Redux Toolkit karena Immer menangani
 * pembuatan salinan state secara otomatis.
 *
 * @param {{ upVotesBy: Array<string>, downVotesBy: Array<string> }} entity
 * @param {string} userId
 * @param {'up-vote'|'down-vote'|'neutral-vote'} voteType
 */
export default function applyVote(entity, userId, voteType) {
  if (!entity || !userId) return;

  const upVotesBy = (entity.upVotesBy ?? []).filter((id) => id !== userId);
  const downVotesBy = (entity.downVotesBy ?? []).filter((id) => id !== userId);

  if (voteType === 'up-vote') upVotesBy.push(userId);
  if (voteType === 'down-vote') downVotesBy.push(userId);

  Object.assign(entity, { upVotesBy, downVotesBy });
}
