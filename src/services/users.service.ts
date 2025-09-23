import { $api } from '@/httpp-service-setup';
import { httpClient } from '@/lib/http-client';
import type {
  CoreHTTPResponse,
  LogoutResponse,
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

export function useLogin() {
  return $api.useMutation('post', '/api/v1/users/login');
}

export type useLoginReturnType = ReturnType<typeof useLogin>;

export async function logout(): Promise<CoreHTTPResponse<LogoutResponse>> {
  try {
    const rawResponse = await httpClient.post('/users/logout', undefined, {
      credentials: 'include',
    });

    if (rawResponse.status !== 204) {
      return {
        data: null,
        errors: {
          message: 'Not active session',
          details: {
            success: false,
          },
        },
      };
    }

    return {
      data: {
        success: true,
      },
      errors: null,
    };
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
