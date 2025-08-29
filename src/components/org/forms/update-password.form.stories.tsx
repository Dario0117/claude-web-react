import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CoreHTTPResponse } from '@/services/users.service';

import { UpdatePasswordForm } from './update-password.form';

// Mock handlers for Storybook
const mockHandleUpdateSuccess = async (
  password: string,
): Promise<CoreHTTPResponse<unknown>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(
    'Password update successful for password length:',
    password.length,
  );
  return {
    data: {
      success: true,
      message: 'Password updated successfully',
    },
    errors: null,
  };
};

const mockHandleUpdateError = async (
  password: string,
): Promise<CoreHTTPResponse<unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log('Password update error for password:', password);
  return {
    data: null,
    errors: {
      message:
        'Invalid or expired reset token. Please request a new password reset.',
      details: null,
    },
  };
};

const mockHandleUpdateWeakPassword = async (
  password: string,
): Promise<CoreHTTPResponse<unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  console.log('Weak password error:', password);
  return {
    data: null,
    errors: {
      message: 'Password does not meet security requirements.',
      details: {
        password: [
          'Password must be at least 8 characters long',
          'Password must contain at least one uppercase letter',
          'Password must contain at least one lowercase letter',
          'Password must contain at least one number',
          'Password must contain at least one special character',
        ],
      },
    },
  };
};

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
    handleSubmit: mockHandleUpdateSuccess,
    handleSuccess: mockHandleSuccess,
  },
};

export const InvalidToken: Story = {
  args: {
    handleSubmit: mockHandleUpdateError,
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Password update form showing error when the reset token is invalid or expired.',
      },
    },
  },
};

export const WeakPassword: Story = {
  args: {
    handleSubmit: mockHandleUpdateWeakPassword,
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Password update form showing validation errors for weak passwords.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    handleSubmit: async (password: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate different responses based on password strength
      if (password === 'invalid-token') {
        return mockHandleUpdateError(password);
      }

      // Check password strength
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
        password,
      );
      const isLongEnough = password.length >= 8;

      if (
        !isLongEnough ||
        !hasUpperCase ||
        !hasLowerCase ||
        !hasNumber ||
        !hasSpecialChar
      ) {
        return mockHandleUpdateWeakPassword(password);
      }

      return mockHandleUpdateSuccess(password);
    },
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story: `Interactive password update form with different behaviors:
        - Password "invalid-token" will show token error
        - Weak passwords (missing uppercase, lowercase, number, special char, or <8 chars) will show validation errors
        - Strong passwords will succeed
        - Try: "Password123!" for success, "weak" for validation error`,
      },
    },
  },
};
