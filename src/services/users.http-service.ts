import { useMutation, useQuery } from '@tanstack/react-query';
import type { LoginFormData } from '@/components/org/forms/validation/login-form.schema';
import type { RegisterFormData } from '@/components/org/forms/validation/register-form.schema';
import type { ResetPasswordFormData } from '@/components/org/forms/validation/reset-password-form.schema';
import type { UpdatePasswordFormData } from '@/components/org/forms/validation/update-password-form.schema';
import { queryClient } from '@/context/query.provider';
import { authClient } from './auth.http-service';

export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const session = await authClient.getSession();
      if (session.data?.user) {
        return session.data.user;
      }
      throw new Error('No user found');
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}

export type useProfileQueryReturnType = ReturnType<typeof useProfileQuery>;

export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ email, password }: LoginFormData) => {
      return authClient.signIn.email({
        email,
        password,
      });
    },
  });
}

export type useLoginMutationType = ReturnType<typeof useLoginMutation>;

export function useLogoutMutation({
  handleSuccess,
}: {
  handleSuccess: () => void;
}) {
  return useMutation({
    mutationFn: () => {
      return authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            handleSuccess();
            queryClient.invalidateQueries({
              queryKey: ['profile'],
            });
          },
        },
      });
    },
  });
}

export type useLogoutMutationType = ReturnType<typeof useLogoutMutation>;

export function useRegisterMutation() {
  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: Omit<RegisterFormData, 'confirm'>) => {
      return authClient.signUp.email({
        name,
        email,
        password,
      });
    },
  });
}

export type useRegisterMutationType = ReturnType<typeof useRegisterMutation>;

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({ email }: ResetPasswordFormData) => {
      return authClient.requestPasswordReset({
        email,
        redirectTo: 'http://localhost:5173/update-password',
      });
    },
  });
}

export type useResetPasswordMutationType = ReturnType<
  typeof useResetPasswordMutation
>;

export function useUpdatePasswordMutation(token: string) {
  return useMutation({
    mutationFn: ({ password }: Omit<UpdatePasswordFormData, 'confirm'>) => {
      return authClient.resetPassword({
        newPassword: password,
        token,
      });
    },
  });
}

export type useUpdatePasswordMutationType = ReturnType<
  typeof useUpdatePasswordMutation
>;

export function useLogoutAllMutation({
  handleSuccess,
}: {
  handleSuccess: () => void;
}) {
  return useMutation({
    mutationFn: () => {
      return authClient.revokeSessions({
        fetchOptions: {
          onSuccess: () => {
            handleSuccess();
            queryClient.invalidateQueries({
              queryKey: ['profile'],
            });
          },
        },
      });
    },
  });
}

export type useLogoutAllMutationType = ReturnType<typeof useLogoutAllMutation>;
