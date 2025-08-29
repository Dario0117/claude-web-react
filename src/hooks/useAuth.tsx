import { useCallback, useEffect } from 'react';
import {
  me,
  type RegisterForm,
  type ResetPasswordForm,
  login as serviceLogin,
  logout as serviceLogout,
  register as serviceRegister,
  resetPassword as serviceResetPassword,
  updatePassword as serviceUpdatePassword,
  type UpdatePasswordForm,
} from '@/services/users.service';
import { useAuthenticationStore } from '@/stores/authentication.store';

export function useAuth() {
  const isLoggedIn = useAuthenticationStore((state) => state.isLoggedIn);
  const wasProfileChecked = useAuthenticationStore(
    (state) => state.wasProfileChecked,
  );
  const logIn = useAuthenticationStore((state) => state.logIn);
  const logOut = useAuthenticationStore((state) => state.logOut);
  const checkProfile = useAuthenticationStore((state) => state.checkProfile);

  useEffect(() => {
    if (!wasProfileChecked) {
      checkProfile();
      me().then((checkingSessionResult) => {
        if (checkingSessionResult.errors) {
          logOut();
        } else {
          logIn();
        }
      });
    }
  }, [wasProfileChecked, logIn, logOut, checkProfile]);

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await serviceLogin(username, password);
      if (!result.errors) {
        logIn();
      }

      return result;
    },
    [logIn],
  );

  const logout = useCallback(async () => {
    const result = await serviceLogout();
    logOut();
    return result;
  }, [logOut]);

  const register = useCallback(
    async (form: RegisterForm) => {
      const result = await serviceRegister(form);
      logOut();
      return result;
    },
    [logOut],
  );

  const resetPassword = useCallback(
    async (form: ResetPasswordForm) => {
      const result = await serviceResetPassword(form);
      logOut();
      return result;
    },
    [logOut],
  );

  const updatePassword = useCallback(
    async (form: UpdatePasswordForm) => {
      const result = await serviceUpdatePassword(form);
      logOut();
      return result;
    },
    [logOut],
  );

  return {
    isLoggedIn,
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
  };
}
