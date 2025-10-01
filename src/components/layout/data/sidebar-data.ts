import {
  AudioWaveform,
  Code,
  Command,
  FilePenLine,
  FolderKanban,
  GalleryVerticalEnd,
  Layers,
  MonitorSmartphone,
} from 'lucide-react';
import type { SidebarData } from '../types';

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
    {
      title: 'Integrations',
      items: [
        {
          title: 'Devices',
          url: '/help-center',
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
