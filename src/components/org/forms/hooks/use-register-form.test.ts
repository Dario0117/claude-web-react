import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { logError } from '@/lib/logger.utils';
import type { useRegisterMutationType } from '@/services/users.http-service';
import { useRegisterForm } from './use-register-form';

// Mock the logger utility
vi.mock('@/lib/logger.utils', () => ({
  logError: vi.fn(),
}));

describe('useRegisterForm', () => {
  const mockMutateAsync = vi.fn();
  const mockHandleSuccess = vi.fn();
  const mockRegisterMutation: useRegisterMutationType = {
    mutate: vi.fn(),
    mutateAsync: mockMutateAsync,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    data: undefined,
    error: null,
    status: 'idle',
    variables: undefined,
    reset: vi.fn(),
  } as unknown as useRegisterMutationType;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useRegisterForm({
        registerMutation: mockRegisterMutation,
        handleSuccess: mockHandleSuccess,
      }),
    );

    expect(result.current.state.values).toEqual({
      username: '',
      password: '',
      confirm: '',
      email: '',
    });
  });

  it('should call mutateAsync with correct data on successful submission', async () => {
    const mockData = { success: true };
    mockMutateAsync.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useRegisterForm({
        registerMutation: mockRegisterMutation,
        handleSuccess: mockHandleSuccess,
      }),
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

    expect(mockMutateAsync).toHaveBeenCalledWith({
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
      signal: expect.any(AbortSignal),
    });

    expect(mockHandleSuccess).toHaveBeenCalledWith(mockData);
  });

  it('should handle validation errors from server response', async () => {
    const mockError = {
      responseErrors: {
        nonFieldErrors: ['Registration failed'],
        username: ['Username already exists'],
        email: ['Invalid email format'],
        password: null,
      },
    };
    mockMutateAsync.mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useRegisterForm({
        registerMutation: mockRegisterMutation,
        handleSuccess: mockHandleSuccess,
      }),
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
      expect(result.current.state.errorMap.onSubmit).toEqual([
        'Registration failed',
      ]);
    });
  });

  it('should handle unexpected errors and log them', async () => {
    const unexpectedError = new Error('Network error');
    mockMutateAsync.mockRejectedValue(unexpectedError);

    const { result } = renderHook(() =>
      useRegisterForm({
        registerMutation: mockRegisterMutation,
        handleSuccess: mockHandleSuccess,
      }),
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

    expect(logError).toHaveBeenCalledWith({
      message: 'Unexpected error type',
      error: 'Error: Network error',
    });

    await waitFor(() => {
      expect(result.current.state.errorMap.onSubmit).toEqual([
        'Something went wrong, please try again later.',
      ]);
    });
  });

  it('should handle errors without responseErrors property', async () => {
    const errorWithoutResponseErrors = { message: 'Unknown error' };
    mockMutateAsync.mockRejectedValue(errorWithoutResponseErrors);

    const { result } = renderHook(() =>
      useRegisterForm({
        registerMutation: mockRegisterMutation,
        handleSuccess: mockHandleSuccess,
      }),
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

    expect(logError).toHaveBeenCalledWith({
      message: 'Unexpected error type',
      error: '[object Object]',
    });

    await waitFor(() => {
      expect(result.current.state.errorMap.onSubmit).toEqual([
        'Something went wrong, please try again later.',
      ]);
    });
  });

  it('should pass signal to mutateAsync for request cancellation', async () => {
    mockMutateAsync.mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useRegisterForm({
        registerMutation: mockRegisterMutation,
        handleSuccess: mockHandleSuccess,
      }),
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

    // Verify that an AbortSignal was passed
    const callArgs = mockMutateAsync.mock.calls?.[0]?.[0];
    expect(callArgs?.signal).toBeInstanceOf(AbortSignal);
  });

  it('should only include username, email, and password in request body', async () => {
    mockMutateAsync.mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useRegisterForm({
        registerMutation: mockRegisterMutation,
        handleSuccess: mockHandleSuccess,
      }),
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

    const callArgs = mockMutateAsync.mock.calls?.[0]?.[0];
    expect(callArgs?.body).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    // Verify confirm is not included
    expect(callArgs?.body).not.toHaveProperty('confirm');
  });
});
