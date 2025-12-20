import type { Session, User } from 'better-auth/client';
import { HttpResponse, http } from 'msw';
import { buildBackendUrl } from '@/lib/test.utils';

// Better Auth endpoint response types (what the endpoint returns directly)
type SignInResponse = {
  redirect: boolean;
  token: string;
  user: User;
};

type SignOutResponse = {
  success: boolean;
};

type RevokeSessionsResponse = {
  status: boolean;
};

type GetSessionResponse = {
  user: User;
  session: Session;
};

type SignUpResponse = {
  user: User;
  token: null | string;
};

type PasswordResetRequestResponse = {
  status: boolean;
  message: string;
};

type PasswordResetResponse = {
  status: boolean;
};

export const usersHandlers = [
  http.post(buildBackendUrl('/api/v1/sign-in/email'), () => {
    const data: SignInResponse = {
      redirect: false,
      token: 'random-token',
      user: {
        id: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'test@example.com',
        emailVerified: true,
        name: 'Test User',
        image: null,
      },
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/sign-out'), () => {
    const data: SignOutResponse = {
      success: true,
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/revoke-sessions'), () => {
    const data: RevokeSessionsResponse = {
      status: true,
    };
    return HttpResponse.json(data);
  }),
  http.get(buildBackendUrl('/api/v1/get-session'), () => {
    const data: GetSessionResponse = {
      user: {
        id: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'test@example.com',
        emailVerified: true,
        name: 'Test User',
        image: null,
      },
      session: {
        id: 'test-session-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        token: 'test-session-token',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      },
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/sign-up/email'), () => {
    const data: SignUpResponse = {
      user: {
        id: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'test@example.com',
        emailVerified: false,
        name: 'Test User',
        image: null,
      },
      token: null,
    };
    return HttpResponse.json(data, { status: 201 });
  }),
  http.post(buildBackendUrl('/api/v1/request-password-reset'), () => {
    const data: PasswordResetRequestResponse = {
      status: true,
      message: 'Password reset email sent',
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/reset-password'), () => {
    const data: PasswordResetResponse = {
      status: true,
    };
    return HttpResponse.json(data);
  }),
];
