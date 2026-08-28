/**
 * Berkas support Cypress. Dimuat sebelum setiap berkas spesifikasi
 * sehingga cocok dipakai untuk mendaftarkan custom command dan hook global.
 */
import './commands';

// Mencegah pengujian gagal hanya karena error tak tertangani dari aplikasi
// pihak ketiga (mis. skrip font) yang tidak berkaitan dengan skenario uji.
Cypress.on('uncaught:exception', () => false);
