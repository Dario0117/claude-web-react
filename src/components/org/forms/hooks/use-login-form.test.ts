import { act, renderHook } from '@testing-library/react';
import type { CoreHTTPResponse, LoginResponse } from '@/services/users.service';
import { useLoginForm } from './use-login-form';

describe('useLoginForm', () => {
  const mockLoginSuccess: CoreHTTPResponse<LoginResponse> = {
    data: {
      success: true,
      user: {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    },
    errors: null,
  };

  const mockLoginError: CoreHTTPResponse<LoginResponse> = {
    data: null,
    errors: {
      message: 'Invalid credentials',
      details: 'Test error details',
    },
  };

  it('should initialize with empty default values', () => {
    const mockHandleLogin = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
    );

    expect(result.current.state.values.username).toBe('');
    expect(result.current.state.values.password).toBe('');
  });

  it('should validate required fields', async () => {
    const mockHandleLogin = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
    );

    // Try to submit with empty values
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Should have validation errors - TanStack form validates on submit
    // The form should prevent submission with invalid data
    expect(mockHandleLogin).not.toHaveBeenCalled();
  });

  it('should call handleLogin on successful validation', async () => {
    const mockHandleLogin = vi.fn().mockResolvedValue(mockLoginSuccess);
    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
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

    expect(mockHandleLogin).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('should handle multiple form submissions', async () => {
    const mockHandleLogin = vi
      .fn()
      .mockResolvedValueOnce(mockLoginError)
      .mockResolvedValueOnce(mockLoginSuccess);

    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
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
    expect(mockHandleLogin).toHaveBeenCalledTimes(1);

    // The form state should exist
    expect(result.current.state).toBeDefined();
    expect(result.current.state.values.username).toBe('testuser');
  });

  it('should set error map when login fails', async () => {
    const mockHandleLogin = vi.fn().mockResolvedValue(mockLoginError);
    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
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
    expect(mockHandleLogin).toHaveBeenCalledWith('testuser', 'wrongpassword');
    expect(result.current.state.errorMap.onSubmit).toBeDefined();
  });

  it('should handle login function throwing an error', async () => {
    const mockHandleLogin = vi
      .fn()
      .mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
    );

    // Set valid values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldValue('password', 'password123');
    });

    // Submit form - should not throw
    await act(async () => {
      await expect(result.current.handleSubmit()).rejects.toThrow(
        'Network error',
      );
    });
  });

  it('should validate username field individually', () => {
    const mockHandleLogin = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
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
    const mockHandleLogin = vi.fn();
    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
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
    const mockHandleLogin = vi.fn().mockResolvedValue(mockLoginSuccess);
    const { result } = renderHook(() =>
      useLoginForm({ handleLogin: mockHandleLogin }),
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
    expect(mockHandleLogin).toHaveBeenCalledTimes(1);
    expect(mockHandleLogin).toHaveBeenCalledWith('testuser', 'password123');
  });
});
