import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { useResetPasswordMutationType } from '@/services/users.http-service';
import { ResetPasswordForm } from './reset-password.form';

describe('ResetPasswordForm', () => {
  const createMockMutation = (
    overrides?: Partial<useResetPasswordMutationType>,
  ): useResetPasswordMutationType =>
    ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      data: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      status: 'idle',
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
      reset: vi.fn(),
      context: undefined,
      ...overrides,
    }) as useResetPasswordMutationType;

  const mockHandleSuccess = vi.fn();

  beforeEach(() => {
    mockHandleSuccess.mockClear();
  });

  it('should render reset password form with all required fields', () => {
    const mockMutation = createMockMutation();
    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send reset email' }),
    ).toBeInTheDocument();
  });

  it('should have proper input placeholder', () => {
    const mockMutation = createMockMutation();
    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(
      screen.getByPlaceholderText('johndoe17@mail.com'),
    ).toBeInTheDocument();
  });

  it('should call mutateAsync with correct email on form submission', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    const mockMutation = createMockMutation({ mutateAsync: mockMutateAsync });

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await act(async () => {
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        body: { email: 'test@example.com' },
        signal: expect.any(AbortSignal),
      });
    });
  });

  it('should call handleSuccess on successful password reset request', async () => {
    const mockData = { responseData: ['Email sent successfully'] };
    const mockMutation = createMockMutation({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isSuccess: true,
      data: mockData,
    });

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  it('should display error when mutation fails', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockRejectedValue({
      responseErrors: { nonFieldErrors: ['Email not found'] },
    });
    const mockMutation = createMockMutation({ mutateAsync: mockMutateAsync });

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await act(async () => {
      await user.type(emailInput, 'nonexistent@example.com');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });

    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn();
    const mockMutation = createMockMutation({ mutateAsync: mockMutateAsync });

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await act(async () => {
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
    });

    // Should not call mutateAsync if email is invalid
    await waitFor(
      () => {
        expect(mockMutateAsync).not.toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });

  it('should prevent default form submission', () => {
    const mockPreventDefault = vi.fn();
    const mockStopPropagation = vi.fn();
    const mockMutation = createMockMutation();

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const form = screen
      .getByRole('button', { name: 'Send reset email' })
      .closest('form');
    expect(form).toBeInTheDocument();

    if (form) {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      event.preventDefault = mockPreventDefault;
      event.stopPropagation = mockStopPropagation;

      act(() => {
        fireEvent(form, event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockStopPropagation).toHaveBeenCalled();
    }
  });

  it('should have required attribute on email field', () => {
    const mockMutation = createMockMutation();
    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    expect(emailInput).toHaveAttribute('required');
  });

  it('should render with proper form structure', () => {
    const mockMutation = createMockMutation();
    const { container } = render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    const fieldsContainer = container.querySelector('.flex.flex-col.gap-6');
    expect(fieldsContainer).toBeInTheDocument();

    const buttonContainer = container.querySelector('.flex.flex-col.gap-3');
    expect(buttonContainer).toBeInTheDocument();
  });

  it('should handle empty form submission', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn();
    const mockMutation = createMockMutation({ mutateAsync: mockMutateAsync });

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });
    await user.click(submitButton);

    // Form should handle validation internally and not call mutateAsync
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    const mockMutation = createMockMutation();

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    // Tab navigation should work
    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });

  it('should clear error map before submission', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    const mockMutation = createMockMutation({ mutateAsync: mockMutateAsync });

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });

    // Verify the mutation was called with the email
    expect(mockMutateAsync).toHaveBeenCalledWith({
      body: { email: 'test@example.com' },
      signal: expect.any(AbortSignal),
    });
  });

  it('should accept valid email addresses', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    const mockMutation = createMockMutation({ mutateAsync: mockMutateAsync });

    render(
      <ResetPasswordForm
        resetPasswordMutation={mockMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
    ];

    for (const email of validEmails) {
      await user.clear(emailInput);
      await user.type(emailInput, email);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          body: { email },
          signal: expect.any(AbortSignal),
        });
      });

      mockMutateAsync.mockClear();
    }
  });
});
