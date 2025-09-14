import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CoreHTTPResponse, LoginResponse } from '@/services/users.service';

import { LoginForm } from './login.form';

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
      user: {
        id: '1',
        username,
        email: `${username}@example.com`,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
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
      details: 'Test error details',
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
      details: 'Test error details',
    },
  };
};

const meta = {
  title: 'Forms/LoginForm',
  component: LoginForm,
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
} satisfies Meta<typeof LoginForm>;

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
