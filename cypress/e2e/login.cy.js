/**
 * Skenario pengujian end-to-end: Alur Login
 *
 * - Halaman login
 *   - harus menampilkan judul, input email, input kata sandi, dan tombol masuk
 *   - harus menampilkan pesan galat ketika form dikirim dalam keadaan kosong
 *   - harus menampilkan pesan galat ketika format email tidak valid
 *   - harus menampilkan pesan galat ketika kata sandi kurang dari 6 karakter
 *   - harus menampilkan notifikasi galat ketika kredensial salah
 *   - harus mengarahkan pengguna ke beranda dan menampilkan namanya ketika login berhasil
 *   - harus menampilkan tombol "Buat Diskusi" dan "Keluar" setelah pengguna masuk
 *   - harus mengembalikan pengguna ke keadaan belum masuk setelah menekan tombol "Keluar"
 *   - harus mengarahkan pengguna yang belum masuk ke halaman login ketika membuka halaman terproteksi
 */

describe('Alur Login', () => {
  beforeEach(() => {
    cy.stubForumApi();
    cy.visit('/login');
  });

  it('harus menampilkan judul, input email, input kata sandi, dan tombol masuk', () => {
    cy.contains('h1', 'Masuk ke akun Anda').should('be.visible');
    cy.get('#login-email').should('be.visible');
    cy.get('#login-password').should('be.visible');
    cy.get('button[type="submit"]').should('contain.text', 'Masuk');
  });

  it('harus menampilkan pesan galat ketika form dikirim dalam keadaan kosong', () => {
    cy.get('button[type="submit"]').click();

    cy.contains('Email wajib diisi.').should('be.visible');
    cy.contains('Kata sandi wajib diisi.').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('harus menampilkan pesan galat ketika format email tidak valid', () => {
    cy.get('#login-email').type('bukan-email');
    cy.get('#login-password').type('rahasia123');
    cy.get('button[type="submit"]').click();

    cy.contains('Format email tidak valid.').should('be.visible');
  });

  it('harus menampilkan pesan galat ketika kata sandi kurang dari 6 karakter', () => {
    cy.get('#login-email').type('john@example.com');
    cy.get('#login-password').type('123');
    cy.get('button[type="submit"]').click();

    cy.contains('Kata sandi minimal 6 karakter.').should('be.visible');
  });

  it('harus menampilkan notifikasi galat ketika kredensial salah', () => {
    cy.stubLoginFailed();

    cy.get('#login-email').type('john@example.com');
    cy.get('#login-password').type('kata-sandi-salah');
    cy.get('button[type="submit"]').click();

    cy.wait('@postLoginFailed');
    cy.get('[role="alert"]').should('contain.text', 'email or password is wrong');
    cy.url().should('include', '/login');
  });

  it('harus mengarahkan pengguna ke beranda dan menampilkan namanya ketika login berhasil', () => {
    cy.stubLoginSuccess();

    cy.get('#login-email').type('john@example.com');
    cy.get('#login-password').type('rahasia123');
    cy.get('button[type="submit"]').click();

    cy.wait('@postLogin');
    cy.wait('@getOwnProfile');

    cy.location('pathname').should('eq', '/');
    cy.get('.navigation__username').should('contain.text', 'John Doe');
    cy.contains('Ruang diskusi para pembelajar').should('be.visible');
  });

  it('harus menampilkan tombol "Buat Diskusi" dan "Keluar" setelah pengguna masuk', () => {
    cy.stubLoginSuccess();
    cy.loginViaUi();

    cy.wait('@getOwnProfile');
    cy.contains('a', 'Buat Diskusi').should('be.visible');
    cy.contains('button', 'Keluar').should('be.visible');
  });

  it('harus mengembalikan pengguna ke keadaan belum masuk setelah menekan tombol "Keluar"', () => {
    cy.stubLoginSuccess();
    cy.loginViaUi();

    cy.wait('@getOwnProfile');
    cy.contains('button', 'Keluar').click();

    cy.contains('a', 'Masuk').should('be.visible');
    cy.contains('a', 'Daftar').should('be.visible');
    cy.get('.navigation__username').should('not.exist');
  });

  it('harus mengarahkan pengguna yang belum masuk ke halaman login ketika membuka halaman terproteksi', () => {
    cy.visit('/threads/new');

    cy.location('pathname').should('eq', '/login');
    cy.contains('h1', 'Masuk ke akun Anda').should('be.visible');
  });
});
