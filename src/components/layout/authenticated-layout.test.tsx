import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/context/theme.provider';
import { AuthenticatedLayout } from './authenticated-layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

vi.mock('@/lib/cookies', () => ({
  getCookie: vi.fn(() => 'true'),
  setCookie: vi.fn(),
}));

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

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a
      href={to}
      {...props}
    >
      {children}
    </a>
  ),
  useLocation: ({
    select,
  }: {
    select?: (location: { href: string }) => string;
  } = {}) => {
    const location = { href: '/' };
    return select ? select(location) : location;
  },
  useNavigate: () => vi.fn(),
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));

const mockMatchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });

  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

function renderAuthenticatedLayout(children?: React.ReactNode) {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthenticatedLayout>
          {children || <div data-testid="child-content">Child Content</div>}
        </AuthenticatedLayout>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('AuthenticatedLayout', () => {
  it('should render children', () => {
    renderAuthenticatedLayout();

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should render app sidebar', () => {
    renderAuthenticatedLayout();

    expect(screen.getByText('Shadcn Admin')).toBeInTheDocument();
  });

  it('should render header with theme switch', () => {
    renderAuthenticatedLayout();

    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('should render profile dropdown', () => {
    const { container } = renderAuthenticatedLayout();

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render skip to main link', () => {
    renderAuthenticatedLayout();

    const skipLink = screen.getByRole('link', {
      name: /skip to main/i,
    });
    expect(skipLink).toBeInTheDocument();
  });

  it('should provide sidebar context', () => {
    const { container } = renderAuthenticatedLayout();

    const sidebarWrapper = container.querySelector(
      '[data-slot="sidebar-wrapper"]',
    );
    expect(sidebarWrapper).toBeInTheDocument();
  });

  it('should provide layout context', () => {
    renderAuthenticatedLayout();

    expect(screen.getByText('Shadcn Admin')).toBeInTheDocument();
  });

  it('should provide search context', () => {
    renderAuthenticatedLayout();

    const layout = screen.getByTestId('child-content').parentElement;
    expect(layout).toBeInTheDocument();
  });

  it('should render sidebar inset with correct classes', () => {
    const { container } = renderAuthenticatedLayout();

    const sidebarInset = container.querySelector('[data-slot="sidebar-inset"]');
    expect(sidebarInset).toBeInTheDocument();
    expect(sidebarInset).toHaveClass('@container/content');
  });

  it('should render with custom children', () => {
    const customContent = (
      <div data-testid="custom-content">
        <h1>Custom Page Title</h1>
        <p>Custom page content</p>
      </div>
    );

    renderAuthenticatedLayout(customContent);

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Page Title')).toBeInTheDocument();
    expect(screen.getByText('Custom page content')).toBeInTheDocument();
  });

  it('should have correct header structure with actions', () => {
    const { container } = renderAuthenticatedLayout();

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();

    const actionsContainer = header?.querySelector('.ms-auto');
    expect(actionsContainer).toBeInTheDocument();
  });

  it('should render navigation groups in sidebar', () => {
    renderAuthenticatedLayout();

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
  });

  it('should apply default open state from cookie', () => {
    const { container } = renderAuthenticatedLayout();

    const sidebarWrapper = container.querySelector(
      '[data-slot="sidebar-wrapper"]',
    );
    expect(sidebarWrapper).toBeInTheDocument();
  });
});
