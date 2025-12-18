import type { useLoginMutationType } from '@/services/users.http-service';

export interface UseLoginFormProps {
  loginMutation: useLoginMutationType;
  handleSuccess(data: useLoginMutationType['data']): void;
}
