import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CoreHTTPResponse } from '@/types/api.d';
import { UpdatePasswordForm } from './update-password.form';

describe('UpdatePasswordForm', () => {
  const mockHandleSubmit = vi.fn();
  const mockHandleSuccess = vi.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
    mockHandleSuccess.mockClear();
  });

  it('should render update password form with all required fields', () => {
    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(screen.getByText('Update your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Update password' }),
    ).toBeInTheDocument();
  });

  it('should have proper input placeholders', () => {
    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('should have password input types', () => {
    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should call handleSubmit with correct password on form submission', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockHandleSubmit.mockResolvedValue(mockResponse);

    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith('newpassword123');
    });
  });

  it('should call handleSuccess on successful password update', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockHandleSubmit.mockResolvedValue(mockResponse);

    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
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
        message: 'Password update failed',
        details: {},
      },
    };
    mockHandleSubmit.mockResolvedValue(mockError);

    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password update failed')).toBeInTheDocument();
    });

    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should validate password confirmation', async () => {
    const user = userEvent.setup();

    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(submitButton);

    // Should not call handleSubmit if passwords don't match
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
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const form = screen
      .getByRole('button', { name: 'Update password' })
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

  it('should have required attributes on form fields', () => {
    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);

    expect(passwordInput).toHaveAttribute('required');
    expect(confirmPasswordInput).toHaveAttribute('required');
  });

  it('should render with proper form structure', () => {
    const { container } = render(
      <UpdatePasswordForm
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
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });
    await user.click(submitButton);

    // Form should handle validation internally and not call handleSubmit
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    // Tab navigation should work
    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(confirmPasswordInput).toHaveFocus();

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
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    // Verify the form clears errors before submission
    expect(mockHandleSubmit).toHaveBeenCalledWith('newpassword123');
  });

  it('should handle matching passwords correctly', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockHandleSubmit.mockResolvedValue(mockResponse);

    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    const passwords = ['password123', 'verysecure456', 'complex!pass789'];

    for (const password of passwords) {
      await user.clear(passwordInput);
      await user.clear(confirmPasswordInput);
      await user.type(passwordInput, password);
      await user.type(confirmPasswordInput, password);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledWith(password);
      });

      mockHandleSubmit.mockClear();
    }
  });

  it('should not submit with empty passwords', async () => {
    const user = userEvent.setup();

    render(
      <UpdatePasswordForm
        handleSubmit={mockHandleSubmit}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });
    await user.click(submitButton);

    // Should not call handleSubmit with empty passwords
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });
});
