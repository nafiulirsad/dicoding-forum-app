import { MemoryRouter } from 'react-router-dom';
import '../src/styles/style.css';

/**
 * Konfigurasi global Storybook.
 * Seluruh story dibungkus `MemoryRouter` karena banyak komponen forum
 * memakai `Link`/`useNavigate` dari React Router.
 */
/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="app" style={{ padding: 16, maxWidth: 720 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default preview;
