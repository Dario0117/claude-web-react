import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CoreHTTPResponse } from '@/types/api.d';

import { ResetPasswordForm } from './reset-password.form';

// Mock handlers for Storybook
const mockHandleResetSuccess = async (
  email: string,
): Promise<CoreHTTPResponse<unknown>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log('Reset password request for:', email);
  return {
    data: {
      success: true,
      message: 'Password reset email sent successfully',
    },
    errors: null,
  };
};

const mockHandleResetError = async (
  email: string,
): Promise<CoreHTTPResponse<unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Reset password error for:', email);
  return {
    data: null,
    errors: {
      message:
        'No account found with this email address. Please check your email and try again.',
      details: null,
    },
  };
};

const mockHandleResetRateLimit = async (
  email: string,
): Promise<CoreHTTPResponse<unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('Rate limit error for:', email);
  return {
    data: null,
    errors: {
      message:
        'Too many reset attempts. Please wait 15 minutes before trying again.',
      details: null,
    },
  };
};

const mockHandleSuccess = () => {
  console.log('Reset email sent successfully!');
  alert('Password reset email sent! Please check your inbox.');
};

const meta = {
  title: 'Forms/ResetPasswordForm',
  component: ResetPasswordForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Password reset form that allows users to request a password reset email.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResetPasswordForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handleSubmit: mockHandleResetSuccess,
    handleSuccess: mockHandleSuccess,
  },
};

export const EmailNotFound: Story = {
  args: {
    handleSubmit: mockHandleResetError,
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Password reset form showing error when email is not found in the system.',
      },
    },
  },
};

export const RateLimited: Story = {
  args: {
    handleSubmit: mockHandleResetRateLimit,
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Password reset form showing rate limiting error when too many requests are made.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    handleSubmit: async (email: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate different responses based on email
      if (email === 'notfound@example.com') {
        return mockHandleResetError(email);
      }

      if (email === 'ratelimit@example.com') {
        return mockHandleResetRateLimit(email);
      }

      if (!email.includes('@') || !email.includes('.')) {
        return {
          data: null,
          errors: {
            message: 'Please enter a valid email address.',
            details: null,
          },
        };
      }

      return mockHandleResetSuccess(email);
    },
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story: `Interactive password reset form with different behaviors:
        - "notfound@example.com" will show email not found error
        - "ratelimit@example.com" will show rate limit error
        - Invalid email format will show validation error
        - Other valid emails will succeed`,
      },
    },
  },
};
