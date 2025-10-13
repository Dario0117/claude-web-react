import { HttpResponse, http } from 'msw';
import { buildBackendUrl } from '@/lib/test.utils';
import type {
  useLoginMutationType,
  useLogoutAllMutationType,
  useLogoutMutationType,
  useProfileQueryReturnType,
  useRegisterMutationType,
  useResetPasswordMutationType,
  useUpdatePasswordMutationType,
} from '@/services/users.http-service';

export const usersHandlers = [
  http.post(buildBackendUrl('/api/v1/users/login'), () => {
    const data: useLoginMutationType['data'] = {
      token: 'random-token',
      expiry: 'random-expiry',
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/users/logout'), () => {
    const data: useLogoutMutationType['data'] = {
      responseData: ["You've been logged out successfully."],
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/users/logoutall'), () => {
    const data: useLogoutAllMutationType['data'] = {
      detail: 'Successfully logged out.',
    };
    return HttpResponse.json(data);
  }),
  http.get(buildBackendUrl('/api/v1/users/profile'), () => {
    const data: useProfileQueryReturnType['data'] = {
      responseData: {
        firstName: 'test',
        lastName: 'test2',
        email: 't@t.com',
      },
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/users/register'), () => {
    const data: useRegisterMutationType['data'] = {
      responseData: ['User registered successfully.'],
    };
    return HttpResponse.json(data, { status: 201 });
  }),
  http.post(buildBackendUrl('/api/v1/users/reset-password'), () => {
    const data: useResetPasswordMutationType['data'] = {
      responseData: ['Password reset email sent.'],
    };
    return HttpResponse.json(data);
  }),
  http.post(buildBackendUrl('/api/v1/users/update-password'), () => {
    const data: useUpdatePasswordMutationType['data'] = {
      responseData: ['Password updated successfully.'],
    };
    return HttpResponse.json(data);
  }),
];
