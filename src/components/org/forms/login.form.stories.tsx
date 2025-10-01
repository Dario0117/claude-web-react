import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-card';
import { FormErrorDisplay } from '@/components/ui/form-error-display';
import { FormField } from '@/components/ui/form-field';
import type { CoreHTTPResponse } from '@/types/api.d';
import type { components } from '@/types/api.generated';
import { useLoginForm } from './hooks/use-login-form';

type LoginResponse = components['schemas']['LoginResponse'];

// Mock LoginForm component to avoid router context dependencies
// biome-ignore lint/suspicious/noExplicitAny: Storybook mock
function MockLoginForm({ loginMutation }: { loginMutation: any }) {
  const form = useLoginForm({ loginMutation });

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
            <form.Subscribe
              selector={(state) => state.isValid && !state.isPristine}
            >
              {(canSubmit) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit}
                >
                  Login
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>

        <form.Subscribe selector={(state) => [state.errorMap]}>
          {([errorMap]) => {
            const submitErrors = errorMap?.onSubmit;
            if (!submitErrors) {
              return null;
            }
            return <FormErrorDisplay errors={submitErrors} />;
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
      token: 'mock-token-123',
      expiry: '2025-12-31T23:59:59Z',
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
    loginMutation: {
      mutateAsync: async ({
        body,
      }: {
        body: { username: string; password: string };
      }) => mockHandleLoginSuccess(body.username, body.password),
      error: null,
    },
  },
};

export const WithError: Story = {
  args: {
    loginMutation: {
      mutateAsync: async ({
        body,
      }: {
        body: { username: string; password: string };
      }) => mockHandleLoginError(body.username, body.password),
      error: null,
    },
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
    loginMutation: {
      mutateAsync: async ({
        body,
      }: {
        body: { username: string; password: string };
      }) => mockHandleLoginNetworkError(body.username, body.password),
      error: null,
    },
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
    loginMutation: {
      mutateAsync: async ({
        body,
      }: {
        body: { username: string; password: string };
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate different responses based on credentials
        if (body.username === 'admin' && body.password === 'password') {
          return mockHandleLoginSuccess(body.username, body.password);
        }

        if (body.username === 'network-error') {
          return mockHandleLoginNetworkError(body.username, body.password);
        }

        return mockHandleLoginError(body.username, body.password);
      },
      error: null,
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
