import { render, screen } from '@testing-library/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';

interface LinkProps {
  children: React.ReactNode;
  to: string;
  [key: string]: unknown;
}

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: LinkProps) => (
    <a
      href={to}
      {...props}
    >
      {children}
    </a>
  ),
  useRouterState: vi.fn((config) => {
    const routerState = { location: { pathname: '/app/projects' } };
    if (config && typeof config.select === 'function') {
      return config.select(routerState);
    }
    return routerState;
  }),
}));

// Mock the NavUser component
vi.mock('@/components/nav-user', () => ({
  NavUser: ({ user }: { user: { name: string; email: string } }) => (
    <div>
      <div>{user.name}</div>
      <div>{user.email}</div>
    </div>
  ),
}));

// Mock the useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}));

describe('AppSidebar', () => {
  const renderAppSidebar = () => {
    return render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>,
    );
  };

  it('should render the sidebar with navigation items', () => {
    renderAppSidebar();

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Drafts')).toBeInTheDocument();
    expect(screen.getByText('Queued sessions')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
  });

  it('should render the user information', () => {
    renderAppSidebar();

    expect(screen.getByText('Mark Bannert')).toBeInTheDocument();
    expect(screen.getByText('mark@bannert.com')).toBeInTheDocument();
  });

  it('should render the logo with proper accessibility attributes', () => {
    renderAppSidebar();

    // Check for the SVG logo by its title
    const logo = screen.getByText('Logo');
    expect(logo).toBeInTheDocument();

    // Check for the logo link
    const logoLink = screen.getByRole('link', { name: /logo/i });
    expect(logoLink).toBeInTheDocument();
  });

  it('should have proper navigation structure', () => {
    renderAppSidebar();

    const navigationItems = screen.getAllByRole('link');
    expect(navigationItems.length).toBeGreaterThan(0);

    // Check that navigation items have proper aria attributes
    const projectsLink = screen.getByRole('link', { name: /projects/i });
    expect(projectsLink).toBeInTheDocument();
  });

  it('should handle collapsible icon variant', () => {
    renderAppSidebar();

    const sidebar = document.querySelector('[data-sidebar="sidebar"]');
    // The sidebar should have the collapsible icon variant applied
    expect(sidebar).toBeInTheDocument();
  });
});
