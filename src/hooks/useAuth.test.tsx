import { act, renderHook } from '@testing-library/react';
import * as usersService from '@/services/users.service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type { CoreHTTPResponse, UpdatePasswordRequest } from '@/types/api.d';
import { useAuth } from './useAuth';

// Mock the users service
vi.mock('@/services/users.service');

const mockUsersService = vi.mocked(usersService);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset store state before each test
    useAuthenticationStore.setState({
      user: undefined,
    });
  });

  describe('updatePassword', () => {
    it('should call updatePassword service', async () => {
      const mockUpdateResponse: CoreHTTPResponse<{ success: boolean }> = {
        data: {
          success: true,
        },
        errors: null,
      };

      const updateForm: UpdatePasswordRequest = {
        password: 'newpassword123',
        token: 'reset-token',
      };

      mockUsersService.updatePassword.mockResolvedValue(mockUpdateResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.updatePassword(updateForm);
      });

      expect(mockUsersService.updatePassword).toHaveBeenCalledWith(updateForm);
    });
  });

  describe('hook stability', () => {
    it('should have stable function references', () => {
      const { result, rerender } = renderHook(() => useAuth());

      const firstRender = {
        updatePassword: result.current.updatePassword,
      };

      rerender();

      const secondRender = {
        updatePassword: result.current.updatePassword,
      };

      expect(firstRender.updatePassword).toBe(secondRender.updatePassword);
    });
  });
});
