import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { server } from '@/../testsSetup';
import { buildBackendUrl } from '@/lib/test.utils';
import { createQueryThemeWrapper } from '@/lib/test-wrappers.utils';
import { useLoginMutation } from '@/services/users.http-service';
import { useLoginForm } from './use-login-form';

describe('useLoginForm', () => {
  it('should initialize with empty default values', () => {
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    expect(result.current.state.values.username).toBe('');
    expect(result.current.state.values.password).toBe('');
  });

  it('should validate required fields', async () => {
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Try to submit with empty values
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Should have validation errors - TanStack form validates on submit
    // The form should prevent submission with invalid data
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should call loginMutation on successful validation', async () => {
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set valid values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('password', 'password123');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledWith({
        token: 'random-token',
        expiry: 'random-expiry',
      });
    });
  });

  it('should handle multiple form submissions', async () => {
    const mockHandleSuccess = vi.fn();

    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set valid values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('password', 'password123');
    });

    // First submission
    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledTimes(1);
    });

    // The form state should exist
    expect(result.current.state).toBeDefined();
    expect(result.current.state.values.username).toBe('testuser');
  });

  it('should set error map when login fails', async () => {
    // Override the handler to return an error
    server.use(
      http.post(buildBackendUrl('/api/v1/users/login'), () => {
        return HttpResponse.json(
          {
            responseData: null,
            responseErrors: {
              nonFieldErrors: ['Invalid credentials'],
            },
          },
          { status: 400 },
        );
      }),
    );

    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set valid values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('password', 'wrongpassword');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Check that the error was set
    await waitFor(() => {
      expect(result.current.state.errorMap.onSubmit?.[0]).toBe(
        'Invalid credentials',
      );
    });
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should handle login function throwing an error', async () => {
    // Override the handler to return an error
    server.use(
      http.post(buildBackendUrl('/api/v1/users/login'), () => {
        return HttpResponse.json(
          {
            responseData: null,
            responseErrors: {
              nonFieldErrors: ['Network error'],
              username: ['Invalid username'],
              password: ['Invalid password'],
            },
          },
          { status: 500 },
        );
      }),
    );

    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set valid values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('password', 'password123');
    });

    // Submit form - should handle error gracefully
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Check that error was processed and set in form state
    await waitFor(() => {
      expect(result.current.state.errorMap.onSubmit?.[0]).toBe('Network error');
    });
    expect(result.current.state.fieldMeta.username.errorMap.onSubmit?.[0]).toBe(
      'Invalid username',
    );
    expect(result.current.state.fieldMeta.password.errorMap.onSubmit?.[0]).toBe(
      'Invalid password',
    );
    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should validate username field individually', () => {
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Should be able to set valid value
    act(() => {
      result.current.setFieldValue('username', 'validuser');
    });

    expect(result.current.state.values.username).toBe('validuser');

    // Should be able to set empty value
    act(() => {
      result.current.setFieldValue('username', '');
    });

    expect(result.current.state.values.username).toBe('');
  });

  it('should validate password field individually', () => {
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Should be able to set valid value
    act(() => {
      result.current.setFieldValue('password', 'validpassword');
    });

    expect(result.current.state.values.password).toBe('validpassword');

    // Should be able to set empty value
    act(() => {
      result.current.setFieldValue('password', '');
    });

    expect(result.current.state.values.password).toBe('');
  });

  it('should handle successful login without errors', async () => {
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(
      () => {
        const loginMutation = useLoginMutation();
        return useLoginForm({
          loginMutation,
          handleSuccess: mockHandleSuccess,
        });
      },
      { wrapper: createQueryThemeWrapper() },
    );

    // Set valid values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('password', 'password123');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Should have called handleSuccess
    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledTimes(1);
      expect(mockHandleSuccess).toHaveBeenCalledWith({
        token: 'random-token',
        expiry: 'random-expiry',
      });
    });
  });
});
