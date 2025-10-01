import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { useResetPasswordMutationType } from '@/services/users.service';
import { ResetPasswordPage } from './reset-pw.page';

// Mock the users service
vi.mock('@/services/users.service', () => ({
  useResetPasswordMutation: vi.fn(),
}));

// Mock the navigation hook
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

const mockUseResetPasswordMutation = vi.mocked(
  await import('@/services/users.service'),
).useResetPasswordMutation;
const mockUseNavigate = vi.mocked(
  await import('@tanstack/react-router'),
).useNavigate;

// Mock navigate function
const mockNavigate = vi.fn();
mockUseNavigate.mockReturnValue(mockNavigate);

describe('ResetPasswordPage', () => {
  const createMockMutation = (
    overrides?: Partial<useResetPasswordMutationType>,
  ): useResetPasswordMutationType =>
    ({
      mutate: vi.fn(),
      mutateAsync: vi.fn().mockResolvedValue({}),
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

  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseResetPasswordMutation.mockReturnValue(createMockMutation());
  });

  it('should render reset password form', () => {
    render(<ResetPasswordPage />);

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send reset email' }),
    ).toBeInTheDocument();
  });

  it('should call mutateAsync when form is submitted', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    mockUseResetPasswordMutation.mockReturnValue(
      createMockMutation({ mutateAsync: mockMutateAsync }),
    );

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        body: { email: 'test@example.com' },
        signal: expect.any(AbortSignal),
      });
    });
  });

  it('should navigate to login page on successful reset', async () => {
    const mockData = { responseData: ['Email sent successfully'] };
    mockUseResetPasswordMutation.mockReturnValue(
      createMockMutation({
        mutateAsync: vi.fn().mockResolvedValue({}),
        isSuccess: true,
        data: mockData,
      }),
    );

    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
    });
  });

  it('should not navigate on failed reset', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockRejectedValue({
      responseErrors: { nonFieldErrors: ['Email not found'] },
    });
    mockUseResetPasswordMutation.mockReturnValue(
      createMockMutation({ mutateAsync: mockMutateAsync }),
    );

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'nonexistent@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
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

  it('should pass resetPasswordMutation to ResetPasswordForm', () => {
    render(<ResetPasswordPage />);

    // The resetPasswordMutation should be passed to ResetPasswordForm
    // We can verify this by checking that the form is rendered (which means props were passed correctly)
    expect(screen.getByText('Reset your password')).toBeInTheDocument();
  });

  it('should handle mutation call correctly', async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    mockUseResetPasswordMutation.mockReturnValue(
      createMockMutation({ mutateAsync: mockMutateAsync }),
    );

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    await user.type(emailInput, 'user@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        body: { email: 'user@example.com' },
        signal: expect.any(AbortSignal),
      });
    });
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
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    mockUseResetPasswordMutation.mockReturnValue(
      createMockMutation({ mutateAsync: mockMutateAsync }),
    );

    render(<ResetPasswordPage />);

    const emailInput = screen.getByLabelText(/Email/);
    const submitButton = screen.getByRole('button', {
      name: 'Send reset email',
    });

    // First submission
    await user.type(emailInput, 'test1@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        body: { email: 'test1@example.com' },
        signal: expect.any(AbortSignal),
      });
    });

    // Clear the mock and submit again
    mockMutateAsync.mockClear();
    mockNavigate.mockClear();

    await user.clear(emailInput);
    await user.type(emailInput, 'test2@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        body: { email: 'test2@example.com' },
        signal: expect.any(AbortSignal),
      });
    });
  });

  it('should handle async mutation correctly', async () => {
    const user = userEvent.setup();
    const mockData = { responseData: ['Email sent successfully'] };

    // Simulate async behavior
    const mockMutateAsync = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({}), 100);
        }),
    );

    mockUseResetPasswordMutation.mockReturnValue(
      createMockMutation({
        mutateAsync: mockMutateAsync,
        isSuccess: true,
        data: mockData,
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
        expect(mockMutateAsync).toHaveBeenCalledWith({
          body: { email: 'async@example.com' },
          signal: expect.any(AbortSignal),
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
