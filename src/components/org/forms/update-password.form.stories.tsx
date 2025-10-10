import type { Meta, StoryObj } from '@storybook/react-vite';
import { UpdatePasswordForm } from './update-password.form';

const mockHandleSuccess = () => {
  console.log('Password updated successfully!');
  alert('Password updated! You can now log in with your new password.');
};

const meta = {
  title: 'Forms/UpdatePasswordForm',
  component: UpdatePasswordForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Password update form for users who are resetting their password via email link.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UpdatePasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    updatePasswordMutation: {
      mutateAsync: vi.fn().mockResolvedValue(['Password updated successfully']),
      isSuccess: false,
      data: undefined,
      // biome-ignore lint/suspicious/noExplicitAny: Storybook mock
    } as any,
    handleSuccess: mockHandleSuccess,
  },
};

export const Loading: Story = {
  args: {
    updatePasswordMutation: {
      mutateAsync: vi.fn(),
      isPending: true,
      isSuccess: false,
      data: undefined,
      // biome-ignore lint/suspicious/noExplicitAny: Storybook mock
    } as any,
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story: 'Password update form in loading state.',
      },
    },
  },
};
