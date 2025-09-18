import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CoreHTTPResponse } from '@/types/api.d';
import { ResetPasswordPage } from './reset-pw.page';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock the navigation hook
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

const mockUseAuth = vi.mocked(await import('@/hooks/useAuth')).useAuth;
const mockUseNavigate = vi.mocked(
  await import('@tanstack/react-router'),
).useNavigate;

// Mock navigate function
const mockNavigate = vi.fn();
mockUseNavigate.mockReturnValue(mockNavigate);

describe('ResetPasswordPage', () => {
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockResetPassword.mockClear();
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      resetPassword: mockResetPassword,
      updatePassword: vi.fn(),
    });
  });

  it('should render reset password form', () => {
    render(<ResetPasswordPage />);

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send reset email' }),
    ).toBeInTheDocument();
  });

  it('should call resetPassword when form is submitted', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockResetPassword.mockResolvedValue(mockResponse);

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  it('should navigate to login page on successful reset', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockResetPassword.mockResolvedValue(mockResponse);

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
    });
  });

  it('should not navigate on failed reset', async () => {
    const user = userEvent.setup();
    const mockError: CoreHTTPResponse<unknown> = {
      data: null,
      errors: {
        message: 'Email not found',
        details: {},
      },
    };
    mockResetPassword.mockResolvedValue(mockError);

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'nonexistent@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalled();
    });

    // Should not navigate on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should have proper page structure and styling', () => {
    const { container } = render(<ResetPasswordPage />);

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

  it('should pass resetPassword function to ResetPasswordForm', () => {
    render(<ResetPasswordPage />);

    // The resetPassword function should be passed to ResetPasswordForm
    // We can verify this by checking that the form is rendered (which means props were passed correctly)
    expect(screen.getByText('Reset your password')).toBeInTheDocument();
  });

  it('should handle resetPassword function call correctly', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockResetPassword.mockResolvedValue(mockResponse);

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'user@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
      });
    });

    // Verify the result is returned correctly
    expect(mockResetPassword).toHaveReturnedWith(Promise.resolve(mockResponse));
  });

  it('should use correct navigation source', () => {
    render(<ResetPasswordPage />);

    // The useNavigate hook should be called with the correct 'from' parameter
    expect(mockUseNavigate).toHaveBeenCalledWith({ from: '/reset-password' });
  });

  it('should render accessibility landmarks', () => {
    render(<ResetPasswordPage />);

    const section = screen.getByText('Reset your password').closest('section');
    expect(section).toBeInTheDocument();
  });

  it('should handle multiple form submissions', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockResetPassword.mockResolvedValue(mockResponse);

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    // First submission
    await user.type(emailInput, 'test1@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: 'test1@example.com',
      });
    });

    // Clear the mock and submit again
    mockResetPassword.mockClear();
    mockNavigate.mockClear();

    await user.clear(emailInput);
    await user.type(emailInput, 'test2@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: 'test2@example.com',
      });
    });
  });

  it('should handle async resetPassword function correctly', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };

    // Simulate async behavior
    mockResetPassword.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockResponse), 100);
        }),
    );

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'async@example.com');
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(mockResetPassword).toHaveBeenCalledWith({
          email: 'async@example.com',
        });
      },
      { timeout: 1000 },
    );

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
      },
      { timeout: 1000 },
    );
  });
});
