export interface CoreHTTPError<T = unknown> {
  message: string;
  details: T | null;
}

export interface CoreHTTPResponse<T = unknown, S = unknown> {
  data: T | null;
  errors: null | CoreHTTPError<S>;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
  token: string;
}
export interface LogoutResponse {
  success: boolean;
}
