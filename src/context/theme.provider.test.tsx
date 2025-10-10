import { act, render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from './theme.provider';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

// Test component that uses the theme hook
function TestComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button
        type="button"
        data-testid="set-light"
        onClick={() => setTheme('light')}
      >
        Set Light
      </button>
      <button
        type="button"
        data-testid="set-dark"
        onClick={() => setTheme('dark')}
      >
        Set Dark
      </button>
      <button
        type="button"
        data-testid="set-system"
        onClick={() => setTheme('system')}
      >
        Set System
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  const originalDocumentElement = document.documentElement;

  beforeEach(() => {
    // Reset mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    matchMediaMock.mockClear();

    // Mock document.documentElement
    const mockElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    };
    Object.defineProperty(document, 'documentElement', {
      value: mockElement,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original documentElement
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true,
    });
  });

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Test content</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('uses default theme when no localStorage value exists', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('uses theme from localStorage when available', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('applies light theme class to document element', () => {
    localStorageMock.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'light',
      'dark',
    );
    expect(document.documentElement.classList.add).toHaveBeenCalledWith(
      'light',
    );
  });

  it('applies dark theme class to document element', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'light',
      'dark',
    );
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('applies system theme based on media query preference (dark)', () => {
    localStorageMock.getItem.mockReturnValue('system');
    matchMediaMock.mockReturnValue({ matches: true });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'light',
      'dark',
    );
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('applies system theme based on media query preference (light)', () => {
    localStorageMock.getItem.mockReturnValue('system');
    matchMediaMock.mockReturnValue({ matches: false });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'light',
      'dark',
    );
    expect(document.documentElement.classList.add).toHaveBeenCalledWith(
      'light',
    );
  });

  it('updates theme and saves to localStorage when setTheme is called', () => {
    localStorageMock.getItem.mockReturnValue('light');

    render(
      <ThemeProvider storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>,
    );

    const setDarkButton = screen.getByTestId('set-dark');

    act(() => {
      setDarkButton.click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-theme', 'dark');
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('uses custom storage key', () => {
    const customKey = 'my-custom-theme-key';
    localStorageMock.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider storageKey={customKey}>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith(customKey);
  });

  it('updates document classes when theme changes', () => {
    localStorageMock.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const setDarkButton = screen.getByTestId('set-dark');

    act(() => {
      setDarkButton.click();
    });

    // Should be called twice: once on initial render, once on theme change
    expect(document.documentElement.classList.remove).toHaveBeenCalledTimes(2);
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });
});

describe('useTheme', () => {
  it('provides default behavior when used outside ThemeProvider', () => {
    // Since the context provides default values, it won't throw
    // Instead test that it provides the default theme
    const TestHookComponent = () => {
      const { theme, setTheme } = useTheme();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <button
            type="button"
            onClick={() => setTheme('dark')}
          >
            Set Dark
          </button>
        </div>
      );
    };

    render(<TestHookComponent />);

    // Should use default theme value when outside provider
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });

  it('returns theme context when used within ThemeProvider', () => {
    localStorageMock.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });
});
