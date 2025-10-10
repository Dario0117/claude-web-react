import { render } from '@testing-library/react';
import App from './app';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  createRouter: vi.fn(() => ({
    // Mock router object
    subscribe: vi.fn(),
    load: vi.fn(),
    navigate: vi.fn(),
  })),
  RouterProvider: ({ context }: { context: { nothingYet: boolean } }) => (
    <div data-testid="router-provider">
      <div data-testid="context">{JSON.stringify(context)}</div>
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

  it('passes correct context to RouterProvider', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('context')).toHaveTextContent('{"nothingYet":false}');
  });

  it('has consistent context structure', () => {
    const { getByTestId } = render(<App />);

    const context = getByTestId('context');
    expect(context).toHaveTextContent('{"nothingYet":false}');
  });

  it('creates router with proper configuration', () => {
    const { getByTestId } = render(<App />);

    // The router should be created and RouterProvider should render
    expect(getByTestId('router-provider')).toBeInTheDocument();
    expect(getByTestId('context')).toBeInTheDocument();
  });

  it('maintains static context', () => {
    const { getByTestId, rerender } = render(<App />);

    expect(getByTestId('context')).toHaveTextContent('{"nothingYet":false}');

    // Re-render should maintain the same context
    rerender(<App />);

    expect(getByTestId('context')).toHaveTextContent('{"nothingYet":false}');
  });
});
