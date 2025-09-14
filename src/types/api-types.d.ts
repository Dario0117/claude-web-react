// Manual API types for user service until OpenAPI types are generated properly

export interface CoreHTTPError {
  message: string;
  details?: string | Record<string, unknown>;
}

export interface CoreHTTPResponse<T> {
  data: T | null;
  errors: CoreHTTPError | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
}

export interface LogoutResponse {
  success: boolean;
}

export interface MeResponse {
  success: boolean;
  id?: string;
  username?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  token: string;
  password: string;
}
