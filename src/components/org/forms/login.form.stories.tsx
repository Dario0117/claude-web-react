import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CoreHTTPResponse, LoginResponse, CoreHTTPError } from '@/types/api.d';

import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-card';
import { FormErrorDisplay } from '@/components/ui/form-error-display';
import { FormField } from '@/components/ui/form-field';
import { useLoginForm } from './hooks/use-login-form';

// Mock LoginForm component to avoid router context dependencies
function MockLoginForm({ handleLogin }: { handleLogin: (username: string, password: string) => Promise<CoreHTTPResponse<LoginResponse>> }) {
  const form = useLoginForm({ handleLogin });

  return (
    <FormCard
      title="Login to your account"
      description="Enter your username below to login to your account"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-6">
          <form.Field name="username">
            {(field) => (
              <FormField
                field={field}
                label="Username"
                placeholder="johndoe17"
                required
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <FormField
                field={field}
                label="Password"
                type="password"
                placeholder="Password"
                required
              >
                <a
                  href="/reset-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </FormField>
            )}
          </form.Field>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          </div>
        </div>

        <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
          {(errorMap) => {
            const error =
              errorMap && typeof errorMap === 'object' && 'form' in errorMap
                ? (errorMap as { form: CoreHTTPError<unknown> }).form
                : null;
            return (
              <FormErrorDisplay
                error={error as CoreHTTPError<unknown> | null}
              />
            );
          }}
        </form.Subscribe>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <a href="/register">Register</a>
        </div>
      </form>
    </FormCard>
  );
}

// Mock handlers for Storybook
const mockHandleLoginSuccess = async (
  username: string,
  password: string,
): Promise<CoreHTTPResponse<LoginResponse>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Login attempt:', { username, password });
  return {
    data: {
      success: true,
      token: 'mock-token-123',
      user: {
        id: 1,
        username,
        email: `${username}@example.com`,
      },
    },
    errors: null,
  };
};

const mockHandleLoginError = async (
  username: string,
  password: string,
): Promise<CoreHTTPResponse<LoginResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Login attempt with error:', { username, password });
  return {
    data: null,
    errors: {
      message:
        'Invalid username or password. Please check your credentials and try again.',
      details: null,
    },
  };
};

const mockHandleLoginNetworkError = async (
  username: string,
  password: string,
): Promise<CoreHTTPResponse<LoginResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log('Login attempt with network error:', { username, password });
  return {
    data: null,
    errors: {
      message:
        'Network error. Please check your internet connection and try again.',
      details: null,
    },
  };
};

const meta = {
  title: 'Forms/LoginForm',
  component: MockLoginForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Login form component with username/password fields and error handling.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MockLoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handleLogin: mockHandleLoginSuccess,
  },
};

export const WithError: Story = {
  args: {
    handleLogin: mockHandleLoginError,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Login form that displays an error message when authentication fails.',
      },
    },
  },
};

export const NetworkError: Story = {
  args: {
    handleLogin: mockHandleLoginNetworkError,
  },
  parameters: {
    docs: {
      description: {
        story: 'Login form handling network connectivity issues.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    handleLogin: async (username: string, password: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate different responses based on credentials
      if (username === 'admin' && password === 'password') {
        return mockHandleLoginSuccess(username, password);
      }

      if (username === 'network-error') {
        return mockHandleLoginNetworkError(username, password);
      }

      return mockHandleLoginError(username, password);
    },
  },
  parameters: {
    docs: {
      description: {
        story: `Interactive login form with different behaviors:
        - Use "admin" / "password" for successful login
        - Use "network-error" / any password for network error
        - Any other credentials will show invalid credentials error`,
      },
    },
  },
};
