import { useCallback } from 'react';
import {
  resetPassword as serviceResetPassword,
  updatePassword as serviceUpdatePassword,
} from '@/services/users.service';
import type {
  ResetPasswordRequest as ResetPasswordForm,
  UpdatePasswordRequest as UpdatePasswordForm,
} from '@/types/api.d';

export function useAuth() {
  const resetPassword = useCallback(async (form: ResetPasswordForm) => {
    const result = await serviceResetPassword(form);
    return result;
  }, []);

  const updatePassword = useCallback(async (form: UpdatePasswordForm) => {
    const result = await serviceUpdatePassword(form);
    return result;
  }, []);

  return {
    resetPassword,
    updatePassword,
  };
}
