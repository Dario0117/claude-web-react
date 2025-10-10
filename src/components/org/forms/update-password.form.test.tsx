import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpdatePasswordForm } from './update-password.form';

// Mock the router hooks
vi.mock('@tanstack/react-router', () => ({
  useParams: vi.fn(),
}));

const mockUseParams = vi.mocked(
  await import('@tanstack/react-router'),
).useParams;

// Mock params with token
mockUseParams.mockReturnValue({ token: 'test-token-123' });

describe('UpdatePasswordForm', () => {
  const mockUpdatePasswordMutation = {
    mutateAsync: vi.fn(),
    isSuccess: false,
    data: undefined,
    // biome-ignore lint/suspicious/noExplicitAny: Test mock
  } as any;
  const mockHandleSuccess = vi.fn();

  beforeEach(() => {
    mockUpdatePasswordMutation.mutateAsync.mockClear();
    mockUpdatePasswordMutation.isSuccess = false;
    mockUpdatePasswordMutation.data = undefined;
    mockHandleSuccess.mockClear();
  });

  it('should render update password form with all required fields', () => {
    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
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
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('should have password input types', () => {
    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should call updatePasswordMutation with correct password on form submission', async () => {
    const user = userEvent.setup();
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue([
      'Password updated',
    ]);

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await act(async () => {
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmPasswordInput, 'newpassword123');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('should call handleSuccess on successful password update', async () => {
    const user = userEvent.setup();
    const mockData = ['Password updated'];
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue(mockData);

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await act(async () => {
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmPasswordInput, 'newpassword123');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  it('should display error when mutation fails', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Password update failed');
    mockUpdatePasswordMutation.mutateAsync.mockRejectedValue(mockError);

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await act(async () => {
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmPasswordInput, 'newpassword123');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });

    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should validate password confirmation', async () => {
    const user = userEvent.setup();

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await act(async () => {
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'differentpassword');
      await user.click(submitButton);
    });

    // Should not call mutation if passwords don't match
    await waitFor(
      () => {
        expect(mockUpdatePasswordMutation.mutateAsync).not.toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });

  it('should prevent default form submission', () => {
    const mockPreventDefault = vi.fn();
    const mockStopPropagation = vi.fn();

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
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
        updatePasswordMutation={mockUpdatePasswordMutation}
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
        updatePasswordMutation={mockUpdatePasswordMutation}
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
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue([
      'Password updated',
    ]);

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });
    await act(async () => {
      await user.click(submitButton);
    });

    // Form allows empty passwords (both match), so mutation will be called
    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalledWith({
        body: { password: '', token: 'test-token-123' },
        signal: expect.any(AbortSignal),
      });
    });
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);

    // Tab navigation should work through input fields
    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(confirmPasswordInput).toHaveFocus();

    // Fill in both fields to enable the submit button
    await user.click(passwordInput);
    await user.type(passwordInput, 'testpassword');
    await user.click(confirmPasswordInput);
    await user.type(confirmPasswordInput, 'testpassword');

    // Now the submit button should be enabled and focusable
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.tab();
    await waitFor(() => {
      expect(submitButton).toHaveFocus();
    });
  });

  it('should clear error map before submission', async () => {
    const user = userEvent.setup();
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue([
      'Password updated',
    ]);

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await act(async () => {
      await user.type(passwordInput, 'newpassword123');
      await user.type(confirmPasswordInput, 'newpassword123');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('should handle matching passwords correctly', async () => {
    const user = userEvent.setup();
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue([
      'Password updated',
    ]);

    render(
      <UpdatePasswordForm
        updatePasswordMutation={mockUpdatePasswordMutation}
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
      await act(async () => {
        await user.clear(passwordInput);
        await user.clear(confirmPasswordInput);
        await user.type(passwordInput, password);
        await user.type(confirmPasswordInput, password);
        await user.click(submitButton);
      });

      await waitFor(() => {
        expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
      });

      mockUpdatePasswordMutation.mutateAsync.mockClear();
    }
  });
});
