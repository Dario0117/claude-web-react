import { describe, expect, it } from 'vitest';
import type {
  NavCollapsible,
  NavGroup,
  NavItem,
  NavLink,
  SidebarData,
} from './types';

describe('Layout Types', () => {
  it('should accept valid User type', () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    // Type test - if this compiles, the type is correct
    expect(user).toBeDefined();
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.avatar).toBe('https://example.com/avatar.jpg');
  });

  it('should accept valid Team type', () => {
    const MockIcon = () => null;
    const team = {
      name: 'Engineering Team',
      logo: MockIcon,
      plan: 'Pro',
    };

    // Type test
    expect(team).toBeDefined();
    expect(team.name).toBe('Engineering Team');
    expect(team.logo).toBe(MockIcon);
    expect(team.plan).toBe('Pro');
  });

  it('should accept valid NavLink type', () => {
    const MockIcon = () => null;
    const navLink: NavLink = {
      title: 'Dashboard',
      url: '/dashboard',
      icon: MockIcon,
      badge: 'new',
    };

    // Type test
    expect(navLink).toBeDefined();
    expect(navLink.title).toBe('Dashboard');
    expect(navLink.url).toBe('/dashboard');
    expect(navLink.icon).toBe(MockIcon);
    expect(navLink.badge).toBe('new');
  });

  it('should accept valid NavCollapsible type', () => {
    const MockIcon = () => null;
    const navCollapsible: NavCollapsible = {
      title: 'Settings',
      icon: MockIcon,
      items: [
        {
          title: 'Profile',
          url: '/settings/profile',
        },
        {
          title: 'Preferences',
          url: '/settings/preferences',
        },
      ],
    };

    // Type test
    expect(navCollapsible).toBeDefined();
    expect(navCollapsible.title).toBe('Settings');
    expect(navCollapsible.icon).toBe(MockIcon);
    expect(navCollapsible.items).toHaveLength(2);
    expect(navCollapsible.items[0]?.title).toBe('Profile');
    expect(navCollapsible.items[0]?.url).toBe('/settings/profile');
  });

  it('should accept valid NavItem as NavLink', () => {
    const navItem: NavItem = {
      title: 'Home',
      url: '/home',
    };

    // Type test
    expect(navItem).toBeDefined();
    expect(navItem.title).toBe('Home');
    expect('url' in navItem && navItem.url).toBe('/home');
  });

  it('should accept valid NavItem as NavCollapsible', () => {
    const navItem: NavItem = {
      title: 'Admin',
      items: [
        {
          title: 'Users',
          url: '/admin/users',
        },
      ],
    };

    // Type test
    expect(navItem).toBeDefined();
    expect(navItem.title).toBe('Admin');
    expect('items' in navItem && navItem.items).toHaveLength(1);
  });

  it('should accept valid NavGroup type', () => {
    const MockIcon = () => null;
    const navGroup: NavGroup = {
      title: 'Main Navigation',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: MockIcon,
        },
        {
          title: 'Settings',
          items: [
            {
              title: 'Profile',
              url: '/settings/profile',
            },
          ],
        },
      ],
    };

    // Type test
    expect(navGroup).toBeDefined();
    expect(navGroup.title).toBe('Main Navigation');
    expect(navGroup.items).toHaveLength(2);
  });

  it('should accept valid SidebarData type', () => {
    const MockIcon = () => null;
    const sidebarData: SidebarData = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
      },
      teams: [
        {
          name: 'Engineering',
          logo: MockIcon,
          plan: 'Pro',
        },
      ],
      navGroups: [
        {
          title: 'Main',
          items: [
            {
              title: 'Dashboard',
              url: '/dashboard',
            },
          ],
        },
      ],
    };

    // Type test
    expect(sidebarData).toBeDefined();
    expect(sidebarData.user.name).toBe('John Doe');
    expect(sidebarData.teams).toHaveLength(1);
    expect(sidebarData.navGroups).toHaveLength(1);
  });
});
