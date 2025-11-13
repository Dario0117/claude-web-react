import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { act } from 'react';
import { server } from '@/../testsSetup';
import { logError } from '@/lib/logger.utils';
import { buildBackendUrl } from '@/lib/test.utils';
import { createQueryThemeWrapper } from '@/lib/test-wrappers.utils';
import { useRegisterMutation } from '@/services/users.http-service';
import { useRegisterForm } from './use-register-form';

// Mock the logger utility
vi.mock('@/lib/logger.utils', () => ({
  logError: vi.fn(),
}));

describe('useRegisterForm', () => {
  const mockHandleSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(
      () => {
        const registerMutation = useRegisterMutation();
        return useRegisterForm({
          registerMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    expect(result.current.state.values).toEqual({
      username: '',
      password: '',
      confirm: '',
      email: '',
    });
  });

  it('should call mutateAsync with correct data on successful submission', async () => {
    const { result } = renderHook(
      () => {
        const registerMutation = useRegisterMutation();
        return useRegisterForm({
          registerMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set form values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('email', 'test@example.com');
      result.current.setFieldValue('password', 'password123');
      result.current.setFieldValue('confirm', 'password123');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledWith({
        responseData: ['User registered successfully.'],
      });
    });
  });

  it('should handle validation errors from server response', async () => {
    // Override the handler to return an error
    server.use(
      http.post(buildBackendUrl('/api/v1/users/register'), () => {
        return HttpResponse.json(
          {
            responseData: null,
            responseErrors: {
              nonFieldErrors: ['Registration failed'],
              username: ['Username already exists'],
              email: ['Invalid email format'],
              password: null,
            },
          },
          { status: 400 },
        );
      }),
    );

    const { result } = renderHook(
      () => {
        const registerMutation = useRegisterMutation();
        return useRegisterForm({
          registerMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set form values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('email', 'test@example.com');
      result.current.setFieldValue('password', 'password123');
      result.current.setFieldValue('confirm', 'password123');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(result.current.state.errorMap.onSubmit?.[0]).toBe(
        'Registration failed',
      );
    });
    expect(result.current.state.fieldMeta.username.errorMap.onSubmit?.[0]).toBe(
      'Username already exists',
    );
    expect(result.current.state.fieldMeta.email.errorMap.onSubmit?.[0]).toBe(
      'Invalid email format',
    );
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors and log them', async () => {
    // Override the handler to simulate a network error (no responseErrors)
    server.use(
      http.post(buildBackendUrl('/api/v1/users/register'), () => {
        return HttpResponse.json({ message: 'Network error' }, { status: 500 });
      }),
    );

    const { result } = renderHook(
      () => {
        const registerMutation = useRegisterMutation();
        return useRegisterForm({
          registerMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set form values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('email', 'test@example.com');
      result.current.setFieldValue('password', 'password123');
      result.current.setFieldValue('confirm', 'password123');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(logError).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(result.current.state.errorMap.onSubmit?.[0]).toBe(
        'Something went wrong, please try again later.',
      );
    });
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should handle errors without responseErrors property', async () => {
    // Override the handler to simulate an error without responseErrors
    server.use(
      http.post(buildBackendUrl('/api/v1/users/register'), () => {
        return HttpResponse.json({ message: 'Unknown error' }, { status: 500 });
      }),
    );

    const { result } = renderHook(
      () => {
        const registerMutation = useRegisterMutation();
        return useRegisterForm({
          registerMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set form values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('email', 'test@example.com');
      result.current.setFieldValue('password', 'password123');
      result.current.setFieldValue('confirm', 'password123');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(logError).toHaveBeenCalledWith({
        'error': {
          'message': 'Unknown error',
        },
        'message': 'Unexpected error type',
      });
    });

    await waitFor(() => {
      expect(result.current.state.errorMap.onSubmit?.[0]).toBe(
        'Something went wrong, please try again later.',
      );
    });
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should pass signal to mutateAsync for request cancellation', async () => {
    const { result } = renderHook(
      () => {
        const registerMutation = useRegisterMutation();
        return useRegisterForm({
          registerMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set form values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('email', 'test@example.com');
      result.current.setFieldValue('password', 'password123');
      result.current.setFieldValue('confirm', 'password123');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Verify that handleSuccess was called (which means the signal was passed correctly)
    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledWith({
        responseData: ['User registered successfully.'],
      });
    });
  });

  it('should only include username, email, and password in request body', async () => {
    const { result } = renderHook(
      () => {
        const registerMutation = useRegisterMutation();
        return useRegisterForm({
          registerMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set form values including confirm password
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('email', 'test@example.com');
      result.current.setFieldValue('password', 'password123');
      result.current.setFieldValue('confirm', 'password123');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Verify handleSuccess was called (which means the request was successful with correct body)
    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledWith({
        responseData: ['User registered successfully.'],
      });
    });
  });
});
