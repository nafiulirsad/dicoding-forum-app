/**
 * Skenario pengujian
 *
 * - RegisterInput component
 *   - harus menampilkan input nama, email, kata sandi, dan tombol daftar
 *   - harus mengubah nilai ketiga input ketika pengguna mengetik
 *   - harus menampilkan pesan galat pada seluruh input wajib ketika form dikirim kosong
 *   - harus menampilkan pesan galat ketika nama kurang dari 3 karakter
 *   - harus memanggil fungsi onRegister dengan data yang sudah dipangkas spasinya
 */

import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterInput from './RegisterInput';

describe('RegisterInput component', () => {
  it('harus menampilkan input nama, email, kata sandi, dan tombol daftar', () => {
    // arrange
    render(<RegisterInput onRegister={vi.fn()} />);

    // action & assert
    expect(screen.getByLabelText('Nama lengkap')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata sandi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Daftar Sekarang' })).toBeInTheDocument();
  });

  it('harus mengubah nilai ketiga input ketika pengguna mengetik', async () => {
    // arrange
    const user = userEvent.setup();
    render(<RegisterInput onRegister={vi.fn()} />);

    // action
    await user.type(screen.getByLabelText('Nama lengkap'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');

    // assert
    expect(screen.getByLabelText('Nama lengkap')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
    expect(screen.getByLabelText('Kata sandi')).toHaveValue('rahasia123');
  });

  it('harus menampilkan pesan galat pada seluruh input wajib ketika form dikirim kosong', async () => {
    // arrange
    const user = userEvent.setup();
    const onRegister = vi.fn();
    render(<RegisterInput onRegister={onRegister} />);

    // action
    await user.click(screen.getByRole('button', { name: 'Daftar Sekarang' }));

    // assert
    expect(await screen.findByText('Nama wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Email wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Kata sandi wajib diisi.')).toBeInTheDocument();
    expect(onRegister).not.toHaveBeenCalled();
  });

  it('harus menampilkan pesan galat ketika nama kurang dari 3 karakter', async () => {
    // arrange
    const user = userEvent.setup();
    const onRegister = vi.fn();
    render(<RegisterInput onRegister={onRegister} />);

    // action
    await user.type(screen.getByLabelText('Nama lengkap'), 'Jo');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Daftar Sekarang' }));

    // assert
    expect(await screen.findByText('Nama minimal 3 karakter.')).toBeInTheDocument();
    expect(onRegister).not.toHaveBeenCalled();
  });

  it('harus memanggil fungsi onRegister dengan data yang sudah dipangkas spasinya', async () => {
    // arrange
    const user = userEvent.setup();
    const onRegister = vi.fn();
    render(<RegisterInput onRegister={onRegister} />);

    // action
    await user.type(screen.getByLabelText('Nama lengkap'), '  John Doe  ');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Kata sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Daftar Sekarang' }));

    // assert
    await waitFor(() => expect(onRegister).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'rahasia123',
    }));
  });
});
