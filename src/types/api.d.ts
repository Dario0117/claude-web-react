export interface CoreHTTPError<T = unknown> {
  message: string;
  details: T | null;
}

export interface CoreHTTPResponse<T = unknown, S = unknown> {
  data: T | null;
  errors: null | CoreHTTPError<S>;
}

export interface UpdatePasswordRequest {
  password: string;
  token: string;
}
