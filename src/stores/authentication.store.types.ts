import type { useProfileQueryReturnType } from '@/services/users.http-service';

type Profile = NonNullable<useProfileQueryReturnType['data']>;

export interface AuthState {
  profile?: Profile;
}

export interface AuthActions {
  setProfile: (profile: Profile | undefined) => void;
}
