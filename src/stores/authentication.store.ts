import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AuthActions, AuthState, User } from '@/types/auth';

type ExtendedAuthActions = AuthActions & {
  setUser: (user: User) => void;
};

export const useAuthenticationStore = create<AuthState & ExtendedAuthActions>()(
  immer((set) => ({
    isLoggedIn: false,
    wasProfileChecked: false,
    user: undefined,
    logIn: () =>
      set((state) => {
        state.isLoggedIn = true;
      }),
    logOut: () =>
      set((state) => {
        state.isLoggedIn = false;
      }),
    checkProfile: () => {
      set((state) => {
        state.wasProfileChecked = true;
      });
    },
    setUser: (user: User) => {
      set((state) => {
        state.user = user;
        state.isLoggedIn = true;
      });
    },
  })),
);
