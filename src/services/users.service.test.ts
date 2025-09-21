import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import type {
  CoreHTTPResponse,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from '@/types/api.d';
import {
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
} from './users.service';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('users.service', () => {
  const baseUrl = 'http://127.0.0.1:9000/api/v1';

  describe('register', () => {
    it('should register user successfully', async () => {
      const mockFormValues: RegisterRequest = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      server.use(
        http.post(`${baseUrl}/users/register`, () => {
          return new HttpResponse(null, { status: 201 });
        }),
      );

      const result = await register(mockFormValues);

      expect(result).toEqual({
        data: { success: true },
        errors: null,
      });
    });

    it('should handle register failure', async () => {
      const mockFormValues: RegisterRequest = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      server.use(
        http.post(`${baseUrl}/users/register`, () => {
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const result = await register(mockFormValues);

      expect(result.data).toBeNull();
      expect(result.errors).toEqual({
        message: 'Something went wrong, please try again later.',
        details: expect.any(Error),
      });
    });

    it('should handle network error during register', async () => {
      const mockFormValues: RegisterRequest = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      server.use(
        http.post(`${baseUrl}/users/register`, () => {
          return HttpResponse.error();
        }),
      );

      const result = await register(mockFormValues);

      expect(result.data).toBeNull();
      expect(result.errors).toEqual({
        message: 'Something went wrong, please try again later.',
        details: expect.any(TypeError),
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const mockFormValues: ResetPasswordRequest = {
        email: 'test@example.com',
      };

      server.use(
        http.post(`${baseUrl}/users/reset-password`, () => {
          return new HttpResponse(null, { status: 200 });
        }),
      );

      const result = await resetPassword(mockFormValues);

      expect(result).toEqual({
        data: { success: true },
        errors: null,
      });
    });

    it('should handle reset password failure', async () => {
      const mockFormValues: ResetPasswordRequest = {
        email: 'test@example.com',
      };

      server.use(
        http.post(`${baseUrl}/users/reset-password`, () => {
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const result = await resetPassword(mockFormValues);

      expect(result.data).toBeNull();
      expect(result.errors).toEqual({
        message: 'Something went wrong, please try again later.',
        details: expect.any(Error),
      });
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const mockFormValues: UpdatePasswordRequest = {
        password: 'newPassword123',
        token: 'reset-token-123',
      };

      server.use(
        http.post(`${baseUrl}/users/update-password`, () => {
          return new HttpResponse(null, { status: 200 });
        }),
      );

      const result = await updatePassword(mockFormValues);

      expect(result).toEqual({
        data: { success: true },
        errors: null,
      });
    });

    it('should handle update password failure', async () => {
      const mockFormValues: UpdatePasswordRequest = {
        password: 'newPassword123',
        token: 'invalid-token',
      };

      server.use(
        http.post(`${baseUrl}/users/update-password`, () => {
          return new HttpResponse(null, { status: 400 });
        }),
      );

      const result = await updatePassword(mockFormValues);

      expect(result.data).toBeNull();
      expect(result.errors).toEqual({
        message: 'Something went wrong, please try again later.',
        details: expect.any(Error),
      });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse: CoreHTTPResponse<LoginResponse> = {
        data: {
          success: true,
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
          },
        },
        errors: null,
      };

      server.use(
        http.post(`${baseUrl}/users/login`, () => {
          return HttpResponse.json(mockResponse);
        }),
      );

      const result = await login('testuser', 'password123');

      expect(result).toEqual(mockResponse);
    });

    it('should handle login failure', async () => {
      server.use(
        http.post(`${baseUrl}/users/login`, () => {
          return HttpResponse.error();
        }),
      );

      const result = await login('testuser', 'wrongpassword');

      expect(result.data).toBeNull();
      expect(result.errors).toEqual({
        message: 'Something went wrong, please try again later.',
        details: expect.any(TypeError),
      });
    });

    it('should handle login with invalid credentials', async () => {
      const mockResponse: CoreHTTPResponse<LoginResponse> = {
        data: null,
        errors: {
          message: 'Invalid credentials',
          details: {},
        },
      };

      server.use(
        http.post(`${baseUrl}/users/login`, () => {
          return HttpResponse.json(mockResponse);
        }),
      );

      const result = await login('testuser', 'wrongpassword');

      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      server.use(
        http.post(`${baseUrl}/users/logout`, () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      const result = await logout();

      expect(result).toEqual({
        data: {
          success: true,
        },
        errors: null,
      });
    });

    it('should handle logout failure when no active session', async () => {
      server.use(
        http.post(`${baseUrl}/users/logout`, () => {
          return new HttpResponse(null, { status: 401 });
        }),
      );

      const result = await logout();

      expect(result).toEqual({
        data: null,
        errors: {
          message: 'Not active session',
          details: {
            success: false,
          },
        },
      });
    });

    it('should handle network error during logout', async () => {
      server.use(
        http.post(`${baseUrl}/users/logout`, () => {
          return HttpResponse.error();
        }),
      );

      const result = await logout();

      expect(result.data).toBeNull();
      expect(result.errors).toEqual({
        message: 'Something went wrong, please try again later.',
        details: expect.any(TypeError),
      });
    });
  });
});
