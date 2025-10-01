import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import type { UpdatePasswordRequest } from '@/types/api.d';
import { updatePassword } from './users.service';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('users.service', () => {
  const baseUrl = 'http://127.0.0.1:9000/api/v1';

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
});
