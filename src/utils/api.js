/**
 * Lapisan akses data (network layer) ke Dicoding Forum API.
 * Modul ini sengaja dipisahkan dari React agar komponen UI tidak pernah
 * berurusan langsung dengan REST API. Seluruh pemanggilannya dilakukan
 * dari action (thunk) pada folder `states`.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://forum-api.dicoding.dev/v1';
const ACCESS_TOKEN_KEY = 'forum-app/accessToken';

function putAccessToken(token) {
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Gagal menyimpan access token:', error);
  }
}

function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Gagal membaca access token:', error);
    return null;
  }
}

async function request(endpoint, options = {}, { withAuth = false } = {}) {
  const headers = { ...options.headers };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (withAuth) {
    headers.Authorization = `Bearer ${getAccessToken()}`;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
  }

  let responseJson;

  try {
    responseJson = await response.json();
  } catch {
    throw new Error('Respons dari server tidak dapat dibaca.');
  }

  if (responseJson.status !== 'success') {
    throw new Error(responseJson.message ?? 'Terjadi kesalahan pada server.');
  }

  return responseJson.data;
}

async function register({ name, email, password }) {
  const { user } = await request('/register', {
    method: 'POST',
    body: { name, email, password },
  });

  return user;
}

async function login({ email, password }) {
  const { token } = await request('/login', {
    method: 'POST',
    body: { email, password },
  });

  return token;
}

async function getOwnProfile() {
  const { user } = await request('/users/me', { method: 'GET' }, { withAuth: true });
  return user;
}

async function getAllUsers() {
  const { users } = await request('/users', { method: 'GET' });
  return users;
}

async function getAllThreads() {
  const { threads } = await request('/threads', { method: 'GET' });
  return threads;
}

async function getThreadDetail(threadId) {
  const { detailThread } = await request(`/threads/${threadId}`, { method: 'GET' });
  return detailThread;
}

async function createThread({ title, body, category }) {
  const { thread } = await request(
    '/threads',
    { method: 'POST', body: { title, body, category } },
    { withAuth: true },
  );

  return thread;
}

async function createComment({ threadId, content }) {
  const { comment } = await request(
    `/threads/${threadId}/comments`,
    { method: 'POST', body: { content } },
    { withAuth: true },
  );

  return comment;
}

async function getLeaderboards() {
  const { leaderboards } = await request('/leaderboards', { method: 'GET' });
  return leaderboards;
}

async function toggleVoteThread({ threadId, voteType }) {
  const { vote } = await request(
    `/threads/${threadId}/${voteType}`,
    { method: 'POST' },
    { withAuth: true },
  );

  return vote;
}

async function toggleVoteComment({ threadId, commentId, voteType }) {
  const { vote } = await request(
    `/threads/${threadId}/comments/${commentId}/${voteType}`,
    { method: 'POST' },
    { withAuth: true },
  );

  return vote;
}

const api = {
  putAccessToken,
  getAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  getThreadDetail,
  createThread,
  createComment,
  getLeaderboards,
  toggleVoteThread,
  toggleVoteComment,
};

export default api;
