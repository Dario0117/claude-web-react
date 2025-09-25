import { describe, expect, it } from 'vitest';
import type { NavGroup, NavItem, SidebarData } from '../types';
import { sidebarData } from './sidebar-data';

describe('Sidebar Data', () => {
  it('should have valid structure', () => {
    expect(sidebarData).toBeDefined();
    expect(sidebarData).toHaveProperty('user');
    expect(sidebarData).toHaveProperty('teams');
    expect(sidebarData).toHaveProperty('navGroups');
  });

  it('should have valid user data', () => {
    const { user } = sidebarData;

    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('avatar');

    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.avatar).toBe('string');

    expect(user.name).toBe('satnaing');
    expect(user.email).toBe('satnaingdev@gmail.com');
    expect(user.avatar).toBe('/avatars/shadcn.jpg');
  });

  it('should have valid teams data', () => {
    const { teams } = sidebarData;

    expect(Array.isArray(teams)).toBe(true);
    expect(teams.length).toBeGreaterThan(0);

    teams.forEach((team) => {
      expect(team).toHaveProperty('name');
      expect(team).toHaveProperty('logo');
      expect(team).toHaveProperty('plan');

      expect(typeof team.name).toBe('string');
      expect(team.logo).toBeDefined();
      expect(typeof team.plan).toBe('string');
    });
  });

  it('should have expected teams', () => {
    const { teams } = sidebarData;

    expect(teams).toHaveLength(3);
    expect(teams[0]?.name).toBe('Shadcn Admin');
    expect(teams[0]?.plan).toBe('Vite + ShadcnUI');
    expect(teams[1]?.name).toBe('Acme Inc');
    expect(teams[1]?.plan).toBe('Enterprise');
    expect(teams[2]?.name).toBe('Acme Corp.');
    expect(teams[2]?.plan).toBe('Startup');
  });

  it('should have valid nav groups structure', () => {
    const { navGroups } = sidebarData;

    expect(Array.isArray(navGroups)).toBe(true);
    expect(navGroups.length).toBeGreaterThan(0);

    navGroups.forEach((group: NavGroup) => {
      expect(group).toHaveProperty('title');
      expect(group).toHaveProperty('items');
      expect(typeof group.title).toBe('string');
      expect(Array.isArray(group.items)).toBe(true);
    });
  });

  it('should have expected nav groups', () => {
    const { navGroups } = sidebarData;

    expect(navGroups).toHaveLength(3);
    expect(navGroups[0]?.title).toBe('General');
    expect(navGroups[1]?.title).toBe('Pages');
    expect(navGroups[2]?.title).toBe('Other');
  });

  it('should have valid nav items in General group', () => {
    const generalGroup = sidebarData.navGroups[0];
    if (!generalGroup) {
      return;
    }

    expect(generalGroup.items).toHaveLength(5);

    // Test Dashboard item
    const dashboardItem = generalGroup.items[0];
    if (!dashboardItem) {
      return;
    }
    expect(dashboardItem.title).toBe('Dashboard');
    expect('url' in dashboardItem && dashboardItem.url).toBe('/');
    expect(dashboardItem.icon).toBeDefined();

    // Test Chats item with badge
    const chatsItem = generalGroup.items[3];
    if (!chatsItem) {
      return;
    }
    expect(chatsItem.title).toBe('Chats');
    expect('url' in chatsItem && chatsItem.url).toBe('/chats');
    expect(chatsItem.badge).toBe('3');
    expect(chatsItem.icon).toBeDefined();
  });

  it('should have valid collapsible nav items in Pages group', () => {
    const pagesGroup = sidebarData.navGroups[1];
    if (!pagesGroup) {
      return;
    }

    expect(pagesGroup.items).toHaveLength(2);

    // Test Auth collapsible item
    const authItem = pagesGroup.items[0];
    if (!authItem) {
      return;
    }
    expect(authItem.title).toBe('Auth');
    expect(authItem.icon).toBeDefined();
    expect('items' in authItem && authItem.items).toHaveLength(5);

    if ('items' in authItem && authItem.items) {
      expect(authItem.items[0]?.title).toBe('Sign In');
      expect(authItem.items[0]?.url).toBe('/sign-in');
    }

    // Test Errors collapsible item
    const errorsItem = pagesGroup.items[1];
    if (!errorsItem) {
      return;
    }
    expect(errorsItem.title).toBe('Errors');
    expect(errorsItem.icon).toBeDefined();
    expect('items' in errorsItem && errorsItem.items).toHaveLength(5);

    if ('items' in errorsItem && errorsItem.items) {
      expect(errorsItem.items[0]?.title).toBe('Unauthorized');
      expect(errorsItem.items[0]?.url).toBe('/errors/unauthorized');
      expect(errorsItem.items[0]?.icon).toBeDefined();
    }
  });

  it('should have valid nav items in Other group', () => {
    const otherGroup = sidebarData.navGroups[2];
    if (!otherGroup) {
      return;
    }

    expect(otherGroup.items).toHaveLength(2);

    // Test Settings collapsible item
    const settingsItem = otherGroup.items[0];
    if (!settingsItem) {
      return;
    }
    expect(settingsItem.title).toBe('Settings');
    expect(settingsItem.icon).toBeDefined();
    expect('items' in settingsItem && settingsItem.items).toHaveLength(5);

    // Test Help Center direct link
    const helpItem = otherGroup.items[1];
    if (!helpItem) {
      return;
    }
    expect(helpItem.title).toBe('Help Center');
    expect('url' in helpItem && helpItem.url).toBe('/help-center');
    expect(helpItem.icon).toBeDefined();
  });

  it('should have all required nav item properties', () => {
    const validateNavItem = (item: NavItem) => {
      expect(item).toHaveProperty('title');
      expect(typeof item.title).toBe('string');

      if ('url' in item) {
        // This is a NavLink
        expect(typeof item.url).toBe('string');
        expect(item.url?.length || 0).toBeGreaterThan(0);
      } else if ('items' in item) {
        // This is a NavCollapsible
        expect(Array.isArray(item.items)).toBe(true);
        expect(item.items.length).toBeGreaterThan(0);
        item.items.forEach((subItem) => {
          expect(subItem).toHaveProperty('title');
          expect(subItem).toHaveProperty('url');
          expect(typeof subItem.title).toBe('string');
          expect(typeof subItem.url).toBe('string');
        });
      }

      if (item.icon) {
        expect(item.icon).toBeDefined();
      }

      if (item.badge) {
        expect(typeof item.badge).toBe('string');
      }
    };

    sidebarData.navGroups.forEach((group) => {
      group.items.forEach(validateNavItem);
    });
  });

  it('should conform to SidebarData type', () => {
    // This test ensures the data structure matches the TypeScript type
    const typedData: SidebarData = sidebarData;
    expect(typedData).toBeDefined();
    expect(typedData.user).toBeDefined();
    expect(typedData.teams).toBeDefined();
    expect(typedData.navGroups).toBeDefined();
  });
});
