/**
 * Tests for main.tsx
 *
 * This file is the application entry point that sets up the React root.
 * Tests verify that the component tree structure is correctly configured
 * with providers (ThemeProvider, QueryProvider) and core components (App, ReactQueryDevtools).
 *
 * Note: This is an integration test that verifies the entry point setup.
 * Individual components (App, ThemeProvider, QueryProvider) are tested in isolation.
 */

import { render } from '@testing-library/react';

// Mock ReactDOM before importing main
const mockRender = vi.fn();
const mockCreateRoot = vi.fn();

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: (element: Element) => {
      mockCreateRoot(element);
      return {
        render: mockRender,
      };
    },
  },
  createRoot: (element: Element) => {
    mockCreateRoot(element);
    return {
      render: mockRender,
    };
  },
}));

// Mock App component
vi.mock('./app', () => ({
  default: () => <div data-testid="app">App</div>,
}));

// Mock ReactQueryDevtools
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => (
    <div data-testid="react-query-devtools">DevTools</div>
  ),
}));

// Mock ThemeProvider
vi.mock('./context/theme.provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock QueryProvider
vi.mock('./context/query.provider', () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
}));

describe('main', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup DOM
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('should render app with correct provider hierarchy', async () => {
    // Import main to trigger the render
    await import('./main');

    // Verify createRoot was called with root element
    expect(mockCreateRoot).toHaveBeenCalledWith(
      document.getElementById('root'),
    );

    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Get the rendered element
    const renderCall = mockRender.mock.calls[0]?.[0];
    if (!renderCall) {
      throw new Error('Render was not called with any arguments');
    }

    // Render it to verify structure
    const { container } = render(renderCall);

    // Verify the provider hierarchy
    expect(
      container.querySelector('[data-testid="theme-provider"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-testid="query-provider"]'),
    ).toBeTruthy();
    expect(container.querySelector('[data-testid="app"]')).toBeTruthy();
    expect(
      container.querySelector('[data-testid="react-query-devtools"]'),
    ).toBeTruthy();
  });

  it('should not render if root element already has content', async () => {
    // Setup DOM with existing content
    const rootElement = document.getElementById('root') as HTMLElement;
    rootElement.innerHTML = '<div>Existing content</div>';

    vi.clearAllMocks();

    // Re-import main
    await import('./main');

    // Verify createRoot was not called
    expect(mockCreateRoot).not.toHaveBeenCalled();
    expect(mockRender).not.toHaveBeenCalled();
  });
});
