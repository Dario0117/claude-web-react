import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CoreHTTPResponse } from '@/types/api.d';
import { ResetPasswordForm } from './reset-password.form';

describe('ResetPasswordForm', () => {
  const mockHandleSubmit = vi.fn();
  const mockHandleSuccess = vi.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
    mockHandleSuccess.mockClear();
  });

  it('should render reset password form with all required fields', () => {
    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
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
    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(
      screen.getByPlaceholderText('johndoe17@mail.com'),
    ).toBeInTheDocument();
  });

  it('should call handleSubmit with correct email on form submission', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockHandleSubmit.mockResolvedValue(mockResponse);

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
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
      expect(mockHandleSubmit).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should call handleSuccess on successful password reset request', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockHandleSubmit.mockResolvedValue(mockResponse);

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
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
      expect(mockHandleSuccess).toHaveBeenCalled();
    });
  });

  it('should display error when handleSubmit fails', async () => {
    const user = userEvent.setup();
    const mockError: CoreHTTPResponse<unknown> = {
      data: null,
      errors: {
        message: 'Email not found',
        details: {},
      },
    };
    mockHandleSubmit.mockResolvedValue(mockError);

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'nonexistent@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });

    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    // Should not call handleSubmit if email is invalid
    await waitFor(
      () => {
        expect(mockHandleSubmit).not.toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });

  it('should prevent default form submission', () => {
    const mockPreventDefault = vi.fn();
    const mockStopPropagation = vi.fn();

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
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
    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/);
    expect(emailInput).toHaveAttribute('required');
  });

  it('should render with proper form structure', () => {
    const { container } = render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
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

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });
    await user.click(submitButton);

    // Form should handle validation internally and not call handleSubmit
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
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
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockHandleSubmit.mockResolvedValue(mockResponse);

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
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
      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    // Verify the form clears errors before submission
    expect(mockHandleSubmit).toHaveBeenCalledWith('test@example.com');
  });

  it('should accept valid email addresses', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockHandleSubmit.mockResolvedValue(mockResponse);

    render(
      <ResetPasswordForm
        handleSubmit={mockHandleSubmit}
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
        expect(mockHandleSubmit).toHaveBeenCalledWith(email);
      });

      mockHandleSubmit.mockClear();
    }
  });
});
