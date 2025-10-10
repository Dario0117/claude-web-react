import type { useRegisterMutationType } from '@/services/users.http-service';

export interface RegisterFormProps {
  registerMutation: useRegisterMutationType;
  handleSuccess(data: useRegisterMutationType['data']): void;
}
