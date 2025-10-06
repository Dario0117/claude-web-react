import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LayoutProvider } from '@/context/layout-provider';
import { AppSidebar } from './app-sidebar';

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

function renderAppSidebar() {
  return render(
    <LayoutProvider>
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </LayoutProvider>,
  );
}

describe('AppSidebar', () => {
  it('should render sidebar', () => {
    const { container } = renderAppSidebar();

    const sidebar = container.querySelector('[data-slot="sidebar"]');
    expect(sidebar).toBeInTheDocument();
  });

  it('should render team switcher', () => {
    renderAppSidebar();

    expect(screen.getByText('Shadcn Admin')).toBeInTheDocument();
  });

  it('should render navigation groups', () => {
    renderAppSidebar();

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
  });

  it('should render navigation items from General group', () => {
    renderAppSidebar();

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Drafts')).toBeInTheDocument();
    expect(screen.getByText('Queued sessions')).toBeInTheDocument();
  });

  it('should render navigation items from Integrations group', () => {
    renderAppSidebar();

    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
  });

  it('should render badges on navigation items', () => {
    renderAppSidebar();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render sidebar rail', () => {
    const { container } = renderAppSidebar();

    const rail = container.querySelector('[data-slot="sidebar-rail"]');
    expect(rail).toBeInTheDocument();
  });

  it('should render all team options', () => {
    renderAppSidebar();

    expect(screen.getByText('Shadcn Admin')).toBeInTheDocument();
  });

  it('should have correct sidebar structure', () => {
    const { container } = renderAppSidebar();

    const sidebar = container.querySelector('[data-slot="sidebar"]');
    const header = sidebar?.querySelector('[data-slot="sidebar-header"]');
    const content = sidebar?.querySelector('[data-slot="sidebar-content"]');

    expect(header).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it('should render navigation group icons', () => {
    renderAppSidebar();

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      const icon = link.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});
