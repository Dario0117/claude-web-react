import { useMutation, useQuery } from '@tanstack/react-query';
import type { LoginFormData } from '@/components/org/forms/validation/login-form.schema';
import type { RegisterFormData } from '@/components/org/forms/validation/register-form.schema';
import { authClient } from './auth.http-service';

export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const session = await authClient.getSession();
      return session.data?.user;
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

// export function useLogoutMutation({
//   handleSuccess,
// }: {
//   handleSuccess: () => void;
// }) {
//   return $api.useMutation('post', '/api/v1/users/logout', {
//     onSuccess: () => {
//       handleSuccess();
//       queryClient.invalidateQueries({
//         queryKey: ['get', '/api/v1/users/profile'],
//       });
//     },
//   });
// }

// export type useLogoutMutationType = ReturnType<typeof useLogoutMutation>;

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

// export function useResetPasswordMutation() {
//   return $api.useMutation('post', '/api/v1/users/reset-password');
// }

// export type useResetPasswordMutationType = ReturnType<
//   typeof useResetPasswordMutation
// >;

// export function useUpdatePasswordMutation() {
//   return $api.useMutation('post', '/api/v1/users/update-password');
// }

// export type useUpdatePasswordMutationType = ReturnType<
//   typeof useUpdatePasswordMutation
// >;

// export function useLogoutAllMutation({
//   handleSuccess,
// }: {
//   handleSuccess: () => void;
// }) {
//   return $api.useMutation('post', '/api/v1/users/logoutall', {
//     onSuccess: () => {
//       handleSuccess();
//       queryClient.invalidateQueries({
//         queryKey: ['get', '/api/v1/users/profile'],
//       });
//     },
//   });
// }

// export type useLogoutAllMutationType = ReturnType<typeof useLogoutAllMutation>;
