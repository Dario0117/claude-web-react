import type { useResetPasswordMutationType } from '@/services/users.http-service';

export interface ResetPasswordFormProps {
  resetPasswordMutation: useResetPasswordMutationType;
  handleSuccess(data: useResetPasswordMutationType['data']): void;
}
