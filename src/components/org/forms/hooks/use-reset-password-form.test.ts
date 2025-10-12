import { act, renderHook } from '@testing-library/react';
import { useResetPasswordForm } from './use-reset-password-form';

describe('useResetPasswordForm', () => {
  const mockResetPasswordSuccess = {
    message: 'Password reset email sent',
  };

  it('should initialize with empty default values', () => {
    const mockResetPasswordMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useResetPasswordForm({
        resetPasswordMutation: mockResetPasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    expect(result.current.state.values.email).toBe('');
  });

  it('should validate required email field', async () => {
    const mockResetPasswordMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useResetPasswordForm({
        resetPasswordMutation: mockResetPasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Try to submit with empty email
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Should have validation errors - form validates on submit
    expect(mockResetPasswordMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it('should call resetPasswordMutation on successful validation', async () => {
    const mockResetPasswordMutation = {
      mutateAsync: vi.fn().mockResolvedValue(mockResetPasswordSuccess),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useResetPasswordForm({
        resetPasswordMutation: mockResetPasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid email
    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockResetPasswordMutation.mutateAsync).toHaveBeenCalledWith({
      body: { email: 'test@example.com' },
      signal: expect.any(AbortSignal),
    });
  });

  it('should call handleSuccess after successful password reset request', async () => {
    const mockResetPasswordMutation = {
      mutateAsync: vi.fn().mockResolvedValue(mockResetPasswordSuccess),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useResetPasswordForm({
        resetPasswordMutation: mockResetPasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid email
    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockHandleSuccess).toHaveBeenCalledWith(mockResetPasswordSuccess);
  });

  it('should set error map when reset password fails with responseErrors', async () => {
    const mockError = {
      responseErrors: {
        nonFieldErrors: ['Email not found'],
      },
    };
    const mockResetPasswordMutation = {
      mutateAsync: vi.fn().mockRejectedValue(mockError),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useResetPasswordForm({
        resetPasswordMutation: mockResetPasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid email
    act(() => {
      result.current.setFieldValue('email', 'notfound@example.com');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Check that the error was set
    expect(mockResetPasswordMutation.mutateAsync).toHaveBeenCalledWith({
      body: { email: 'notfound@example.com' },
      signal: expect.any(AbortSignal),
    });
    expect(result.current.state.errorMap.onSubmit).toBeDefined();
  });

  it('should handle unexpected error without responseErrors', async () => {
    const mockError = new Error('Network error');
    const mockResetPasswordMutation = {
      mutateAsync: vi.fn().mockRejectedValue(mockError),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useResetPasswordForm({
        resetPasswordMutation: mockResetPasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid email
    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    // Submit form - should handle error gracefully
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Check that error was processed and set in form state
    expect(result.current.state.errorMap.onSubmit).toBeDefined();
  });

  it('should validate email field individually', () => {
    const mockResetPasswordMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useResetPasswordForm({
        resetPasswordMutation: mockResetPasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Should be able to set valid email
    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    expect(result.current.state.values.email).toBe('test@example.com');

    // Should be able to set empty value
    act(() => {
      result.current.setFieldValue('email', '');
    });

    expect(result.current.state.values.email).toBe('');
  });
});
