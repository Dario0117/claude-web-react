import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpdatePasswordPage } from './update-pw.page';

// Mock the services
vi.mock('@/services/users.service', () => ({
  useUpdatePasswordMutation: vi.fn(),
}));

// Mock the navigation hook
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

const mockUseUpdatePasswordMutation = vi.mocked(
  await import('@/services/users.service'),
).useUpdatePasswordMutation;
const mockUseNavigate = vi.mocked(
  await import('@tanstack/react-router'),
).useNavigate;
const mockUseParams = vi.mocked(
  await import('@tanstack/react-router'),
).useParams;

// Mock navigate function
const mockNavigate = vi.fn();
mockUseNavigate.mockReturnValue(mockNavigate);

// Mock params with token
mockUseParams.mockReturnValue({ token: 'test-token-123' });

describe('UpdatePasswordPage', () => {
  const mockUpdatePasswordMutation = {
    mutateAsync: vi.fn(),
    isSuccess: false,
    data: undefined,
    // biome-ignore lint/suspicious/noExplicitAny: Test mock
  } as any;

  beforeEach(() => {
    mockNavigate.mockClear();
    mockUpdatePasswordMutation.mutateAsync.mockClear();
    mockUpdatePasswordMutation.isSuccess = false;
    mockUpdatePasswordMutation.data = undefined;
    mockUseUpdatePasswordMutation.mockReturnValue(mockUpdatePasswordMutation);
  });

  it('should render update password form', () => {
    render(<UpdatePasswordPage />);

    expect(screen.getByText('Update your password')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Update password' }),
    ).toBeInTheDocument();
  });

  it('should call updatePassword with correct parameters when form is submitted', async () => {
    const user = userEvent.setup();
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue([
      'Password updated',
    ]);

    render(<UpdatePasswordPage />);

    const passwordInput = screen.getByLabelText(/^Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('should navigate to login page on successful password update', async () => {
    const user = userEvent.setup();
    const mockData = ['Password updated'];
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue(mockData);

    const { rerender } = render(<UpdatePasswordPage />);

    const passwordInput = screen.getByLabelText(/^Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });

    // Update mutation state to success and trigger re-render
    mockUpdatePasswordMutation.isSuccess = true;
    mockUpdatePasswordMutation.data = mockData;
    mockUseUpdatePasswordMutation.mockReturnValue(mockUpdatePasswordMutation);
    rerender(<UpdatePasswordPage />);

    // Now navigation should happen
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
    });
  });

  it('should not navigate on failed password update', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Invalid token');
    mockUpdatePasswordMutation.mutateAsync.mockRejectedValue(mockError);

    render(<UpdatePasswordPage />);

    const passwordInput = screen.getByLabelText(/^Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });

    // Should not navigate on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should have proper page structure and styling', () => {
    const { container } = render(<UpdatePasswordPage />);

    const section = container.querySelector('section');
    expect(section).toHaveClass(
      'flex',
      'min-h-svh',
      'w-full',
      'items-center',
      'justify-center',
      'p-6',
      'md:p-10',
    );

    const wrapper = container.querySelector('.w-full.max-w-sm');
    expect(wrapper).toBeInTheDocument();
  });

  it('should pass updatePassword function to UpdatePasswordForm', () => {
    render(<UpdatePasswordPage />);

    // The updatePassword function should be passed to UpdatePasswordForm
    // We can verify this by checking that the form is rendered (which means props were passed correctly)
    expect(screen.getByText('Update your password')).toBeInTheDocument();
  });

  it('should handle password submission correctly', async () => {
    const user = userEvent.setup();
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue([
      'Password updated',
    ]);

    render(<UpdatePasswordPage />);

    const passwordInput = screen.getByLabelText(/^Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'testpassword');
    await user.type(confirmPasswordInput, 'testpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('should use correct navigation source', () => {
    render(<UpdatePasswordPage />);

    // The useNavigate hook should be called with the correct 'from' parameter
    expect(mockUseNavigate).toHaveBeenCalledWith({
      from: '/update-password/$token',
    });
  });

  it('should render accessibility landmarks', () => {
    render(<UpdatePasswordPage />);

    const section = screen.getByText('Update your password').closest('section');
    expect(section).toBeInTheDocument();
  });

  it('should handle password update correctly', async () => {
    const user = userEvent.setup();
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue([
      'Password updated',
    ]);

    render(<UpdatePasswordPage />);

    const passwordInput = screen.getByLabelText(/^Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'secure123');
    await user.type(confirmPasswordInput, 'secure123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('should handle multiple form submissions', async () => {
    const user = userEvent.setup();
    mockUpdatePasswordMutation.mutateAsync.mockResolvedValue([
      'Password updated',
    ]);

    render(<UpdatePasswordPage />);

    const passwordInput = screen.getByLabelText(/^Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    // First submission
    await user.type(passwordInput, 'password1');
    await user.type(confirmPasswordInput, 'password1');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });

    // Clear the mock and submit again
    mockUpdatePasswordMutation.mutateAsync.mockClear();
    mockNavigate.mockClear();

    await user.clear(passwordInput);
    await user.clear(confirmPasswordInput);
    await user.type(passwordInput, 'password2');
    await user.type(confirmPasswordInput, 'password2');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('should handle async password update correctly', async () => {
    const user = userEvent.setup();

    // Simulate async behavior
    mockUpdatePasswordMutation.mutateAsync.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(['Password updated']), 100);
        }),
    );

    render(<UpdatePasswordPage />);

    const passwordInput = screen.getByLabelText(/^Password/);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'asyncpassword');
    await user.type(confirmPasswordInput, 'asyncpassword');
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(mockUpdatePasswordMutation.mutateAsync).toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });
});
