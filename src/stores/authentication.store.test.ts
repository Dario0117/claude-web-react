import { act, renderHook } from '@testing-library/react';
import type { User } from '@/types/auth';
import { useAuthenticationStore } from './authentication.store';

describe('authentication.store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthenticationStore.setState({
      isLoggedIn: false,
      wasProfileChecked: false,
      user: undefined,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.wasProfileChecked).toBe(false);
      expect(result.current.user).toBeUndefined();
    });
  });

  describe('logIn action', () => {
    it('should set isLoggedIn to true', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      act(() => {
        result.current.logIn();
      });

      expect(result.current.isLoggedIn).toBe(true);
    });

    it('should not affect other state properties', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      act(() => {
        result.current.logIn();
      });

      expect(result.current.wasProfileChecked).toBe(false);
      expect(result.current.user).toBeUndefined();
    });
  });

  describe('logOut action', () => {
    it('should set isLoggedIn to false', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      // First log in
      act(() => {
        result.current.logIn();
      });

      expect(result.current.isLoggedIn).toBe(true);

      // Then log out
      act(() => {
        result.current.logOut();
      });

      expect(result.current.isLoggedIn).toBe(false);
    });

    it('should not affect other state properties', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      // Set some initial state
      act(() => {
        result.current.logIn();
        result.current.checkProfile();
      });

      act(() => {
        result.current.logOut();
      });

      expect(result.current.wasProfileChecked).toBe(true);
      expect(result.current.user).toBeUndefined();
    });
  });

  describe('checkProfile action', () => {
    it('should set wasProfileChecked to true', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      act(() => {
        result.current.checkProfile();
      });

      expect(result.current.wasProfileChecked).toBe(true);
    });

    it('should not affect other state properties', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      act(() => {
        result.current.checkProfile();
      });

      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toBeUndefined();
    });
  });

  describe('setUser action', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should set user and login status', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoggedIn).toBe(true);
    });

    it('should override existing user data', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      const firstUser: User = {
        id: 1,
        username: 'firstuser',
        email: 'first@example.com',
      };

      const secondUser: User = {
        id: 2,
        username: 'seconduser',
        email: 'second@example.com',
      };

      act(() => {
        result.current.setUser(firstUser);
      });

      expect(result.current.user).toEqual(firstUser);

      act(() => {
        result.current.setUser(secondUser);
      });

      expect(result.current.user).toEqual(secondUser);
    });

    it('should not affect wasProfileChecked', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.wasProfileChecked).toBe(false);
    });
  });

  describe('state persistence', () => {
    it('should maintain state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useAuthenticationStore());
      const { result: result2 } = renderHook(() => useAuthenticationStore());

      act(() => {
        result1.current.logIn();
      });

      expect(result1.current.isLoggedIn).toBe(true);
      expect(result2.current.isLoggedIn).toBe(true);
    });

    it('should handle complex state transitions', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };

      // Start with initial state
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.wasProfileChecked).toBe(false);
      expect(result.current.user).toBeUndefined();

      // Set user (should log in automatically)
      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.user).toEqual(mockUser);

      // Check profile
      act(() => {
        result.current.checkProfile();
      });

      expect(result.current.wasProfileChecked).toBe(true);

      // Log out (should preserve user data and profile check status)
      act(() => {
        result.current.logOut();
      });

      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.wasProfileChecked).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('immutability', () => {
    it('should not mutate previous state when updating', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      const initialState = {
        isLoggedIn: result.current.isLoggedIn,
        wasProfileChecked: result.current.wasProfileChecked,
        user: result.current.user,
      };

      act(() => {
        result.current.logIn();
      });

      // Initial state snapshot should remain unchanged
      expect(initialState.isLoggedIn).toBe(false);
      expect(result.current.isLoggedIn).toBe(true);
    });
  });
});
