import type { useUpdatePasswordMutationType } from '@/services/users.http-service';

export interface UpdatePasswordFormProps {
  updatePasswordMutation: useUpdatePasswordMutationType;
  handleSuccess(data: useUpdatePasswordMutationType['data']): void;
}
