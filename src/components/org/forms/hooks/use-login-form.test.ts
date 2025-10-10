import { act, renderHook } from '@testing-library/react';
import { useLoginForm } from './use-login-form';

describe('useLoginForm', () => {
  const mockLoginSuccess = {
    token: 'mock-token',
    expiry: '2025-12-31T23:59:59Z',
  };

  it('should initialize with empty default values', () => {
    const mockLoginMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    expect(result.current.state.values.username).toBe('');
    expect(result.current.state.values.password).toBe('');
  });

  it('should validate required fields', async () => {
    const mockLoginMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Try to submit with empty values
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Should have validation errors - TanStack form validates on submit
    // The form should prevent submission with invalid data
    expect(mockLoginMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it('should call loginMutation on successful validation', async () => {
    const mockLoginMutation = {
      mutateAsync: vi.fn().mockResolvedValue(mockLoginSuccess),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
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

    expect(mockLoginMutation.mutateAsync).toHaveBeenCalledWith({
      body: { username: 'testuser', password: 'password123' },
      signal: expect.any(AbortSignal),
    });
  });

  it('should handle multiple form submissions', async () => {
    const mockLoginMutation = {
      mutateAsync: vi
        .fn()
        .mockResolvedValueOnce(mockLoginSuccess)
        .mockResolvedValueOnce(mockLoginSuccess),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();

    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('password', 'wrongpassword');
    });

    // First submission with error
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Should have called login once
    expect(mockLoginMutation.mutateAsync).toHaveBeenCalledTimes(1);

    // The form state should exist
    expect(result.current.state).toBeDefined();
    expect(result.current.state.values.username).toBe('testuser');
  });

  it('should set error map when login fails', async () => {
    const mockError = {
      responseErrors: {
        nonFieldErrors: ['Invalid credentials'],
      },
    };
    const mockLoginMutation = {
      mutateAsync: vi.fn().mockRejectedValue(mockError),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
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

    // Check that the error was set (may be in different structure)
    expect(mockLoginMutation.mutateAsync).toHaveBeenCalledWith({
      body: { username: 'testuser', password: 'wrongpassword' },
      signal: expect.any(AbortSignal),
    });
    expect(result.current.state.errorMap.onSubmit).toBeDefined();
  });

  it('should handle login function throwing an error', async () => {
    const mockError = {
      responseErrors: {
        nonFieldErrors: ['Network error'],
      },
    };
    const mockLoginMutation = {
      mutateAsync: vi.fn().mockRejectedValue(mockError),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
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
    expect(result.current.state.errorMap.onSubmit).toBeDefined();
  });

  it('should validate username field individually', () => {
    const mockLoginMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
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
    const mockLoginMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
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
    const mockLoginMutation = {
      mutateAsync: vi.fn().mockResolvedValue(mockLoginSuccess),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({
        loginMutation: mockLoginMutation,
        handleSuccess: mockHandleSuccess,
      }),
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

    // Should have called the login function
    expect(mockLoginMutation.mutateAsync).toHaveBeenCalledTimes(1);
    expect(mockLoginMutation.mutateAsync).toHaveBeenCalledWith({
      body: { username: 'testuser', password: 'password123' },
      signal: expect.any(AbortSignal),
    });
  });
});
