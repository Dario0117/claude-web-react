import type { signUpWithEmailAndPasswordReturnType } from '@/services/users.http-service';

export interface RegisterFormProps {
  handleSuccess(data: signUpWithEmailAndPasswordReturnType): void;
}
