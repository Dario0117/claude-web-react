import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AuthActions, AuthState } from '@/stores/authentication.store.d';

export const useAuthenticationStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    profile: undefined,
    setProfile: (profile) => {
      set((state) => {
        state.profile = profile;
      });
    },
  })),
);
