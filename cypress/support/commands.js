/**
 * Custom command Cypress untuk aplikasi Forum Diskusi.
 *
 * Seluruh permintaan ke Dicoding Forum API di-stub agar pengujian
 * end-to-end bersifat deterministik: hasilnya tidak bergantung pada
 * ketersediaan jaringan maupun data pengguna sungguhan di server.
 */

const API = 'https://forum-api.dicoding.dev/v1';

export const dummyUser = {
  id: 'users-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff',
};

/** Menyiapkan stub untuk endpoint yang dipakai halaman beranda. */
Cypress.Commands.add('stubForumApi', () => {
  cy.intercept('GET', `${API}/users`, {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { users: [dummyUser] } },
  }).as('getUsers');

  cy.intercept('GET', `${API}/threads`, {
    statusCode: 200,
    body: {
      status: 'success',
      message: 'ok',
      data: {
        threads: [
          {
            id: 'thread-1',
            title: 'Bagaimana cara mengelola state di React?',
            body: 'Saya bingung memilih antara Context API dan Redux Toolkit.',
            category: 'react',
            createdAt: '2026-08-20T07:19:09.775Z',
            ownerId: 'users-1',
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0,
          },
        ],
      },
    },
  }).as('getThreads');
});

/** Stub endpoint login yang berhasil beserta profil penggunanya. */
Cypress.Commands.add('stubLoginSuccess', () => {
  cy.intercept('POST', `${API}/login`, {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { token: 'token-uji-coba' } },
  }).as('postLogin');

  cy.intercept('GET', `${API}/users/me`, {
    statusCode: 200,
    body: { status: 'success', message: 'ok', data: { user: dummyUser } },
  }).as('getOwnProfile');
});

/** Stub endpoint login yang gagal karena kredensial salah. */
Cypress.Commands.add('stubLoginFailed', () => {
  cy.intercept('POST', `${API}/login`, {
    statusCode: 401,
    body: { status: 'fail', message: 'email or password is wrong', data: null },
  }).as('postLoginFailed');
});

/** Melakukan proses login lewat antarmuka pengguna. */
Cypress.Commands.add('loginViaUi', (email = dummyUser.email, password = 'rahasia123') => {
  cy.visit('/login');
  cy.get('#login-email').type(email);
  cy.get('#login-password').type(password);
  cy.get('button[type="submit"]').click();
});
