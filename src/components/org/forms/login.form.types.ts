import type { useLoginMutationType } from '@/services/users.http-service';

export interface LoginFormProps {
  handleSuccess(data: useLoginMutationType['data']): void;
}
