import type { useProfileQueryReturnType } from '@/services/users.service';

export interface AuthenticationContext {
  user: User | undefined;
}

export interface RouterContext {
  authentication: AuthenticationContext;
}

export type User = NonNullable<
  useProfileQueryReturnType['data']
>['responseData'];
