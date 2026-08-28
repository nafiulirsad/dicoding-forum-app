import { expect, fn, userEvent, within } from 'storybook/test';
import LoginInput from './LoginInput';

/**
 * Form masuk yang divalidasi memakai React Hook Form.
 * Story `ValidasiGagal` menjalankan interaksi otomatis untuk memperlihatkan
 * pesan kesalahan ketika form dikirim dalam keadaan kosong.
 */
export default {
  title: 'Komponen/LoginInput',
  component: LoginInput,
  tags: ['autodocs'],
  args: {
    onLogin: fn(),
  },
};

export const Default = {};

export const TerisiPenuh = {
  name: 'Terisi penuh',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(canvas.getByLabelText('Kata sandi'), 'rahasia123');
  },
};

export const ValidasiGagal = {
  name: 'Validasi gagal',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Masuk' }));
    await expect(await canvas.findByText('Email wajib diisi.')).toBeInTheDocument();
    await expect(args.onLogin).not.toHaveBeenCalled();
  },
};
