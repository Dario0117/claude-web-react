import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Code,
  FilePenLine,
  FolderKanban,
  Layers,
  MonitorSmartphone,
} from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NavGroup } from './nav-group';

const meta = {
  title: 'Layout/NavGroup',
  component: NavGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="w-[280px] rounded-md border">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof NavGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'General',
    items: [
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
    ],
  },
};

export const WithoutIcons: Story = {
  args: {
    title: 'Quick Links',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
      },
      {
        title: 'Settings',
        url: '/settings',
      },
      {
        title: 'Profile',
        url: '/profile',
        badge: '1',
      },
    ],
  },
};

export const Integrations: Story = {
  args: {
    title: 'Integrations',
    items: [
      {
        title: 'Devices',
        url: '/devices',
        icon: MonitorSmartphone,
      },
      {
        title: 'API',
        url: '/api',
        icon: Code,
      },
    ],
  },
};

export const WithCollapsible: Story = {
  args: {
    title: 'Documentation',
    items: [
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
          {
            title: 'Quick Start',
            url: '/docs/quick-start',
          },
        ],
      },
      {
        title: 'Components',
        icon: Layers,
        items: [
          {
            title: 'Button',
            url: '/docs/components/button',
          },
          {
            title: 'Input',
            url: '/docs/components/input',
          },
          {
            title: 'Card',
            url: '/docs/components/card',
          },
        ],
      },
    ],
  },
};
