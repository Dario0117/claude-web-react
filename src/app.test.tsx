import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type { User } from '@/types/auth';
import App from './app';

// Mock the authentication store
vi.mock('@/stores/authentication.store', () => ({
  useAuthenticationStore: vi.fn(),
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

const mockUseAuthenticationStore = vi.mocked(useAuthenticationStore);

describe('App', () => {
  it('renders RouterProvider with authentication context when user is logged in', () => {
    const mockUser: User = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };

    mockUseAuthenticationStore.mockReturnValue(mockUser);

    const { getByTestId } = render(<App />);

    expect(getByTestId('router-provider')).toBeInTheDocument();
    expect(getByTestId('auth-context')).toHaveTextContent(
      JSON.stringify({ isLoggedIn: true }),
    );
  });

  it('renders RouterProvider with authentication context when user is not logged in', () => {
    mockUseAuthenticationStore.mockReturnValue(undefined);

    const { getByTestId } = render(<App />);

    expect(getByTestId('router-provider')).toBeInTheDocument();
    expect(getByTestId('auth-context')).toHaveTextContent(
      JSON.stringify({ isLoggedIn: false }),
    );
  });

  it('passes correct authentication state to router context when logged in', () => {
    const mockUser: User = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };

    mockUseAuthenticationStore.mockReturnValue(mockUser);

    const { getByTestId } = render(<App />);

    const authContext = getByTestId('auth-context');
    expect(authContext).toHaveTextContent('{"isLoggedIn":true}');
  });

  it('updates context when authentication state changes', () => {
    mockUseAuthenticationStore.mockReturnValue(undefined);

    const { getByTestId, rerender } = render(<App />);

    expect(getByTestId('auth-context')).toHaveTextContent(
      JSON.stringify({ isLoggedIn: false }),
    );

    // Update the mock to return a user
    const mockUser: User = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };
    mockUseAuthenticationStore.mockReturnValue(mockUser);

    rerender(<App />);

    expect(getByTestId('auth-context')).toHaveTextContent(
      JSON.stringify({ isLoggedIn: true }),
    );
  });

  it('uses useAuthenticationStore correctly', () => {
    mockUseAuthenticationStore.mockClear();
    mockUseAuthenticationStore.mockReturnValue(undefined);

    render(<App />);

    expect(mockUseAuthenticationStore).toHaveBeenCalledTimes(1);
  });
});
