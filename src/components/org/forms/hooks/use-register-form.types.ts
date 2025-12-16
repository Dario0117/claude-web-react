import type { signUpWithEmailAndPasswordReturnType } from '@/services/users.http-service';

export interface UseRegisterFormProps {
  handleSuccess(data: signUpWithEmailAndPasswordReturnType): void;
}
