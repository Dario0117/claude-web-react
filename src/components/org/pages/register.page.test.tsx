import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { RegisterPage } from './register.page';

interface LinkProps {
  children: React.ReactNode;
  to: string;
  [key: string]: unknown;
}

declare global {
  var __testHandleSuccess: ((data: unknown) => void) | undefined;
}

// Mock the navigation hook
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  Link: ({ children, to, ...props }: LinkProps) => (
    <a
      href={to}
      {...props}
    >
      {children}
    </a>
  ),
}));

// Mock the RegisterForm to capture the handleSuccess callback
vi.mock('@/components/org/forms/register.form', () => ({
  RegisterForm: ({
    handleSuccess,
  }: {
    handleSuccess: (data: unknown) => void;
    registerMutation: unknown;
  }) => {
    // Store the callback so we can test it
    globalThis.__testHandleSuccess = handleSuccess;
    return <div data-testid="mock-register-form">Mock Register Form</div>;
  },
}));

const mockUseNavigate = vi.mocked(
  await import('@tanstack/react-router'),
).useNavigate;

const mockNavigate = vi.fn();
mockUseNavigate.mockReturnValue(mockNavigate);

// Test wrapper with QueryClient
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render register form', () => {
    render(<RegisterPage />, { wrapper: TestWrapper });

    // Check that the register form is rendered
    // The exact elements depend on the RegisterForm implementation
    // Since we're testing the page structure, we check for the section
    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(
      'flex',
      'min-h-svh',
      'w-full',
      'items-center',
      'justify-center',
      'p-6',
      'md:p-10',
    );
  });

  it('should have proper page structure', () => {
    const { container } = render(<RegisterPage />, { wrapper: TestWrapper });

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();

    const wrapper = container.querySelector('.w-full.max-w-sm');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render without errors when useAuth is available', () => {
    render(<RegisterPage />, { wrapper: TestWrapper });

    // The component should render without errors
    expect(document.querySelector('section')).toBeInTheDocument();
  });

  it('should have accessibility structure', () => {
    render(<RegisterPage />, { wrapper: TestWrapper });

    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('should call navigate with /login when handleSuccess is invoked', () => {
    mockNavigate.mockClear();

    render(<RegisterPage />, { wrapper: TestWrapper });

    // Verify that the mock form is rendered
    expect(screen.getByTestId('mock-register-form')).toBeInTheDocument();

    // Get the captured handleSuccess callback
    const handleSuccess = globalThis.__testHandleSuccess;
    expect(handleSuccess).toBeDefined();

    // Call the handleSuccess callback with mock data
    handleSuccess?.(undefined);

    // Verify that navigate was called with the correct arguments
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' });
  });
});
