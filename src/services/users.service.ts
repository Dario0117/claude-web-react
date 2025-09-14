import { httpClient } from '@/lib/http-client';
import type {
  CoreHTTPResponse,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from '@/types/api-types';

// Re-export types for convenience
export type {
  CoreHTTPError,
  CoreHTTPResponse,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RegisterRequest as RegisterForm,
  RegisterResponse,
  ResetPasswordRequest as ResetPasswordForm,
  UpdatePasswordRequest as UpdatePasswordForm,
} from '@/types/api-types';

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
        details: error instanceof Error ? error.message : String(error),
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
        details: error instanceof Error ? error.message : String(error),
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
        details: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

export async function login(
  username: string,
  password: string,
): Promise<CoreHTTPResponse<LoginResponse>> {
  try {
    const rawResponse = await httpClient.post(
      '/users/login',
      {
        username,
        password,
      },
      {
        credentials: 'include',
      },
    );

    const json = await rawResponse.json();

    return json;
  } catch (error) {
    return {
      data: null,
      errors: {
        message: 'Something went wrong, please try again later.',
        details: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

export async function me(): Promise<CoreHTTPResponse<MeResponse>> {
  try {
    const rawResponse = await httpClient.get('/users/me', {
      credentials: 'include',
    });

    if (rawResponse.status !== 200) {
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

    const userData = await rawResponse.json();
    return {
      data: {
        success: true,
        ...userData,
      },
      errors: null,
    };
  } catch (error) {
    return {
      data: null,
      errors: {
        message: 'Something went wrong, please try again later.',
        details: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

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
        details: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
