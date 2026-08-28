/**
 * Kumpulan data contoh (fixture) yang dipakai bersama oleh berkas pengujian
 * dan story Storybook. Bentuk datanya sengaja dibuat sama persis dengan
 * respons Dicoding Forum API agar pengujian tetap realistis.
 */

export const userJohn = {
  id: 'users-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
};

export const userJane = {
  id: 'users-2',
  name: 'Jane Roe',
  email: 'jane@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Jane+Roe&background=f43f5e&color=fff',
};

/** Thread mentah (`ownerId`, belum digabung dengan data pengguna). */
export const rawThreadReact = {
  id: 'thread-1',
  title: 'Bagaimana cara mengelola state di React?',
  body: 'Saya bingung memilih antara Context API dan Redux Toolkit.',
  category: 'react',
  createdAt: '2026-08-20T07:19:09.775Z',
  ownerId: 'users-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 2,
};

export const rawThreadRedux = {
  id: 'thread-2',
  title: 'Kapan sebaiknya memakai Redux Toolkit?',
  body: 'Apakah aplikasi kecil tetap butuh Redux?',
  category: 'redux',
  createdAt: '2026-08-21T07:19:09.775Z',
  ownerId: 'users-2',
  upVotesBy: ['users-1'],
  downVotesBy: [],
  totalComments: 0,
};

export const rawThreads = [rawThreadReact, rawThreadRedux];
export const users = [userJohn, userJane];

/** Thread yang sudah membawa data pemilik, siap dipakai komponen. */
export const threadWithOwner = {
  ...rawThreadReact,
  owner: userJohn,
};

export const commentFirst = {
  id: 'comment-1',
  content: 'Untuk aplikasi berskala besar, Redux Toolkit lebih terkelola.',
  createdAt: '2026-08-20T08:19:09.775Z',
  owner: userJane,
  upVotesBy: [],
  downVotesBy: [],
};

export const threadDetail = {
  id: 'thread-1',
  title: 'Bagaimana cara mengelola state di React?',
  body: 'Saya bingung memilih antara Context API dan Redux Toolkit.',
  category: 'react',
  createdAt: '2026-08-20T07:19:09.775Z',
  owner: userJohn,
  upVotesBy: [],
  downVotesBy: [],
  comments: [commentFirst],
};

export const leaderboards = [
  { user: userJohn, score: 35 },
  { user: userJane, score: 20 },
];
