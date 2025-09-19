import { act, renderHook, waitFor } from '@testing-library/react';
import * as usersService from '@/services/users.service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type {
  CoreHTTPResponse,
  LoginResponse,
  LogoutResponse,
  MeResponse,
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
      isLoggedIn: false,
      wasProfileChecked: false,
      user: undefined,
    });
  });

  describe('initialization', () => {
    it('should check profile on mount when not checked before', async () => {
      const mockMeResponse: CoreHTTPResponse<MeResponse> = {
        data: {
          success: true,
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
          },
        },
        errors: null,
      };

      mockUsersService.me.mockResolvedValue(mockMeResponse);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoggedIn).toBe(false);

      await waitFor(() => {
        expect(mockUsersService.me).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(result.current.isLoggedIn).toBe(true);
      });
    });

    it('should log out when me request fails', async () => {
      const mockMeResponse: CoreHTTPResponse<MeResponse> = {
        data: null,
        errors: {
          message: 'Not authenticated',
          details: {},
        },
      };

      mockUsersService.me.mockResolvedValue(mockMeResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(mockUsersService.me).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(result.current.isLoggedIn).toBe(false);
      });
    });

    it('should not check profile if already checked', () => {
      // Set profile as already checked
      useAuthenticationStore.setState({
        isLoggedIn: false,
        wasProfileChecked: true,
        user: undefined,
      });

      renderHook(() => useAuth());

      expect(mockUsersService.me).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully and update state', async () => {
      const mockLoginResponse: CoreHTTPResponse<LoginResponse> = {
        data: {
          success: true,
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
          },
        },
        errors: null,
      };

      mockUsersService.login.mockResolvedValue(mockLoginResponse);
      mockUsersService.me.mockResolvedValue({
        data: null,
        errors: { message: 'Not authenticated', details: {} },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoggedIn).toBe(false);
      });

      let loginResult: CoreHTTPResponse<LoginResponse> | null = null;
      await act(async () => {
        loginResult = await result.current.login('testuser', 'password123');
      });

      expect(loginResult).toEqual(mockLoginResponse);
      expect(mockUsersService.login).toHaveBeenCalledWith(
        'testuser',
        'password123',
      );
      expect(result.current.isLoggedIn).toBe(true);
    });

    it('should handle login failure without updating state', async () => {
      const mockLoginResponse: CoreHTTPResponse<LoginResponse> = {
        data: null,
        errors: {
          message: 'Invalid credentials',
          details: {},
        },
      };

      mockUsersService.login.mockResolvedValue(mockLoginResponse);
      mockUsersService.me.mockResolvedValue({
        data: null,
        errors: { message: 'Not authenticated', details: {} },
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoggedIn).toBe(false);
      });

      let loginResult: CoreHTTPResponse<LoginResponse> | null = null;
      await act(async () => {
        loginResult = await result.current.login('testuser', 'wrongpassword');
      });

      expect(loginResult).toEqual(mockLoginResponse);
      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully and update state', async () => {
      const mockLogoutResponse: CoreHTTPResponse<LogoutResponse> = {
        data: {
          success: true,
        },
        errors: null,
      };

      mockUsersService.logout.mockResolvedValue(mockLogoutResponse);
      mockUsersService.me.mockResolvedValue({
        data: null,
        errors: { message: 'Not authenticated', details: {} },
      });

      // Set initial logged in state
      useAuthenticationStore.setState({
        isLoggedIn: true,
        wasProfileChecked: true,
        user: undefined,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoggedIn).toBe(true);

      let logoutResult: CoreHTTPResponse<LogoutResponse> | null = null;
      await act(async () => {
        logoutResult = await result.current.logout();
      });

      expect(logoutResult).toEqual(mockLogoutResponse);
      expect(mockUsersService.logout).toHaveBeenCalledTimes(1);
      expect(result.current.isLoggedIn).toBe(false);
    });

    it('should update state even when logout service fails', async () => {
      const mockLogoutResponse: CoreHTTPResponse<LogoutResponse> = {
        data: null,
        errors: {
          message: 'Server error',
          details: {},
        },
      };

      mockUsersService.logout.mockResolvedValue(mockLogoutResponse);
      mockUsersService.me.mockResolvedValue({
        data: null,
        errors: { message: 'Not authenticated', details: {} },
      });

      // Set initial logged in state
      useAuthenticationStore.setState({
        isLoggedIn: true,
        wasProfileChecked: true,
        user: undefined,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoggedIn).toBe(true);

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  describe('register', () => {
    it('should register successfully and log out', async () => {
      const mockRegisterResponse: CoreHTTPResponse<RegisterResponse> = {
        data: {
          success: true,
        },
        errors: null,
      };

      const registerForm: RegisterRequest = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };

      mockUsersService.register.mockResolvedValue(mockRegisterResponse);
      mockUsersService.me.mockResolvedValue({
        data: null,
        errors: { message: 'Not authenticated', details: {} },
      });

      const { result } = renderHook(() => useAuth());

      let registerResult: CoreHTTPResponse<RegisterResponse> | null = null;
      await act(async () => {
        registerResult = await result.current.register(registerForm);
      });

      expect(registerResult).toEqual(mockRegisterResponse);
      expect(mockUsersService.register).toHaveBeenCalledWith(registerForm);
      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully and log out', async () => {
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
      mockUsersService.me.mockResolvedValue({
        data: null,
        errors: { message: 'Not authenticated', details: {} },
      });

      const { result } = renderHook(() => useAuth());

      let resetResult: CoreHTTPResponse<{ success: boolean }> | null = null;
      await act(async () => {
        resetResult = await result.current.resetPassword(resetForm);
      });

      expect(resetResult).toEqual(mockResetResponse);
      expect(mockUsersService.resetPassword).toHaveBeenCalledWith(resetForm);
      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully and log out', async () => {
      const mockUpdateResponse: CoreHTTPResponse<{ success: boolean }> = {
        data: {
          success: true,
        },
        errors: null,
      };

      const updateForm: UpdatePasswordRequest = {
        password: 'newpassword123',
        token: 'reset-token-123',
      };

      mockUsersService.updatePassword.mockResolvedValue(mockUpdateResponse);
      mockUsersService.me.mockResolvedValue({
        data: null,
        errors: { message: 'Not authenticated', details: {} },
      });

      const { result } = renderHook(() => useAuth());

      let updateResult: CoreHTTPResponse<{ success: boolean }> | null = null;
      await act(async () => {
        updateResult = await result.current.updatePassword(updateForm);
      });

      expect(updateResult).toEqual(mockUpdateResponse);
      expect(mockUsersService.updatePassword).toHaveBeenCalledWith(updateForm);
      expect(result.current.isLoggedIn).toBe(false);
    });
  });

  describe('hook stability', () => {
    it('should have stable function references', () => {
      mockUsersService.me.mockResolvedValue({
        data: null,
        errors: { message: 'Not authenticated', details: {} },
      });

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
