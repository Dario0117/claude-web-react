import type { paths } from '@/types/api.generated.types';

export type signUpWithEmailAndPasswordReturnType =
  paths['/api/v1/sign-up/email']['post']['responses']['200']['content']['application/json'];
export type signInWithEmailAndPasswordReturnType =
  paths['/api/v1/sign-in/email']['post']['responses']['200']['content']['application/json'];
