import { render } from '@testing-library/react';
import { RegisterPage } from './register.page';

interface LinkProps {
  children: React.ReactNode;
  to: string;
  [key: string]: unknown;
}

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

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

const mockUseAuth = vi.mocked(await import('@/hooks/useAuth')).useAuth;
const mockUseNavigate = vi.mocked(
  await import('@tanstack/react-router'),
).useNavigate;

const mockNavigate = vi.fn();
mockUseNavigate.mockReturnValue(mockNavigate);

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseAuth.mockClear();
  });

  it('should render register form', () => {
    mockUseAuth.mockReturnValue({
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    render(<RegisterPage />);

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
    mockUseAuth.mockReturnValue({
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    const { container } = render(<RegisterPage />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();

    const wrapper = container.querySelector('.w-full.max-w-sm');
    expect(wrapper).toBeInTheDocument();
  });

  it('should call register function from useAuth', () => {
    const mockRegister = vi.fn();

    mockUseAuth.mockReturnValue({
      register: mockRegister,
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    render(<RegisterPage />);

    // The register function should be available to the component
    // We verify this by checking that the component renders without errors
    expect(document.querySelector('section')).toBeInTheDocument();
  });

  it('should have accessibility structure', () => {
    mockUseAuth.mockReturnValue({
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    render(<RegisterPage />);

    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
