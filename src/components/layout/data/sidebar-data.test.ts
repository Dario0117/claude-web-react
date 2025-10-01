import { describe, expect, it } from 'vitest';
import type { NavGroup, NavItem, SidebarData } from '../types';
import { sidebarData } from './sidebar-data';

describe('Sidebar Data', () => {
  it('should have valid structure', () => {
    expect(sidebarData).toBeDefined();
    expect(sidebarData).toHaveProperty('teams');
    expect(sidebarData).toHaveProperty('navGroups');
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

    expect(navGroups).toHaveLength(2);
    expect(navGroups[0]?.title).toBe('General');
    expect(navGroups[1]?.title).toBe('Integrations');
  });

  it('should have valid nav items in General group', () => {
    const generalGroup = sidebarData.navGroups[0];
    if (!generalGroup) {
      return;
    }

    expect(generalGroup.items).toHaveLength(3);

    // Test Projects item
    const projectsItem = generalGroup.items[0];
    if (!projectsItem) {
      return;
    }
    expect(projectsItem.title).toBe('Projects');
    expect('url' in projectsItem && projectsItem.url).toBe('/');
    expect(projectsItem.icon).toBeDefined();

    // Test Drafts item with badge
    const draftsItem = generalGroup.items[1];
    if (!draftsItem) {
      return;
    }
    expect(draftsItem.title).toBe('Drafts');
    expect('url' in draftsItem && draftsItem.url).toBe('/drafts');
    expect(draftsItem.badge).toBe('2');
    expect(draftsItem.icon).toBeDefined();

    // Test Queued sessions item with badge
    const queuedItem = generalGroup.items[2];
    if (!queuedItem) {
      return;
    }
    expect(queuedItem.title).toBe('Queued sessions');
    expect('url' in queuedItem && queuedItem.url).toBe('/q');
    expect(queuedItem.badge).toBe('3');
    expect(queuedItem.icon).toBeDefined();
  });

  it('should have valid nav items in Integrations group', () => {
    const integrationsGroup = sidebarData.navGroups[1];
    if (!integrationsGroup) {
      return;
    }

    expect(integrationsGroup.items).toHaveLength(2);

    // Test Devices item
    const devicesItem = integrationsGroup.items[0];
    if (!devicesItem) {
      return;
    }
    expect(devicesItem.title).toBe('Devices');
    expect('url' in devicesItem && devicesItem.url).toBe('/help-center');
    expect(devicesItem.icon).toBeDefined();

    // Test API item
    const apiItem = integrationsGroup.items[1];
    if (!apiItem) {
      return;
    }
    expect(apiItem.title).toBe('API');
    expect('url' in apiItem && apiItem.url).toBe('/api');
    expect(apiItem.icon).toBeDefined();
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
    expect(typedData.teams).toBeDefined();
    expect(typedData.navGroups).toBeDefined();
  });
});
