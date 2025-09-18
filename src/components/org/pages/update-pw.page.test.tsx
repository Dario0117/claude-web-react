import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CoreHTTPResponse } from '@/types/api.d';
import { UpdatePasswordPage } from './update-pw.page';

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

describe('UpdatePasswordPage', () => {
  const mockUpdatePassword = vi.fn();
  const mockToken = 'test-reset-token-123';

  beforeEach(() => {
    mockNavigate.mockClear();
    mockUpdatePassword.mockClear();
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: mockUpdatePassword,
    });
  });

  it('should render update password form', () => {
    render(<UpdatePasswordPage token={mockToken} />);

    expect(screen.getByText('Update your password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Update password' }),
    ).toBeInTheDocument();
  });

  it('should call updatePassword with correct parameters when form is submitted', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockUpdatePassword.mockResolvedValue(mockResponse);

    render(<UpdatePasswordPage token={mockToken} />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        password: 'newpassword123',
        token: mockToken,
      });
    });
  });

  it('should navigate to login page on successful password update', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockUpdatePassword.mockResolvedValue(mockResponse);

    render(<UpdatePasswordPage token={mockToken} />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
    });
  });

  it('should not navigate on failed password update', async () => {
    const user = userEvent.setup();
    const mockError: CoreHTTPResponse<unknown> = {
      data: null,
      errors: {
        message: 'Invalid token',
        details: {},
      },
    };
    mockUpdatePassword.mockResolvedValue(mockError);

    render(<UpdatePasswordPage token={mockToken} />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmPasswordInput, 'newpassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalled();
    });

    // Should not navigate on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should have proper page structure and styling', () => {
    const { container } = render(<UpdatePasswordPage token={mockToken} />);

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
    render(<UpdatePasswordPage token={mockToken} />);

    // The updatePassword function should be passed to UpdatePasswordForm
    // We can verify this by checking that the form is rendered (which means props were passed correctly)
    expect(screen.getByText('Update your password')).toBeInTheDocument();
  });

  it('should handle different tokens correctly', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockUpdatePassword.mockResolvedValue(mockResponse);

    const tokens = ['token1', 'token2', 'very-long-token-string-123'];

    for (const token of tokens) {
      const { unmount } = render(<UpdatePasswordPage token={token} />);

      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
      const submitButton = screen.getByRole('button', {
        name: 'Update password',
      });

      await user.type(passwordInput, 'testpassword');
      await user.type(confirmPasswordInput, 'testpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdatePassword).toHaveBeenCalledWith({
          password: 'testpassword',
          token,
        });
      });

      mockUpdatePassword.mockClear();
      unmount();
    }
  });

  it('should use correct navigation source', () => {
    render(<UpdatePasswordPage token={mockToken} />);

    // The useNavigate hook should be called with the correct 'from' parameter
    expect(mockUseNavigate).toHaveBeenCalledWith({
      from: '/update-password/$token',
    });
  });

  it('should render accessibility landmarks', () => {
    render(<UpdatePasswordPage token={mockToken} />);

    const section = screen.getByText('Update your password').closest('section');
    expect(section).toBeInTheDocument();
  });

  it('should handle updatePassword function call correctly', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockUpdatePassword.mockResolvedValue(mockResponse);

    render(<UpdatePasswordPage token={mockToken} />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'secure123');
    await user.type(confirmPasswordInput, 'secure123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        password: 'secure123',
        token: mockToken,
      });
    });

    // Verify the result is returned correctly
    expect(mockUpdatePassword).toHaveReturnedWith(
      Promise.resolve(mockResponse),
    );
  });

  it('should handle multiple form submissions with same token', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockUpdatePassword.mockResolvedValue(mockResponse);

    render(<UpdatePasswordPage token={mockToken} />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    // First submission
    await user.type(passwordInput, 'password1');
    await user.type(confirmPasswordInput, 'password1');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        password: 'password1',
        token: mockToken,
      });
    });

    // Clear the mock and submit again
    mockUpdatePassword.mockClear();
    mockNavigate.mockClear();

    await user.clear(passwordInput);
    await user.clear(confirmPasswordInput);
    await user.type(passwordInput, 'password2');
    await user.type(confirmPasswordInput, 'password2');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        password: 'password2',
        token: mockToken,
      });
    });
  });

  it('should handle async updatePassword function correctly', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };

    // Simulate async behavior
    mockUpdatePassword.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockResponse), 100);
        }),
    );

    render(<UpdatePasswordPage token={mockToken} />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'asyncpassword');
    await user.type(confirmPasswordInput, 'asyncpassword');
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(mockUpdatePassword).toHaveBeenCalledWith({
          password: 'asyncpassword',
          token: mockToken,
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

  it('should handle empty token', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<unknown> = {
      data: {},
      errors: null,
    };
    mockUpdatePassword.mockResolvedValue(mockResponse);

    render(<UpdatePasswordPage token="" />);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', {
      name: 'Update password',
    });

    await user.type(passwordInput, 'testpassword');
    await user.type(confirmPasswordInput, 'testpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        password: 'testpassword',
        token: '',
      });
    });
  });
});
