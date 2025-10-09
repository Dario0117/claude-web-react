import type { useLoginMutationType } from '@/services/users.http-service';

export interface LoginFormProps {
  loginMutation: useLoginMutationType;
  handleSuccess(data: useLoginMutationType['data']): void;
}
