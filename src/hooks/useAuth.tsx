import { useCallback } from 'react';
import { updatePassword as serviceUpdatePassword } from '@/services/users.service';
import type { UpdatePasswordRequest as UpdatePasswordForm } from '@/types/api.d';

export function useAuth() {
  const updatePassword = useCallback(async (form: UpdatePasswordForm) => {
    const result = await serviceUpdatePassword(form);
    return result;
  }, []);

  return {
    updatePassword,
  };
}
