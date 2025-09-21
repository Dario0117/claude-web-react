import { act, renderHook } from '@testing-library/react';
import type { User } from '@/types/auth';
import { useAuthenticationStore } from './authentication.store';

describe('authentication.store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthenticationStore.setState({
      user: undefined,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      expect(result.current.user).toBeUndefined();
    });
  });

  describe('setUser action', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should set user', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
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
  });

  describe('state persistence', () => {
    it('should maintain state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useAuthenticationStore());
      const { result: result2 } = renderHook(() => useAuthenticationStore());

      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };

      act(() => {
        result1.current.setUser(mockUser);
      });

      expect(result1.current.user).toEqual(mockUser);
      expect(result2.current.user).toEqual(mockUser);
    });
  });

  describe('immutability', () => {
    it('should not mutate previous state when updating', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      const initialState = {
        user: result.current.user,
      };

      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      // Initial state snapshot should remain unchanged
      expect(initialState.user).toBeUndefined();
      expect(result.current.user).toEqual(mockUser);
    });
  });
});
