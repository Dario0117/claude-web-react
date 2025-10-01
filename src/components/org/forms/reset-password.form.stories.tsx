import type { Meta, StoryObj } from '@storybook/react-vite';
import type { useResetPasswordMutationType } from '@/services/users.service';
import { ResetPasswordForm } from './reset-password.form';

// Create mock mutation factory
const createMockMutation = (
  overrides?: Partial<useResetPasswordMutationType>,
): useResetPasswordMutationType =>
  ({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({ responseData: [] }),
    data: undefined,
    error: null,
    isError: false,
    isIdle: true,
    isPending: false,
    isSuccess: false,
    status: 'idle',
    variables: undefined,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    submittedAt: 0,
    reset: vi.fn(),
    context: undefined,
    ...overrides,
  }) as useResetPasswordMutationType;

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
    resetPasswordMutation: createMockMutation({
      mutateAsync: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        return { responseData: [] };
      },
    }),
    handleSuccess: mockHandleSuccess,
  },
};

export const EmailNotFound: Story = {
  args: {
    resetPasswordMutation: createMockMutation({
      mutateAsync: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const error = new Error('Email not found');
        Object.assign(error, {
          responseErrors: {
            nonFieldErrors: [
              'No account found with this email address. Please check your email and try again.',
            ],
          },
        });
        throw error;
      },
    }),
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
    resetPasswordMutation: createMockMutation({
      mutateAsync: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const error = new Error('Rate limited');
        Object.assign(error, {
          responseErrors: {
            nonFieldErrors: [
              'Too many reset attempts. Please wait 15 minutes before trying again.',
            ],
          },
        });
        throw error;
      },
    }),
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
    resetPasswordMutation: createMockMutation({
      mutateAsync: async ({ body }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const email = body.email;

        // Simulate different responses based on email
        if (email === 'notfound@example.com') {
          const error = new Error('Email not found');
          Object.assign(error, {
            responseErrors: {
              nonFieldErrors: [
                'No account found with this email address. Please check your email and try again.',
              ],
            },
          });
          throw error;
        }

        if (email === 'ratelimit@example.com') {
          const error = new Error('Rate limited');
          Object.assign(error, {
            responseErrors: {
              nonFieldErrors: [
                'Too many reset attempts. Please wait 15 minutes before trying again.',
              ],
            },
          });
          throw error;
        }

        return { responseData: [] };
      },
    }),
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
