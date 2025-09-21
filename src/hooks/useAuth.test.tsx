import { act, renderHook } from '@testing-library/react';
import * as usersService from '@/services/users.service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type {
  CoreHTTPResponse,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from '@/types/api.d';
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

  describe('login', () => {
    it('should call login service and set user', async () => {
      const mockLoginResponse: CoreHTTPResponse<LoginResponse> = {
        data: {
          success: true,
          token: 'mock-token',
        },
        errors: null,
      };

      mockUsersService.login.mockResolvedValue(mockLoginResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('testuser', 'password123');
      });

      expect(mockUsersService.login).toHaveBeenCalledWith(
        'testuser',
        'password123',
      );

      // Check that user was set in store
      const store = useAuthenticationStore.getState();
      expect(store.user).toEqual({
        id: 0,
        username: 'test',
        email: 'test@test.com',
      });
    });

    it('should return login service response', async () => {
      const mockLoginResponse: CoreHTTPResponse<LoginResponse> = {
        data: {
          success: true,
          token: 'mock-token',
        },
        errors: null,
      };

      mockUsersService.login.mockResolvedValue(mockLoginResponse);

      const { result } = renderHook(() => useAuth());

      const response = await act(async () => {
        return await result.current.login('testuser', 'password123');
      });

      expect(response).toEqual(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should call logout service', async () => {
      const mockLogoutResponse: CoreHTTPResponse<LogoutResponse> = {
        data: {
          success: true,
        },
        errors: null,
      };

      mockUsersService.logout.mockResolvedValue(mockLogoutResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockUsersService.logout).toHaveBeenCalled();
    });

    it('should return logout service response', async () => {
      const mockLogoutResponse: CoreHTTPResponse<LogoutResponse> = {
        data: {
          success: true,
        },
        errors: null,
      };

      mockUsersService.logout.mockResolvedValue(mockLogoutResponse);

      const { result } = renderHook(() => useAuth());

      const response = await act(async () => {
        return await result.current.logout();
      });

      expect(response).toEqual(mockLogoutResponse);
    });
  });

  describe('register', () => {
    it('should call register service', async () => {
      const mockRegisterResponse: CoreHTTPResponse<RegisterResponse> = {
        data: {
          success: true,
          message: 'Registration successful',
        },
        errors: null,
      };

      const registerForm: RegisterRequest = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };

      mockUsersService.register.mockResolvedValue(mockRegisterResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.register(registerForm);
      });

      expect(mockUsersService.register).toHaveBeenCalledWith(registerForm);
    });
  });

  describe('resetPassword', () => {
    it('should call resetPassword service', async () => {
      const mockResetResponse: CoreHTTPResponse<{ success: boolean }> = {
        data: {
          success: true,
        },
        errors: null,
      };

      const resetForm: ResetPasswordRequest = {
        email: 'user@example.com',
      };

      mockUsersService.resetPassword.mockResolvedValue(mockResetResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.resetPassword(resetForm);
      });

      expect(mockUsersService.resetPassword).toHaveBeenCalledWith(resetForm);
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
        login: result.current.login,
        logout: result.current.logout,
        register: result.current.register,
        resetPassword: result.current.resetPassword,
        updatePassword: result.current.updatePassword,
      };

      rerender();

      const secondRender = {
        login: result.current.login,
        logout: result.current.logout,
        register: result.current.register,
        resetPassword: result.current.resetPassword,
        updatePassword: result.current.updatePassword,
      };

      expect(firstRender.login).toBe(secondRender.login);
      expect(firstRender.logout).toBe(secondRender.logout);
      expect(firstRender.register).toBe(secondRender.register);
      expect(firstRender.resetPassword).toBe(secondRender.resetPassword);
      expect(firstRender.updatePassword).toBe(secondRender.updatePassword);
    });
  });
});
