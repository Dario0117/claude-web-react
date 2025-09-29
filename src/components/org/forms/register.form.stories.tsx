import type { Meta, StoryObj } from '@storybook/react-vite';
import type { useRegisterMutationType } from '@/services/users.service';

import { RegisterForm } from './register.form';

// Mock mutation for successful registration
const mockSuccessfulMutation: useRegisterMutationType = {
  mutate: () => {
    // Mock function - no implementation needed
  },
  mutateAsync: async () => ({
    responseData: ['Account created successfully!'],
    responseErrors: null,
  }),
  isLoading: false,
  isError: false,
  isSuccess: true,
  isIdle: false,
  data: {
    responseData: ['Account created successfully!'],
    responseErrors: null,
  },
  error: null,
  status: 'success',
  variables: undefined,
  reset: () => {
    // Mock function - no implementation needed
  },
} as unknown as useRegisterMutationType;

// Mock mutation for error state
const mockErrorMutation: useRegisterMutationType = {
  mutate: () => {
    // Mock function - no implementation needed
  },
  mutateAsync: () => {
    throw new Error('Registration failed');
  },
  isLoading: false,
  isError: true,
  isSuccess: false,
  isIdle: false,
  data: undefined,
  error: new Error('Registration failed'),
  status: 'error',
  variables: undefined,
  reset: () => {
    // Mock function - no implementation needed
  },
} as unknown as useRegisterMutationType;

// Mock mutation for loading state
const mockLoadingMutation: useRegisterMutationType = {
  mutate: () => {
    // Mock function - no implementation needed
  },
  mutateAsync: async () =>
    new Promise(() => {
      // Never resolves - simulates loading state
    }),
  isLoading: true,
  isError: false,
  isSuccess: false,
  isIdle: false,
  data: undefined,
  error: null,
  status: 'loading',
  variables: undefined,
  reset: () => {
    // Mock function - no implementation needed
  },
} as unknown as useRegisterMutationType;

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
    registerMutation: mockSuccessfulMutation,
    handleSuccess: mockHandleSuccess,
  },
};

export const WithError: Story = {
  args: {
    registerMutation: mockErrorMutation,
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
    registerMutation: mockLoadingMutation,
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
    registerMutation: mockSuccessfulMutation,
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
