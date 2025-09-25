import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AuthActions, AuthState } from '@/stores/auth-store.d';

export const useAuthenticationStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    user: undefined,
    setUser: (user) => {
      set((state) => {
        state.user = user;
      });
    },
  })),
);
