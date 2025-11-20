import { act, renderHook } from '@testing-library/react';
import { useAuthenticationStore } from './authentication.store';
import type { Profile } from './authentication.store.d';

describe('authentication.store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthenticationStore.setState({
      profile: undefined,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      expect(result.current.profile).toBeUndefined();
    });
  });

  describe('setUser action', () => {
    const mockUser: Profile = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };

    it('should set user', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      act(() => {
        result.current.setProfile(mockUser);
      });

      expect(result.current.profile).toEqual(mockUser);
    });

    it('should override existing user data', () => {
      const { result } = renderHook(() => useAuthenticationStore());

      const firstUser: Profile = {
        firstName: 'First',
        lastName: 'User',
        email: 'first@example.com',
      };

      const secondUser: Profile = {
        firstName: 'Second',
        lastName: 'User',
        email: 'second@example.com',
      };

      act(() => {
        result.current.setProfile(firstUser);
      });

      expect(result.current.profile).toEqual(firstUser);

      act(() => {
        result.current.setProfile(secondUser);
      });

      expect(result.current.profile).toEqual(secondUser);
    });
  });
});
