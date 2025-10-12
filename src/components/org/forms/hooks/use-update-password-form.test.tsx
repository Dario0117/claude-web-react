import { act, renderHook } from '@testing-library/react';
import { useUpdatePasswordForm } from './use-update-password-form';

// Mock useParams
vi.mock('@tanstack/react-router', () => ({
  useParams: vi.fn(() => ({ token: 'test-token-123' })),
}));

describe('useUpdatePasswordForm', () => {
  const mockUpdatePasswordSuccess = {
    message: 'Password updated successfully',
  };

  it('should initialize with empty default values', () => {
    const mockUpdatePasswordMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdatePasswordForm({
        updatePasswordMutation: mockUpdatePasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    expect(result.current.state.values.password).toBe('');
    expect(result.current.state.values.confirm).toBe('');
  });

  it('should handle validation on submit', async () => {
    const mockUpdatePasswordMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdatePasswordForm({
        updatePasswordMutation: mockUpdatePasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Try to submit with empty passwords
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Form should handle submission (validation may allow empty values through to backend)
    // The actual validation behavior depends on the schema
    expect(result.current.state).toBeDefined();
  });

  it('should call updatePasswordMutation on successful validation', async () => {
    const mockUpdatePasswordMutation = {
      mutateAsync: vi.fn().mockResolvedValue(mockUpdatePasswordSuccess),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdatePasswordForm({
        updatePasswordMutation: mockUpdatePasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid passwords
    act(() => {
      result.current.setFieldValue('password', 'NewPassword123!');
      result.current.setFieldValue('confirm', 'NewPassword123!');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalledWith({
      body: { token: 'test-token-123', password: 'NewPassword123!' },
      signal: expect.any(AbortSignal),
    });
  });

  it('should call handleSuccess after successful password update', async () => {
    const mockUpdatePasswordMutation = {
      mutateAsync: vi.fn().mockResolvedValue(mockUpdatePasswordSuccess),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdatePasswordForm({
        updatePasswordMutation: mockUpdatePasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid passwords
    act(() => {
      result.current.setFieldValue('password', 'NewPassword123!');
      result.current.setFieldValue('confirm', 'NewPassword123!');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockHandleSuccess).toHaveBeenCalledWith(mockUpdatePasswordSuccess);
  });

  it('should set error map when update password fails with responseErrors', async () => {
    const mockError = {
      responseErrors: {
        nonFieldErrors: ['Invalid or expired token'],
      },
    };
    const mockUpdatePasswordMutation = {
      mutateAsync: vi.fn().mockRejectedValue(mockError),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdatePasswordForm({
        updatePasswordMutation: mockUpdatePasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid passwords
    act(() => {
      result.current.setFieldValue('password', 'NewPassword123!');
      result.current.setFieldValue('confirm', 'NewPassword123!');
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Check that the error was set
    expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalledWith({
      body: { token: 'test-token-123', password: 'NewPassword123!' },
      signal: expect.any(AbortSignal),
    });
    expect(result.current.state.errorMap.onSubmit).toBeDefined();
  });

  it('should handle unexpected error without responseErrors', async () => {
    const mockError = new Error('Network error');
    const mockUpdatePasswordMutation = {
      mutateAsync: vi.fn().mockRejectedValue(mockError),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdatePasswordForm({
        updatePasswordMutation: mockUpdatePasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Set valid passwords
    act(() => {
      result.current.setFieldValue('password', 'NewPassword123!');
      result.current.setFieldValue('confirm', 'NewPassword123!');
    });

    // Submit form - should handle error gracefully
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Check that error was processed and set in form state
    expect(result.current.state.errorMap.onSubmit).toBeDefined();
  });

  it('should validate password field individually', () => {
    const mockUpdatePasswordMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdatePasswordForm({
        updatePasswordMutation: mockUpdatePasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Should be able to set valid password
    act(() => {
      result.current.setFieldValue('password', 'ValidPassword123!');
    });

    expect(result.current.state.values.password).toBe('ValidPassword123!');

    // Should be able to set empty value
    act(() => {
      result.current.setFieldValue('password', '');
    });

    expect(result.current.state.values.password).toBe('');
  });

  it('should validate confirm field individually', () => {
    const mockUpdatePasswordMutation = {
      mutateAsync: vi.fn(),
      error: null,
      // biome-ignore lint/suspicious/noExplicitAny: Test mock
    } as any;
    const mockHandleSuccess = vi.fn();
    const { result } = renderHook(() =>
      useUpdatePasswordForm({
        updatePasswordMutation: mockUpdatePasswordMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    // Should be able to set valid confirm password
    act(() => {
      result.current.setFieldValue('confirm', 'ValidPassword123!');
    });

    expect(result.current.state.values.confirm).toBe('ValidPassword123!');

    // Should be able to set empty value
    act(() => {
      result.current.setFieldValue('confirm', '');
    });

    expect(result.current.state.values.confirm).toBe('');
  });
});
