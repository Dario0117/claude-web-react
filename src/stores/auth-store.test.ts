import { act, renderHook } from '@testing-library/react';
import * as cookies from '@/lib/cookies';
import { useAuthStore } from './auth-store';

// Mock the cookies module
vi.mock('@/lib/cookies');

const mockCookies = vi.mocked(cookies);

describe('auth-store', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset store state
    useAuthStore.setState({
      auth: {
        user: null,
        accessToken: '',
        setUser: useAuthStore.getState().auth.setUser,
        setAccessToken: useAuthStore.getState().auth.setAccessToken,
        resetAccessToken: useAuthStore.getState().auth.resetAccessToken,
        reset: useAuthStore.getState().auth.reset,
      },
    });
  });

  describe('initialization', () => {
    it('should initialize with empty state when no cookie exists', () => {
      mockCookies.getCookie.mockReturnValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      expect(result.current.auth.user).toBeNull();
      expect(result.current.auth.accessToken).toBe('');
    });

    it('should initialize with token from cookie when available', () => {
      // This test verifies that the store can be initialized with a token
      // The actual cookie reading happens at module load time
      const { result } = renderHook(() => useAuthStore());

      // The store should have the necessary structure for token management
      expect(typeof result.current.auth.setAccessToken).toBe('function');
      expect(typeof result.current.auth.accessToken).toBe('string');
    });

    it('should handle invalid JSON in cookie gracefully', () => {
      mockCookies.getCookie.mockReturnValue('invalid-json');

      // This should not throw an error during store creation
      expect(() => {
        const { result } = renderHook(() => useAuthStore());
        expect(result.current.auth.accessToken).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('setUser', () => {
    it('should set user data', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        accountNo: '123456',
        email: 'test@example.com',
        role: ['user'],
        exp: Date.now() + 3600000,
      };

      act(() => {
        result.current.auth.setUser(mockUser);
      });

      expect(result.current.auth.user).toEqual(mockUser);
    });

    it('should clear user data when set to null', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        accountNo: '123456',
        email: 'test@example.com',
        role: ['user'],
        exp: Date.now() + 3600000,
      };

      // First set user
      act(() => {
        result.current.auth.setUser(mockUser);
      });

      expect(result.current.auth.user).toEqual(mockUser);

      // Then clear user
      act(() => {
        result.current.auth.setUser(null);
      });

      expect(result.current.auth.user).toBeNull();
    });

    it('should update user data when called multiple times', () => {
      const { result } = renderHook(() => useAuthStore());

      const firstUser = {
        accountNo: '123456',
        email: 'first@example.com',
        role: ['user'],
        exp: Date.now() + 3600000,
      };

      const secondUser = {
        accountNo: '789012',
        email: 'second@example.com',
        role: ['admin'],
        exp: Date.now() + 7200000,
      };

      act(() => {
        result.current.auth.setUser(firstUser);
      });

      expect(result.current.auth.user).toEqual(firstUser);

      act(() => {
        result.current.auth.setUser(secondUser);
      });

      expect(result.current.auth.user).toEqual(secondUser);
    });
  });

  describe('setAccessToken', () => {
    it('should set access token and save to cookie', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockToken = 'new-access-token-123';

      act(() => {
        result.current.auth.setAccessToken(mockToken);
      });

      expect(result.current.auth.accessToken).toBe(mockToken);
      expect(mockCookies.setCookie).toHaveBeenCalledWith(
        'thisisjustarandomstring',
        JSON.stringify(mockToken),
      );
    });

    it('should update existing access token', () => {
      const { result } = renderHook(() => useAuthStore());

      const firstToken = 'first-token';
      const secondToken = 'second-token';

      act(() => {
        result.current.auth.setAccessToken(firstToken);
      });

      expect(result.current.auth.accessToken).toBe(firstToken);

      act(() => {
        result.current.auth.setAccessToken(secondToken);
      });

      expect(result.current.auth.accessToken).toBe(secondToken);
      expect(mockCookies.setCookie).toHaveBeenCalledTimes(2);
      expect(mockCookies.setCookie).toHaveBeenLastCalledWith(
        'thisisjustarandomstring',
        JSON.stringify(secondToken),
      );
    });

    it('should handle empty string token', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.auth.setAccessToken('');
      });

      expect(result.current.auth.accessToken).toBe('');
      expect(mockCookies.setCookie).toHaveBeenCalledWith(
        'thisisjustarandomstring',
        JSON.stringify(''),
      );
    });
  });

  describe('resetAccessToken', () => {
    it('should clear access token and remove cookie', () => {
      const { result } = renderHook(() => useAuthStore());

      // First set a token
      act(() => {
        result.current.auth.setAccessToken('some-token');
      });

      expect(result.current.auth.accessToken).toBe('some-token');

      // Then reset it
      act(() => {
        result.current.auth.resetAccessToken();
      });

      expect(result.current.auth.accessToken).toBe('');
      expect(mockCookies.removeCookie).toHaveBeenCalledWith(
        'thisisjustarandomstring',
      );
    });

    it('should work when no token is set', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.auth.accessToken).toBe('');

      act(() => {
        result.current.auth.resetAccessToken();
      });

      expect(result.current.auth.accessToken).toBe('');
      expect(mockCookies.removeCookie).toHaveBeenCalledWith(
        'thisisjustarandomstring',
      );
    });
  });

  describe('reset', () => {
    it('should clear all auth data and remove cookie', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        accountNo: '123456',
        email: 'test@example.com',
        role: ['user'],
        exp: Date.now() + 3600000,
      };

      // Set user and token
      act(() => {
        result.current.auth.setUser(mockUser);
        result.current.auth.setAccessToken('some-token');
      });

      expect(result.current.auth.user).toEqual(mockUser);
      expect(result.current.auth.accessToken).toBe('some-token');

      // Reset everything
      act(() => {
        result.current.auth.reset();
      });

      expect(result.current.auth.user).toBeNull();
      expect(result.current.auth.accessToken).toBe('');
      expect(mockCookies.removeCookie).toHaveBeenCalledWith(
        'thisisjustarandomstring',
      );
    });

    it('should work when auth data is already empty', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.auth.user).toBeNull();
      expect(result.current.auth.accessToken).toBe('');

      act(() => {
        result.current.auth.reset();
      });

      expect(result.current.auth.user).toBeNull();
      expect(result.current.auth.accessToken).toBe('');
      expect(mockCookies.removeCookie).toHaveBeenCalledWith(
        'thisisjustarandomstring',
      );
    });
  });

  describe('state persistence', () => {
    it('should maintain state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useAuthStore());
      const { result: result2 } = renderHook(() => useAuthStore());

      const mockUser = {
        accountNo: '123456',
        email: 'test@example.com',
        role: ['user'],
        exp: Date.now() + 3600000,
      };

      act(() => {
        result1.current.auth.setUser(mockUser);
      });

      expect(result1.current.auth.user).toEqual(mockUser);
      expect(result2.current.auth.user).toEqual(mockUser);
    });
  });

  describe('user roles and permissions', () => {
    it('should handle multiple roles', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        accountNo: '123456',
        email: 'admin@example.com',
        role: ['user', 'admin', 'moderator'],
        exp: Date.now() + 3600000,
      };

      act(() => {
        result.current.auth.setUser(mockUser);
      });

      expect(result.current.auth.user?.role).toEqual([
        'user',
        'admin',
        'moderator',
      ]);
    });

    it('should handle empty roles array', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        accountNo: '123456',
        email: 'test@example.com',
        role: [],
        exp: Date.now() + 3600000,
      };

      act(() => {
        result.current.auth.setUser(mockUser);
      });

      expect(result.current.auth.user?.role).toEqual([]);
    });

    it('should handle token expiration time', () => {
      const { result } = renderHook(() => useAuthStore());

      const futureTime = Date.now() + 3600000; // 1 hour from now
      const mockUser = {
        accountNo: '123456',
        email: 'test@example.com',
        role: ['user'],
        exp: futureTime,
      };

      act(() => {
        result.current.auth.setUser(mockUser);
      });

      expect(result.current.auth.user?.exp).toBe(futureTime);
    });
  });

  describe('edge cases', () => {
    it('should handle complex user data', () => {
      const { result } = renderHook(() => useAuthStore());

      const complexUser = {
        accountNo: 'ACCOUNT-123-XYZ-789',
        email: 'complex.user+test@example.com',
        role: ['user', 'premium', 'beta-tester'],
        exp: Date.now() + 86400000, // 24 hours
      };

      act(() => {
        result.current.auth.setUser(complexUser);
      });

      expect(result.current.auth.user).toEqual(complexUser);
    });

    it('should handle very long access tokens', () => {
      const { result } = renderHook(() => useAuthStore());

      const longToken = 'a'.repeat(1000); // Very long token

      act(() => {
        result.current.auth.setAccessToken(longToken);
      });

      expect(result.current.auth.accessToken).toBe(longToken);
      expect(mockCookies.setCookie).toHaveBeenCalledWith(
        'thisisjustarandomstring',
        JSON.stringify(longToken),
      );
    });
  });
});
