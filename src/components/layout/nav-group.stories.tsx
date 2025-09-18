import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, Home, Settings, ShoppingCart, Users } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NavGroup } from './nav-group';
import type { NavGroup as NavGroupType } from './types';

// Mock data for stories
const mockNavGroup: NavGroupType = {
  title: 'Main Navigation',
  items: [
    {
      title: 'Dashboard',
      url: '/',
      icon: Home,
    },
    {
      title: 'Users',
      url: '/users',
      icon: Users,
      badge: '12',
    },
    {
      title: 'Products',
      icon: ShoppingCart,
      items: [
        {
          title: 'All Products',
          url: '/products',
          icon: FileText,
        },
        {
          title: 'Categories',
          url: '/products/categories',
          badge: '5',
        },
        {
          title: 'Inventory',
          url: '/products/inventory',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ],
};

const mockSimpleNavGroup: NavGroupType = {
  title: 'Simple Navigation',
  items: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'About',
      url: '/about',
    },
    {
      title: 'Contact',
      url: '/contact',
      badge: 'New',
    },
  ],
};

// Mock component with sidebar context
function MockNavGroup({ navGroup }: { navGroup: NavGroupType }) {
  return (
    <SidebarProvider>
      <div className="border rounded-lg p-4 bg-sidebar min-w-64">
        <NavGroup {...navGroup} />
      </div>
    </SidebarProvider>
  );
}

const meta = {
  title: 'Layout/NavGroup',
  component: MockNavGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Navigation group component that displays a collection of navigation items with support for nested items, badges, and icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    navGroup: {
      description: 'Navigation group configuration object',
    },
  },
} satisfies Meta<typeof MockNavGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navGroup: mockNavGroup,
  },
};

export const SimpleGroup: Story = {
  args: {
    navGroup: mockSimpleNavGroup,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple navigation group with basic links and badges.',
      },
    },
  },
};

export const WithCollapsibleItems: Story = {
  args: {
    navGroup: {
      title: 'Administration',
      items: [
        {
          title: 'User Management',
          icon: Users,
          badge: '3',
          items: [
            {
              title: 'All Users',
              url: '/admin/users',
              badge: '125',
            },
            {
              title: 'Roles & Permissions',
              url: '/admin/roles',
            },
            {
              title: 'User Groups',
              url: '/admin/groups',
              badge: '8',
            },
          ],
        },
        {
          title: 'System Settings',
          icon: Settings,
          items: [
            {
              title: 'General',
              url: '/admin/settings/general',
            },
            {
              title: 'Security',
              url: '/admin/settings/security',
              badge: 'Important',
            },
            {
              title: 'Integrations',
              url: '/admin/settings/integrations',
            },
          ],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Navigation group with collapsible nested items and various badge types.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    navGroup: mockNavGroup,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Navigation group on mobile viewport with touch-friendly interface.',
      },
    },
  },
};
