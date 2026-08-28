/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // Sengaja `false` agar `npm run e2e` di terminal maupun CI tidak
    // membuka jendela browser tambahan di luar kendali Cypress.
    open: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.test.{js,jsx}'],
    exclude: ['node_modules/**', 'dist/**', 'cypress/**', 'storybook-static/**'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/**/*.stories.jsx',
        'src/tests/**',
        'src/setupTests.js',
      ],
    },
  },
});
