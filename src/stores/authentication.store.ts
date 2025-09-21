import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AuthActions, AuthState, User } from '@/types/auth';

export const useAuthenticationStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    user: undefined,
    setUser: (user: User) => {
      set((state) => {
        state.user = user;
      });
    },
  })),
);
