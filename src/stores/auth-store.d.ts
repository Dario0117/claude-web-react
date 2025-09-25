import type { User } from '@/types/auth.d';

export interface AuthState {
  user?: User;
}

export interface AuthActions {
  setUser: (user: User | undefined) => void;
}
