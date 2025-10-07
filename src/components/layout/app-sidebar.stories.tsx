import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LayoutProvider } from '@/context/layout.provider';
import { AppSidebar } from './app-sidebar';

const meta = {
  title: 'Layout/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LayoutProvider>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <Story />
            <main className="flex-1 p-8">
              <h1 className="text-3xl font-bold">Main Content</h1>
              <p className="mt-4 text-muted-foreground">
                This is the main content area. The sidebar appears on the left
                with navigation groups and team switcher.
              </p>
            </main>
          </div>
        </SidebarProvider>
      </LayoutProvider>
    ),
  ],
} satisfies Meta<typeof AppSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = {
  decorators: [
    (Story) => (
      <LayoutProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="flex h-screen w-full">
            <Story />
            <main className="flex-1 p-8">
              <h1 className="text-3xl font-bold">Main Content</h1>
              <p className="mt-4 text-muted-foreground">
                The sidebar is collapsed by default. Click the trigger to expand
                it.
              </p>
            </main>
          </div>
        </SidebarProvider>
      </LayoutProvider>
    ),
  ],
};
