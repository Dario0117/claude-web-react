import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CoreHTTPError } from '@/services/users.service';

import { FormErrorDisplay } from './form-error-display';

const meta = {
  title: 'UI/FormErrorDisplay',
  component: FormErrorDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormErrorDisplay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoError: Story = {
  args: {
    error: null,
  },
};

export const SimpleError: Story = {
  args: {
    error: {
      message: 'Invalid credentials. Please check your username and password.',
      details: 'Test error details',
    } as CoreHTTPError,
  },
};

export const ValidationError: Story = {
  args: {
    error: {
      message: 'Validation failed',
      details: {
        username: ['Username is required'],
        password: ['Password must be at least 8 characters'],
      },
    } as CoreHTTPError,
  },
};

export const ServerError: Story = {
  args: {
    error: {
      message: 'Internal server error. Please try again later.',
      details: 'Test error details',
    } as CoreHTTPError,
  },
};

export const NetworkError: Story = {
  args: {
    error: {
      message:
        'Network error. Please check your internet connection and try again.',
      details: 'Test error details',
    } as CoreHTTPError,
  },
};

export const LongErrorMessage: Story = {
  args: {
    error: {
      message:
        'Registration failed due to multiple validation errors. Please review all fields and ensure they meet the requirements. Username must be unique, password must be at least 8 characters with uppercase, lowercase, and special characters, and email must be valid.',
      details: 'Test error details',
    } as CoreHTTPError,
  },
};

export const InFormContext: Story = {
  render: (args) => (
    <div className="w-full max-w-md">
      <form className="space-y-4">
        <div className="grid gap-2">
          <label
            htmlFor="username-demo"
            className="text-sm font-medium"
          >
            Username
          </label>
          <input
            id="username-demo"
            type="text"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            placeholder="Enter username"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="password-demo"
            className="text-sm font-medium"
          >
            Password
          </label>
          <input
            id="password-demo"
            type="password"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            placeholder="Enter password"
          />
        </div>
        <button
          type="submit"
          className="w-full h-9 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          Sign In
        </button>
        <FormErrorDisplay {...args} />
      </form>
    </div>
  ),
  args: {
    error: {
      message: 'Invalid username or password. Please try again.',
      details: 'Test error details',
    } as CoreHTTPError,
  },
};
