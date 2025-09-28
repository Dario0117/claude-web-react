import { $api } from '@/httpp-service-setup';
import { httpClient } from '@/lib/http-client';
import { queryClient } from '@/query-provider';
import type {
  CoreHTTPResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from '@/types/api.d';

export async function register(
  formValues: RegisterRequest,
): Promise<CoreHTTPResponse<RegisterResponse>> {
  try {
    const rawResponse = await httpClient.post('/users/register', formValues, {
      credentials: 'include',
    });

    if (rawResponse.status === 201) {
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
  return $api.useMutation('post', '/api/v1/users/logout', {
    onSuccess: () => {
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
