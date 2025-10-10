import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from './button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3 font-mono text-sm">
        <h4 className="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-9 p-0"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        @radix-ui/primitives
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const WithContent: Story = {
  render: () => (
    <Collapsible className="w-[400px] space-y-2">
      <div className="flex items-center justify-between rounded-md border p-4">
        <h4 className="text-sm font-semibold">
          FAQ: Can I use this in my project?
        </h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="rounded-md border p-4">
        <p className="text-sm text-muted-foreground">
          Yes! This component is built using Radix UI primitives and can be used
          in your projects. You can customize it to match your design system.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible
      defaultOpen
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
        <h4 className="text-sm font-semibold">Expanded by default</h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-9 p-0"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        Item 1
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          Item 2
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          Item 3
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          Item 4
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
