import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
};

const mockUserNoAvatar = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  avatar: '',
};

// Mock component with sidebar context
function MockNavUser({ user }: { user: typeof mockUser }) {
  return (
    <SidebarProvider>
      <div className="border rounded-lg p-4 bg-sidebar min-w-64">
        <NavUser user={user} />
      </div>
    </SidebarProvider>
  );
}

const meta = {
  title: 'Layout/NavUser',
  component: MockNavUser,
  parameters: {
    docs: {
      description: {
        component:
          'User navigation component that displays user information with a dropdown menu for account actions, billing, notifications, and sign out.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      description: 'User object containing name, email, and avatar',
    },
  },
} satisfies Meta<typeof MockNavUser>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const WithoutAvatar: Story = {
  args: {
    user: mockUserNoAvatar,
  },
  parameters: {
    docs: {
      description: {
        story:
          'User navigation component when user has no avatar image - shows fallback initials.',
      },
    },
  },
};

export const LongName: Story = {
  args: {
    user: {
      name: 'Christopher Alexander Montgomery',
      email: 'christopher.montgomery@verylongdomainname.com',
      avatar: mockUser.avatar,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'User navigation component with long name and email that demonstrates text truncation.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    user: mockUser,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'User navigation component on mobile viewport with adapted dropdown positioning.',
      },
    },
  },
};
