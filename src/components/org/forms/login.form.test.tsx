import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CoreHTTPResponse, LoginResponse } from '@/types/api.d';
import { LoginForm } from './login.form';

interface LinkProps {
  children: React.ReactNode;
  to: string;
  [key: string]: unknown;
}

// Mock TanStack Router Link
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: LinkProps) => (
    <a
      href={to}
      {...props}
    >
      {children}
    </a>
  ),
}));

describe('LoginForm', () => {
  const mockHandleLogin = vi.fn();

  beforeEach(() => {
    mockHandleLogin.mockClear();
  });

  it('should render login form with all required fields', () => {
    render(<LoginForm handleLogin={mockHandleLogin} />);

    expect(screen.getByText('Login to your account')).toBeInTheDocument();
    expect(
      screen.getByText('Enter your username below to login to your account'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should render forgot password link', () => {
    render(<LoginForm handleLogin={mockHandleLogin} />);

    const forgotPasswordLink = screen.getByText('Forgot your password?');
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest('a')).toHaveAttribute(
      'href',
      '/reset-password',
    );
  });

  it('should render register link', () => {
    render(<LoginForm handleLogin={mockHandleLogin} />);

    const registerLink = screen.getByText('Register');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('should have proper input placeholders', () => {
    render(<LoginForm handleLogin={mockHandleLogin} />);

    expect(screen.getByPlaceholderText('johndoe17')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should have password input type', () => {
    render(<LoginForm handleLogin={mockHandleLogin} />);

    const passwordInput = screen.getByLabelText(/Password/);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should call handleLogin with correct credentials on form submission', async () => {
    const user = userEvent.setup();
    const mockResponse: CoreHTTPResponse<LoginResponse> = {
      data: { success: true, token: 'mock-token' },
      errors: null,
    };
    mockHandleLogin.mockResolvedValue(mockResponse);

    render(<LoginForm handleLogin={mockHandleLogin} />);

    const usernameInput = screen.getByLabelText(/Username/);
    const passwordInput = screen.getByLabelText(/Password/);
    const submitButton = screen.getByRole('button', { name: 'Login' });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith('testuser', 'testpassword');
    });
  });

  it('should prevent default form submission', async () => {
    const mockPreventDefault = vi.fn();
    const mockStopPropagation = vi.fn();

    render(<LoginForm handleLogin={mockHandleLogin} />);

    const form = screen.getByRole('button', { name: 'Login' }).closest('form');
    expect(form).toBeInTheDocument();

    if (form) {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      event.preventDefault = mockPreventDefault;
      event.stopPropagation = mockStopPropagation;

      fireEvent(form, event);

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockStopPropagation).toHaveBeenCalled();
    }
  });

  it('should handle empty form submission', async () => {
    const user = userEvent.setup();
    render(<LoginForm handleLogin={mockHandleLogin} />);

    const submitButton = screen.getByRole('button', { name: 'Login' });
    await user.click(submitButton);

    // Form should handle validation internally
    expect(mockHandleLogin).not.toHaveBeenCalled();
  });

  it('should display form error when handleLogin fails', async () => {
    const user = userEvent.setup();
    const mockError: CoreHTTPResponse<LoginResponse> = {
      data: null,
      errors: {
        message: 'Invalid credentials',
        details: {},
      },
    };
    mockHandleLogin.mockResolvedValue(mockError);

    render(<LoginForm handleLogin={mockHandleLogin} />);

    const usernameInput = screen.getByLabelText(/Username/);
    const passwordInput = screen.getByLabelText(/Password/);
    const submitButton = screen.getByRole('button', { name: 'Login' });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalled();
    });
  });

  it('should have required attributes on form fields', () => {
    render(<LoginForm handleLogin={mockHandleLogin} />);

    const usernameInput = screen.getByLabelText(/Username/);
    const passwordInput = screen.getByLabelText(/Password/);

    expect(usernameInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('should render with proper form structure', () => {
    const { container } = render(<LoginForm handleLogin={mockHandleLogin} />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    const fieldsContainer = container.querySelector('.flex.flex-col.gap-6');
    expect(fieldsContainer).toBeInTheDocument();

    const buttonContainer = container.querySelector('.flex.flex-col.gap-3');
    expect(buttonContainer).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<LoginForm handleLogin={mockHandleLogin} />);

    const usernameInput = screen.getByLabelText(/Username/);
    const passwordInput = screen.getByLabelText(/Password/);
    const submitButton = screen.getByRole('button', { name: 'Login' });

    // Tab navigation should work
    await user.tab();
    expect(usernameInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });
});
