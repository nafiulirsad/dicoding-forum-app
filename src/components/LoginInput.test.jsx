/**
 * Skenario pengujian
 *
 * - LoginInput component
 *   - harus menampilkan input email, input kata sandi, dan tombol masuk
 *   - harus mengubah nilai input email ketika pengguna mengetik
 *   - harus mengubah nilai input kata sandi ketika pengguna mengetik
 *   - harus menampilkan pesan galat dan tidak memanggil onLogin ketika form dikirim dalam keadaan kosong
 *   - harus menampilkan pesan galat ketika format email tidak valid
 *   - harus menampilkan pesan galat ketika kata sandi kurang dari 6 karakter
 *   - harus memanggil fungsi onLogin dengan email dan kata sandi yang diisi pengguna
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginInput from './LoginInput';

describe('LoginInput component', () => {
  it('harus menampilkan input email, input kata sandi, dan tombol masuk', () => {
    // arrange
    render(<LoginInput onLogin={vi.fn()} />);

    // action & assert
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata sandi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('harus mengubah nilai input email ketika pengguna mengetik', async () => {
    // arrange
    const user = userEvent.setup();
    render(<LoginInput onLogin={vi.fn()} />);
    const emailInput = screen.getByLabelText('Email');

    // action
    await user.type(emailInput, 'john@example.com');

    // assert
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('harus mengubah nilai input kata sandi ketika pengguna mengetik', async () => {
    // arrange
    const user = userEvent.setup();
    render(<LoginInput onLogin={vi.fn()} />);
    const passwordInput = screen.getByLabelText('Kata sandi');

    // action
    await user.type(passwordInput, 'rahasia123');

    // assert
    expect(passwordInput).toHaveValue('rahasia123');
  });

  it('harus menampilkan pesan galat dan tidak memanggil onLogin ketika form dikirim dalam keadaan kosong', async () => {
    // arrange
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<LoginInput onLogin={onLogin} />);

    // action
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    // assert
    expect(await screen.findByText('Email wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Kata sandi wajib diisi.')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('harus menampilkan pesan galat ketika format email tidak valid', async () => {
    // arrange
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<LoginInput onLogin={onLogin} />);

    // action
    await user.type(screen.getByLabelText('Email'), 'bukan-email');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    // assert
    expect(await screen.findByText('Format email tidak valid.')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('harus menampilkan pesan galat ketika kata sandi kurang dari 6 karakter', async () => {
    // arrange
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<LoginInput onLogin={onLogin} />);

    // action
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Kata sandi'), '123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    // assert
    expect(await screen.findByText('Kata sandi minimal 6 karakter.')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('harus memanggil fungsi onLogin dengan email dan kata sandi yang diisi pengguna', async () => {
    // arrange
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<LoginInput onLogin={onLogin} />);

    // action
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    // assert
    await waitFor(() => expect(onLogin).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'rahasia123',
    }));
  });
});
