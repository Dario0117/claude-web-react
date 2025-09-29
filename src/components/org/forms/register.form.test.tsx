import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { useRegisterMutationType } from '@/services/users.service';
import { RegisterForm } from './register.form';

describe('RegisterForm', () => {
  const mockHandleSuccess = vi.fn();
  const mockMutateAsync = vi.fn();
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
    mockHandleSuccess.mockClear();
  });

  it('should render register form with all required fields', () => {
    render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Register' }),
    ).toBeInTheDocument();
  });

  it('should have proper input placeholders', () => {
    render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    expect(screen.getByPlaceholderText('johndoe17')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('johndoe17@mail.com'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('should have password input types', () => {
    render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should call handleSubmit with correct data on form submission', async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const emailInput = screen.getByLabelText(/Email/);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', { name: 'Register' });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'testpassword');
    await user.type(confirmPasswordInput, 'testpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        body: {
          username: 'testuser',
          password: 'testpassword',
          email: 'test@example.com',
        },
        signal: expect.any(AbortSignal),
      });
    });
  });

  it('should call handleSuccess on successful registration', async () => {
    const user = userEvent.setup();
    const successfulMutation = {
      ...mockRegisterMutation,
      isSuccess: true,
      data: { responseData: ['Registration successful'], responseErrors: null },
    } as unknown as useRegisterMutationType;

    render(
      <RegisterForm
        registerMutation={successfulMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const emailInput = screen.getByLabelText(/Email/);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', { name: 'Register' });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'testpassword');
    await user.type(confirmPasswordInput, 'testpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockHandleSuccess).toHaveBeenCalled();
    });
  });

  it('should display error when mutation fails', async () => {
    const user = userEvent.setup();
    const mockMutateAsyncReject = vi.fn().mockRejectedValue({
      responseData: null,
      responseErrors: {
        nonFieldErrors: ['Username already exists'],
        email: null,
        password: null,
        username: null,
      },
    });

    const errorMutation = {
      ...mockRegisterMutation,
      mutateAsync: mockMutateAsyncReject,
    } as unknown as useRegisterMutationType;

    render(
      <RegisterForm
        registerMutation={errorMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const emailInput = screen.getByLabelText(/Email/);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', { name: 'Register' });

    await user.type(usernameInput, 'existinguser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'testpassword');
    await user.type(confirmPasswordInput, 'testpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });

    expect(mockHandleSuccess).not.toHaveBeenCalled();
  });

  it('should validate password confirmation', async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const emailInput = screen.getByLabelText(/Email/);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', { name: 'Register' });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(submitButton);

    // Should not call handleSubmit if passwords don't match
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

    render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const form = screen
      .getByRole('button', { name: 'Register' })
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
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const emailInput = screen.getByLabelText(/Email/);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);

    expect(usernameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(confirmPasswordInput).toHaveAttribute('required');
  });

  it('should render with proper form structure', () => {
    const { container } = render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
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
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const submitButton = screen.getByRole('button', { name: 'Register' });
    await user.click(submitButton);

    // Form should handle validation internally and not call handleSubmit
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const emailInput = screen.getByLabelText(/Email/);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', { name: 'Register' });

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'testpassword');
    await user.type(confirmPasswordInput, 'testpassword');
    await user.click(submitButton);

    // Should not call handleSubmit if email is invalid
    await waitFor(
      () => {
        expect(mockMutateAsync).not.toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm
        registerMutation={mockRegisterMutation}
        handleSuccess={mockHandleSuccess}
      />,
    );

    const usernameInput = screen.getByLabelText(/Username/);
    const emailInput = screen.getByLabelText(/Email/);
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/);
    const submitButton = screen.getByRole('button', { name: 'Register' });

    // Tab navigation should work
    await user.tab();
    expect(usernameInput).toHaveFocus();

    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(confirmPasswordInput).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();
  });
});
