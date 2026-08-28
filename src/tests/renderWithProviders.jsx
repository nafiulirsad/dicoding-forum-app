import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from '../states';

/**
 * Helper render untuk pengujian integrasi: membungkus komponen dengan
 * Redux Provider (store baru pada tiap pemanggilan) dan React Router.
 *
 * @param {import('react').ReactElement} ui komponen yang diuji
 * @param {{ preloadedState?: object, route?: string }} options
 * @returns hasil render React Testing Library beserta store yang dipakai
 */
export default function renderWithProviders(
  ui,
  { preloadedState, route = '/' } = {},
) {
  const store = createStore(preloadedState);

  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  );

  return { ...result, store };
}
