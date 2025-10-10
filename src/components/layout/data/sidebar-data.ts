import {
  AudioWaveform,
  Code,
  Command,
  FilePenLine,
  FolderKanban,
  GalleryVerticalEnd,
  House,
  Layers,
  MonitorSmartphone,
} from 'lucide-react';
import type { SidebarData } from './sidebar-data.d';

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Home',
          url: '/',
          icon: House,
        },
        {
          title: 'Projects',
          url: '/projects',
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
          url: '/queued-sessions',
          badge: '3',
          icon: Layers,
        },
      ],
    },
    {
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
  ],
};
