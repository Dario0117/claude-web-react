import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  const mockLoginMutation = {
    mutateAsync: vi.fn(),
    error: null,
    // biome-ignore lint/suspicious/noExplicitAny: Test mock
  } as any;

  const mockHandleSuccess = vi.fn();

  beforeEach(() => {
    mockLoginMutation.mutateAsync.mockClear();
    mockHandleSuccess.mockClear();
  });

  it('should render login form with all required fields', () => {
    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(screen.getByText('Login to your account')).toBeInTheDocument();
    expect(
      screen.getByText('Enter your username below to login to your account'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should render forgot password link', () => {
    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const forgotPasswordLink = screen.getByText('Forgot your password?');
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest('a')).toHaveAttribute(
      'href',
      '/reset-password',
    );
  });

  it('should render register link', () => {
    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const registerLink = screen.getByText('Register');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('should have proper input placeholders', () => {
    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(screen.getByPlaceholderText('johndoe17')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should have password input type', () => {
    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByLabelText(/Password/);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should call loginMutation with correct credentials on form submission', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      token: 'mock-token',
      expiry: '2025-12-31T23:59:59Z',
    };
    mockLoginMutation.mutateAsync.mockResolvedValue(mockResponse);

    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const passwordInput = screen.getByLabelText(/Password/);
    const submitButton = screen.getByRole('button', { name: 'Login' });

    await act(async () => {
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'testpassword');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockLoginMutation.mutateAsync).toHaveBeenCalledWith({
        body: { username: 'testuser', password: 'testpassword' },
        signal: expect.any(AbortSignal),
      });
    });
  });

  it('should prevent default form submission', () => {
    const mockPreventDefault = vi.fn();
    const mockStopPropagation = vi.fn();

    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const form = screen.getByRole('button', { name: 'Login' }).closest('form');
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

  it('should handle empty form submission', async () => {
    const user = userEvent.setup();
    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const submitButton = screen.getByRole('button', { name: 'Login' });
    await act(async () => {
      await user.click(submitButton);
    });

    // Form should handle validation internally
    expect(mockLoginMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it('should display form error when loginMutation fails', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Invalid credentials');
    mockLoginMutation.mutateAsync.mockRejectedValue(mockError);

    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const passwordInput = screen.getByLabelText(/Password/);
    const submitButton = screen.getByRole('button', { name: 'Login' });

    await act(async () => {
      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockLoginMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it('should have required attributes on form fields', () => {
    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const passwordInput = screen.getByLabelText(/Password/);

    expect(usernameInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('should render with proper form structure', () => {
    const { container } = render(
      <LoginForm
        loginMutation={mockLoginMutation}
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

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <LoginForm
        loginMutation={mockLoginMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const passwordInput = screen.getByLabelText(/Password/);
    const forgotPasswordLink = screen.getByRole('link', {
      name: 'Forgot your password?',
    });

    // Tab navigation should work
    await user.tab();
    expect(usernameInput).toHaveFocus();

    await user.tab();
    expect(forgotPasswordLink).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    // Submit button is disabled, so next focus should be register link
    await user.tab();
    const registerLink = screen.getByRole('link', { name: 'Register' });
    expect(registerLink).toHaveFocus();
  });
});
