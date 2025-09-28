import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './app';

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
    context: { authentication: { user: undefined } };
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

describe('App', () => {
  it('renders RouterProvider with router instance', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('router-provider')).toBeInTheDocument();
  });

  it('passes correct authentication context to RouterProvider', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('auth-context')).toHaveTextContent('{}');
  });

  it('has consistent authentication context structure', () => {
    const { getByTestId } = render(<App />);

    const authContext = getByTestId('auth-context');
    expect(authContext).toHaveTextContent('{}');
  });

  it('creates router with proper configuration', () => {
    const { getByTestId } = render(<App />);

    // The router should be created and RouterProvider should render
    expect(getByTestId('router-provider')).toBeInTheDocument();
    expect(getByTestId('auth-context')).toBeInTheDocument();
  });

  it('maintains static authentication context', () => {
    const { getByTestId, rerender } = render(<App />);

    expect(getByTestId('auth-context')).toHaveTextContent('{}');

    // Re-render should maintain the same context
    rerender(<App />);

    expect(getByTestId('auth-context')).toHaveTextContent('{}');
  });
});
