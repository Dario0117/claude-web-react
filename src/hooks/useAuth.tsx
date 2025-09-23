import { useCallback } from 'react';
import {
  logout as serviceLogout,
  register as serviceRegister,
  resetPassword as serviceResetPassword,
  updatePassword as serviceUpdatePassword,
} from '@/services/users.service';
import type {
  RegisterRequest as RegisterForm,
  ResetPasswordRequest as ResetPasswordForm,
  UpdatePasswordRequest as UpdatePasswordForm,
} from '@/types/api.d';

export function useAuth() {
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
    logout,
    register,
    resetPassword,
    updatePassword,
  };
}
