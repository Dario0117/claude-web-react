import type { useRegisterMutationType } from '@/services/users.http-service';

export interface UseRegisterFormProps {
  registerMutation: useRegisterMutationType;
  handleSuccess(data: useRegisterMutationType['data']): void;
}
