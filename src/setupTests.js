/**
 * Berkas setup global untuk seluruh pengujian Vitest.
 *
 * - Menambahkan matcher tambahan dari `@testing-library/jest-dom`
 *   (mis. `toBeInTheDocument`, `toBeDisabled`) ke dalam `expect` milik Vitest.
 * - Membersihkan DOM hasil render setelah setiap test agar test tidak
 *   saling memengaruhi satu sama lain.
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});
