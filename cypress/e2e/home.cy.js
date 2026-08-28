/**
 * Skenario pengujian end-to-end: Beranda & Filter Kategori
 *
 * - Halaman beranda
 *   - harus menampilkan hero, daftar diskusi, dan jumlah diskusi
 *   - harus menampilkan filter kategori sesuai kategori thread yang tersedia
 *   - harus membuka halaman detail ketika judul diskusi ditekan
 *   - harus mengarahkan pengguna yang belum masuk ke halaman login ketika menekan tombol suka
 *   - harus membuka halaman leaderboard dari menu navigasi
 */

describe('Beranda & Filter Kategori', () => {
  beforeEach(() => {
    cy.stubForumApi();
    cy.visit('/');
    cy.wait(['@getUsers', '@getThreads']);
  });

  it('harus menampilkan hero, daftar diskusi, dan jumlah diskusi', () => {
    cy.contains('h1', 'Ruang diskusi para pembelajar').should('be.visible');
    cy.contains('Bagaimana cara mengelola state di React?').should('be.visible');
    cy.contains('1 diskusi').should('be.visible');
  });

  it('harus menampilkan filter kategori sesuai kategori thread yang tersedia', () => {
    cy.contains('button', 'Semua').should('be.visible');
    cy.contains('button', '#react').should('be.visible').click();
    cy.contains('h2', 'Diskusi #react').should('be.visible');
  });

  it('harus membuka halaman detail ketika judul diskusi ditekan', () => {
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads/thread-1', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          detailThread: {
            id: 'thread-1',
            title: 'Bagaimana cara mengelola state di React?',
            body: 'Saya bingung memilih antara Context API dan Redux Toolkit.',
            category: 'react',
            createdAt: '2026-08-20T07:19:09.775Z',
            owner: {
              id: 'users-1',
              name: 'John Doe',
              avatar: 'https://ui-avatars.com/api/?name=John+Doe',
            },
            upVotesBy: [],
            downVotesBy: [],
            comments: [],
          },
        },
      },
    }).as('getThreadDetail');

    cy.contains('a', 'Bagaimana cara mengelola state di React?').click();

    cy.wait('@getThreadDetail');
    cy.location('pathname').should('eq', '/threads/thread-1');
    cy.contains('Belum ada komentar. Jadilah yang pertama berkomentar.').should('be.visible');
    cy.contains('Masuk').should('be.visible');
  });

  it('harus mengarahkan pengguna yang belum masuk ke halaman login ketika menekan tombol suka', () => {
    cy.get('button[aria-label="Suka"]').first().click();

    cy.location('pathname').should('eq', '/login');
  });

  it('harus membuka halaman leaderboard dari menu navigasi', () => {
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/leaderboards', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          leaderboards: [
            {
              user: {
                id: 'users-1',
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe',
              },
              score: 35,
            },
          ],
        },
      },
    }).as('getLeaderboards');

    cy.contains('a', 'Leaderboard').click();

    cy.wait('@getLeaderboards');
    cy.location('pathname').should('eq', '/leaderboards');
    cy.contains('Klasemen pengguna aktif').should('be.visible');
    cy.contains('35').should('be.visible');
  });
});
