import { queryClient } from '@/context/query.provider';
import { $api } from '@/http-service-setup';

export function useLoginMutation() {
  return $api.useMutation('post', '/api/v1/users/login');
}

export type useLoginMutationType = ReturnType<typeof useLoginMutation>;

export function useLogoutMutation({
  handleSuccess,
}: {
  handleSuccess: () => void;
}) {
  return $api.useMutation('post', '/api/v1/users/logout', {
    onSuccess: () => {
      handleSuccess();
      queryClient.invalidateQueries({
        queryKey: ['get', '/api/v1/users/profile'],
      });
    },
  });
}

export type useLogoutMutationType = ReturnType<typeof useLogoutMutation>;

export function useProfileQuery() {
  return $api.useQuery('get', '/api/v1/users/profile', undefined, {
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}

export type useProfileQueryReturnType = ReturnType<typeof useProfileQuery>;

export function useRegisterMutation() {
  return $api.useMutation('post', '/api/v1/users/register');
}

export type useRegisterMutationType = ReturnType<typeof useRegisterMutation>;

export function useResetPasswordMutation() {
  return $api.useMutation('post', '/api/v1/users/reset-password');
}

export type useResetPasswordMutationType = ReturnType<
  typeof useResetPasswordMutation
>;

export function useUpdatePasswordMutation() {
  return $api.useMutation('post', '/api/v1/users/update-password');
}

export type useUpdatePasswordMutationType = ReturnType<
  typeof useUpdatePasswordMutation
>;
