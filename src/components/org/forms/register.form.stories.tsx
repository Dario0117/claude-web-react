import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  CoreHTTPResponse,
  RegisterResponse,
} from '@/services/users.service';

import { RegisterForm } from './register.form';

// Mock handlers for Storybook
const mockHandleRegisterSuccess = async (
  username: string,
  password: string,
  email: string,
): Promise<CoreHTTPResponse<RegisterResponse>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log('Register attempt:', { username, password, email });
  return {
    data: {
      success: true,
    },
    errors: null,
  };
};

const mockHandleRegisterError = async (
  username: string,
  password: string,
  email: string,
): Promise<CoreHTTPResponse<RegisterResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Register attempt with error:', { username, password, email });
  return {
    data: null,
    errors: {
      message: 'Registration failed. Username or email already exists.',
      details: {
        username: ['This username is already taken'],
        email: ['An account with this email already exists'],
      },
    },
  };
};

const mockHandleRegisterValidationError = async (
  username: string,
  password: string,
  email: string,
): Promise<CoreHTTPResponse<RegisterResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log('Register attempt with validation error:', {
    username,
    password,
    email,
  });
  return {
    data: null,
    errors: {
      message: 'Please fix the following validation errors:',
      details: {
        username: ['Username must be at least 3 characters long'],
        password: [
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        ],
        email: ['Please enter a valid email address'],
      },
    },
  };
};

const mockHandleSuccess = () => {
  console.log('Registration successful! Redirecting...');
  alert('Registration successful! Welcome to our platform.');
};

const meta = {
  title: 'Forms/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Registration form with username, email, password, and password confirmation fields.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RegisterForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handleSubmit: mockHandleRegisterSuccess,
    handleSuccess: mockHandleSuccess,
  },
};

export const WithError: Story = {
  args: {
    handleSubmit: mockHandleRegisterError,
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Registration form that shows server errors when username or email already exists.',
      },
    },
  },
};

export const ValidationError: Story = {
  args: {
    handleSubmit: mockHandleRegisterValidationError,
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story: 'Registration form showing validation errors from the server.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    handleSubmit: async (username: string, password: string, email: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate different responses based on input
      if (username === 'admin' || email === 'admin@example.com') {
        return mockHandleRegisterError(username, password, email);
      }

      if (username.length < 3 || !email.includes('@') || password.length < 6) {
        return mockHandleRegisterValidationError(username, password, email);
      }

      return mockHandleRegisterSuccess(username, password, email);
    },
    handleSuccess: mockHandleSuccess,
  },
  parameters: {
    docs: {
      description: {
        story: `Interactive registration form with different behaviors:
        - Username "admin" or email "admin@example.com" will show conflict error
        - Short username (<3 chars), invalid email, or short password (<6 chars) will show validation errors
        - Other valid inputs will succeed`,
      },
    },
  },
};
