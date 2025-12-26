import {
  GalleryVerticalEnd,
  HardDrive,
  Home,
  Settings,
  Terminal,
} from 'lucide-react';
import type { SidebarData } from './sidebar-data.types';

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'Dorchestrator',
      logo: GalleryVerticalEnd,
      plan: 'Free Tier',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: Home,
        },
        {
          title: 'Devices',
          url: '/devices',
          icon: HardDrive,
        },
        {
          title: 'Commands',
          url: '/commands',
          icon: Terminal,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Organization Settings',
          url: '/organization/settings',
          icon: Settings,
        },
      ],
    },
  ],
};
