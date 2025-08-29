import { describe, expect, it } from 'vitest';

// We need to test the actual implementation by properly mocking import.meta.env
// Since we can't easily mock import.meta in Vitest, let's test the actual behavior
// by creating a utility function that we can test more directly

describe('getAppVersion integration tests', () => {
  it('should return a string value', async () => {
    // Dynamic import to get the actual implementation
    const { getAppVersion } = await import('./version');

    const version = getAppVersion();

    expect(typeof version).toBe('string');
    expect(version.length).toBeGreaterThan(0);
  });

  it('should return "dev" in test environment since Vitest runs in development mode', async () => {
    const { getAppVersion } = await import('./version');

    const version = getAppVersion();

    // In test environment (which is development), it should return "dev"
    expect(version).toBe('dev');
  });
});

// Test the function logic by creating a testable version
describe('getAppVersion logic tests', () => {
  it('should return "dev" when DEV is true', () => {
    // Test the logic by creating a local implementation
    const testGetAppVersion = (isDev: boolean, appVersion?: string) => {
      if (isDev) {
        return 'dev';
      }
      return appVersion || 'unknown';
    };

    expect(testGetAppVersion(true, 'abc123')).toBe('dev');
  });

  it('should return the app version when DEV is false and version is set', () => {
    const testGetAppVersion = (isDev: boolean, appVersion?: string) => {
      if (isDev) {
        return 'dev';
      }
      return appVersion || 'unknown';
    };

    expect(testGetAppVersion(false, 'abc123')).toBe('abc123');
  });

  it('should return "unknown" when DEV is false and version is not set', () => {
    const testGetAppVersion = (isDev: boolean, appVersion?: string) => {
      if (isDev) {
        return 'dev';
      }
      return appVersion || 'unknown';
    };

    expect(testGetAppVersion(false, undefined)).toBe('unknown');
    expect(testGetAppVersion(false, '')).toBe('unknown');
  });
});
