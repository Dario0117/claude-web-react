import { useCallback } from 'react';
import {
  login as serviceLogin,
  logout as serviceLogout,
  register as serviceRegister,
  resetPassword as serviceResetPassword,
  updatePassword as serviceUpdatePassword,
} from '@/services/users.service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type {
  RegisterRequest as RegisterForm,
  ResetPasswordRequest as ResetPasswordForm,
  UpdatePasswordRequest as UpdatePasswordForm,
} from '@/types/api.d';

export function useAuth() {
  const setUser = useAuthenticationStore((state) => state.setUser);

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await serviceLogin(username, password);
      setUser({
        id: 0,
        username: 'test',
        email: 'test@test.com',
      });
      return result;
    },
    [setUser],
  );

  const logout = useCallback(async () => {
    const result = await serviceLogout();
    return result;
  }, []);

  const register = useCallback(async (form: RegisterForm) => {
    const result = await serviceRegister(form);
    return result;
  }, []);

  const resetPassword = useCallback(async (form: ResetPasswordForm) => {
    const result = await serviceResetPassword(form);
    return result;
  }, []);

  const updatePassword = useCallback(async (form: UpdatePasswordForm) => {
    const result = await serviceUpdatePassword(form);
    return result;
  }, []);

  return {
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
  };
}
