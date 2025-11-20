import type { useProfileQueryReturnType } from '@/services/users.http-service';

export type Profile = NonNullable<
  useProfileQueryReturnType['data']
>['responseData'];

export interface AuthState {
  profile?: Profile;
}

export interface AuthActions {
  setProfile: (profile: Profile | undefined) => void;
}
