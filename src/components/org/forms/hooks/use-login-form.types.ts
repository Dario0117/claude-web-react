import type { signInWithEmailAndPasswordReturnType } from '@/services/users.http-service';

export interface UseLoginFormProps {
  handleSuccess(data: signInWithEmailAndPasswordReturnType): void;
}
