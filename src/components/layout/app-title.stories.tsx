import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppTitle } from './app-title';

// Mock component to provide required sidebar context
function MockAppTitle() {
  return (
    <SidebarProvider>
      <div className="border rounded-lg p-4 bg-sidebar">
        <AppTitle />
      </div>
    </SidebarProvider>
  );
}

const meta = {
  title: 'Layout/AppTitle',
  component: MockAppTitle,
  parameters: {
    docs: {
      description: {
        component:
          'Application title component with sidebar toggle functionality and navigation link.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MockAppTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'App title on mobile viewport showing the toggle functionality.',
      },
    },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'App title on desktop viewport with menu toggle.',
      },
    },
  },
};
