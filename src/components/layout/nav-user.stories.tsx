import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

const meta = {
  title: 'Layout/NavUser',
  component: NavUser,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="w-[280px]">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof NavUser>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://github.com/shadcn.png',
    },
  },
};

export const WithInitials: Story = {
  args: {
    user: {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      avatar: '',
    },
  },
};

export const LongName: Story = {
  args: {
    user: {
      name: 'Alexander Christopher Wellington',
      email: 'alexander.wellington@verylongdomainname.com',
      avatar: 'https://github.com/shadcn.png',
    },
  },
};
