import { $api } from '@/httpp-service-setup';
import { httpClient } from '@/lib/http-client';
import { queryClient } from '@/query-provider';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type {
  CoreHTTPResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from '@/types/api.d';

export async function resetPassword(
  formValues: ResetPasswordRequest,
): Promise<CoreHTTPResponse<{ success: boolean }>> {
  try {
    const rawResponse = await httpClient.post(
      '/users/reset-password',
      formValues,
      {
        credentials: 'include',
      },
    );

    if (rawResponse.status === 200) {
      return {
        data: { success: true },
        errors: null,
      };
    }
    throw new Error('Not created');
  } catch (error) {
    return {
      data: null,
      errors: {
        message: 'Something went wrong, please try again later.',
        details: error,
      },
    };
  }
}

export async function updatePassword(
  formValues: UpdatePasswordRequest,
): Promise<CoreHTTPResponse<{ success: boolean }>> {
  try {
    const rawResponse = await httpClient.post(
      '/users/update-password',
      formValues,
      {
        credentials: 'include',
      },
    );

    if (rawResponse.status === 200) {
      return {
        data: { success: true },
        errors: null,
      };
    }
    throw new Error('Not created');
  } catch (error) {
    return {
      data: null,
      errors: {
        message: 'Something went wrong, please try again later.',
        details: error,
      },
    };
  }
}

export function useLoginMutation() {
  return $api.useMutation('post', '/api/v1/users/login');
}

export type useLoginMutationType = ReturnType<typeof useLoginMutation>;

export function useLogoutMutation() {
  const { setUser } = useAuthenticationStore();
  return $api.useMutation('post', '/api/v1/users/logout', {
    onSuccess: () => {
      setUser(undefined);
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
