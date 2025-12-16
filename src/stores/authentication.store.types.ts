import type { paths } from '@/types/api.generated.types';

export type Profile =
  paths['/api/v1/get-session']['get']['responses']['200']['content']['application/json']['user'];

export interface AuthState {
  profile?: Profile;
}

export interface AuthActions {
  setProfile: (profile: Profile | undefined) => void;
}
