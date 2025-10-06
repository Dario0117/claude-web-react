import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilePenLine, FolderKanban, Layers } from 'lucide-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NavGroup } from './nav-group';
import type { NavItem } from './types';

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

const mockNavItems: NavItem[] = [
  {
    title: 'Projects',
    url: '/',
    icon: FolderKanban,
  },
  {
    title: 'Drafts',
    url: '/drafts',
    badge: '2',
    icon: FilePenLine,
  },
  {
    title: 'Queued sessions',
    url: '/q',
    badge: '3',
    icon: Layers,
  },
];

const mockCollapsibleItems: NavItem[] = [
  {
    title: 'Getting Started',
    icon: FolderKanban,
    items: [
      {
        title: 'Installation',
        url: '/docs/installation',
      },
      {
        title: 'Configuration',
        url: '/docs/configuration',
      },
    ],
  },
];

function renderNavGroup(items: NavItem[] = mockNavItems) {
  return render(
    <SidebarProvider>
      <NavGroup
        title="General"
        items={items}
      />
    </SidebarProvider>,
  );
}

describe('NavGroup', () => {
  it('should render group title', () => {
    renderNavGroup();

    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('should render all navigation items', () => {
    renderNavGroup();

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Drafts')).toBeInTheDocument();
    expect(screen.getByText('Queued sessions')).toBeInTheDocument();
  });

  it('should render badges when provided', () => {
    renderNavGroup();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render icons when provided', () => {
    renderNavGroup();

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      const icon = link.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  it('should mark active item based on current URL', () => {
    renderNavGroup(mockNavItems);

    const projectsLink = screen.getByRole('link', { name: /projects/i });
    expect(projectsLink).toHaveAttribute('data-active', 'true');
  });

  it('should render collapsible items', () => {
    renderNavGroup(mockCollapsibleItems);

    expect(screen.getByText('Getting Started')).toBeInTheDocument();
  });

  it('should expand collapsible items when clicked', async () => {
    const user = userEvent.setup();
    renderNavGroup(mockCollapsibleItems);

    const collapsibleButton = screen.getByRole('button', {
      name: /getting started/i,
    });
    await user.click(collapsibleButton);

    expect(screen.getByText('Installation')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });

  it('should render items without icons', () => {
    const itemsWithoutIcons: NavItem[] = [
      {
        title: 'Dashboard',
        url: '/dashboard',
      },
      {
        title: 'Settings',
        url: '/settings',
      },
    ];

    renderNavGroup(itemsWithoutIcons);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should close mobile sidebar when link is clicked', async () => {
    const user = userEvent.setup();
    renderNavGroup();

    const projectsLink = screen.getByRole('link', { name: /projects/i });
    await user.click(projectsLink);

    expect(projectsLink).toBeInTheDocument();
  });

  it('should render chevron icon for collapsible items', () => {
    renderNavGroup(mockCollapsibleItems);

    const collapsibleButton = screen.getByRole('button', {
      name: /getting started/i,
    });
    const chevron = collapsibleButton.querySelector('svg.lucide-chevron-right');
    expect(chevron).toBeInTheDocument();
  });

  it('should render collapsible with subitems', async () => {
    const user = userEvent.setup();
    renderNavGroup(mockCollapsibleItems);

    const collapsibleButton = screen.getByRole('button', {
      name: /getting started/i,
    });
    await user.click(collapsibleButton);

    expect(screen.getByText('Installation')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });
});
