import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthenticatedLayout } from './authenticated-layout';

const meta = {
  title: 'Layout/AuthenticatedLayout',
  component: AuthenticatedLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthenticatedLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AuthenticatedLayout>
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </AuthenticatedLayout>
  ),
};

export const WithContent: Story = {
  render: () => (
    <AuthenticatedLayout>
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="rounded-lg border p-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your authenticated dashboard. This layout includes a
            sidebar, header with theme switcher and profile dropdown.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Card 1</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Some content here
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Card 2</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Some content here
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Card 3</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Some content here
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  ),
};
