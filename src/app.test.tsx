import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './app';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  createRouter: vi.fn(() => ({
    // Mock router object
    subscribe: vi.fn(),
    load: vi.fn(),
    navigate: vi.fn(),
  })),
  RouterProvider: ({
    context,
  }: {
    context: { authentication: { isLoggedIn: boolean } };
  }) => (
    <div data-testid="router-provider">
      <div data-testid="auth-context">
        {JSON.stringify(context.authentication)}
      </div>
    </div>
  ),
}));

// Mock the generated route tree
vi.mock('./routeTree.gen', () => ({
  routeTree: {},
}));

const mockUseAuth = vi.mocked(await import('@/hooks/useAuth')).useAuth;

describe('App', () => {
  it('renders RouterProvider with authentication context when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    const { getByTestId } = render(<App />);

    expect(getByTestId('router-provider')).toBeInTheDocument();
    expect(getByTestId('auth-context')).toHaveTextContent(
      JSON.stringify({ isLoggedIn: true }),
    );
  });

  it('renders RouterProvider with authentication context when user is not logged in', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    const { getByTestId } = render(<App />);

    expect(getByTestId('router-provider')).toBeInTheDocument();
    expect(getByTestId('auth-context')).toHaveTextContent(
      JSON.stringify({ isLoggedIn: false }),
    );
  });

  it('passes correct authentication state to router context', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    const { getByTestId } = render(<App />);

    const authContext = getByTestId('auth-context');
    expect(authContext).toHaveTextContent('{"isLoggedIn":true}');
  });

  it('updates context when authentication state changes', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    const { getByTestId, rerender } = render(<App />);

    expect(getByTestId('auth-context')).toHaveTextContent(
      JSON.stringify({ isLoggedIn: false }),
    );

    // Update the mock to return different state
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    rerender(<App />);

    expect(getByTestId('auth-context')).toHaveTextContent(
      JSON.stringify({ isLoggedIn: true }),
    );
  });

  it('uses useAuth hook correctly', () => {
    mockUseAuth.mockClear();
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });

    render(<App />);

    expect(mockUseAuth).toHaveBeenCalledTimes(1);
  });
});
