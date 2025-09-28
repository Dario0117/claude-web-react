import type { useProfileQueryReturnType } from '@/services/users.service';

export interface RouterContext {
  nothingYet: boolean | undefined;
}

export type User = NonNullable<
  useProfileQueryReturnType['data']
>['responseData'];
