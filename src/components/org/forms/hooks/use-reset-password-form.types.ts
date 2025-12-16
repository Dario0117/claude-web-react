import type { useResetPasswordMutationType } from '@/services/users.http-service';

export interface UseResetPasswordFormProps {
  resetPasswordMutation: useResetPasswordMutationType;
  handleSuccess(data: useResetPasswordMutationType['data']): void;
}
