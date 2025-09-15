import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';

const meta: Meta<typeof AppSidebar> = {
  title: 'Components/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen">
        <SidebarProvider>
          <Story />
        </SidebarProvider>
        <div className="flex-1 p-4 bg-background">
          <p className="text-muted-foreground">Main content area</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Collapsed: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="flex h-screen">
        <SidebarProvider defaultOpen={false}>
          <Story />
        </SidebarProvider>
        <div className="flex-1 p-4 bg-background">
          <p className="text-muted-foreground">
            Main content area with collapsed sidebar
          </p>
        </div>
      </div>
    ),
  ],
};

export const WithoutFooter: Story = {
  args: {},
  render: (args) => (
    <AppSidebar {...args}>
      {/* Override to show sidebar without footer */}
    </AppSidebar>
  ),
};
