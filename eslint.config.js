import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginStorybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';

export default defineConfig([
  globalIgnores([
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'storybook-static/**',
    'cypress/videos/**',
    'cypress/screenshots/**',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  pluginReact.configs.flat.recommended,
  daStyle,
  ...pluginStorybook.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx}'],
    plugins: { 'react-hooks': pluginReactHooks },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Berkas pengujian Vitest mengimpor API-nya secara eksplisit,
    // tetapi tetap membutuhkan global Node untuk beberapa utilitas.
    files: ['src/**/*.test.{js,jsx}', 'src/setupTests.js', 'src/tests/**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    // Berkas Cypress memakai global `cy`, `Cypress`, dan API Mocha.
    files: ['cypress/**/*.js', 'cypress.config.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        ...globals.node,
        cy: 'readonly',
        Cypress: 'readonly',
        assert: 'readonly',
        expect: 'readonly',
      },
    },
  },
  {
    files: ['.storybook/**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
]);
