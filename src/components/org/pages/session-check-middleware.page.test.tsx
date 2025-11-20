import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { server } from '@/../testsSetup';
import { buildBackendUrl } from '@/lib/test.utils';
import { renderWithProviders } from '@/lib/test-wrappers.utils';
import type { useProfileQueryReturnType } from '@/services/users.http-service';
import { useAuthenticationStore } from '@/stores/authentication.store';
import { SessionCheckMiddleware } from './session-check-middleware.page';

// Mock the authentication store
vi.mock('@/stores/authentication.store', () => ({
  useAuthenticationStore: vi.fn(),
}));

// Mock the navigation component
vi.mock('@tanstack/react-router', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
}));

const mockUseAuthenticationStore = vi.mocked(useAuthenticationStore);

describe('SessionCheckMiddleware', () => {
  const mockSetProfile = vi.fn();

  beforeEach(() => {
    mockSetProfile.mockClear();
    mockUseAuthenticationStore.mockReturnValue({
      setProfile: mockSetProfile,
    });
  });

  describe('Loading state', () => {
    it('should render null when loading', () => {
      // Mock the profile endpoint to delay response to simulate loading
      server.use(
        http.get(
          buildBackendUrl('/api/v1/users/profile'),
          async () =>
            new Promise(() => {
              // Never resolves to keep loading state
            }),
        ),
      );

      const { container } = renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      // Initially should be loading (null)
      expect(container.firstChild).toBeNull();
      expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });
  });

  describe('When profile exists - redirect scenario', () => {
    it('should redirect when profile exists and whenProfileExist is true', async () => {
      // Use default MSW handler which returns a profile
      renderWithProviders(
        <SessionCheckMiddleware
          to="/"
          whenProfileExist={true}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveTextContent('/');
      });
      expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });

    it('should render children when profile exists and whenProfileExist is false', async () => {
      // Use default MSW handler which returns a profile
      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      await waitFor(() => {
        expect(screen.getByText('Child Content')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('When profile does not exist - redirect scenario', () => {
    it('should redirect when profile does not exist and whenProfileExist is false', async () => {
      // Override MSW handler to return undefined profile
      server.use(
        http.get(buildBackendUrl('/api/v1/users/profile'), () => {
          const data = {
            responseData: undefined,
          } as unknown as useProfileQueryReturnType['data'];
          return HttpResponse.json(data);
        }),
      );

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveTextContent('/login');
      });
      expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });

    it('should render children when profile does not exist and whenProfileExist is true', async () => {
      // Override MSW handler to return undefined profile
      server.use(
        http.get(buildBackendUrl('/api/v1/users/profile'), () => {
          const data = {
            responseData: undefined,
          } as unknown as useProfileQueryReturnType['data'];
          return HttpResponse.json(data);
        }),
      );

      renderWithProviders(
        <SessionCheckMiddleware
          to="/"
          whenProfileExist={true}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      await waitFor(() => {
        expect(screen.getByText('Child Content')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Profile setting', () => {
    it('should call setProfile when profile data is available', async () => {
      // Use default MSW handler which returns a profile
      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      await waitFor(() => {
        expect(mockSetProfile).toHaveBeenCalledWith({
          firstName: 'test',
          lastName: 'test2',
          email: 't@t.com',
        });
      });
    });

    it('should not call setProfile when profile data is undefined', async () => {
      server.use(
        http.get(buildBackendUrl('/api/v1/users/profile'), () => {
          const data = {
            responseData: undefined,
          } as unknown as useProfileQueryReturnType['data'];
          return HttpResponse.json(data);
        }),
      );

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      // Wait for the query to complete
      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toBeInTheDocument();
      });

      expect(mockSetProfile).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle data without responseData property', async () => {
      server.use(
        http.get(buildBackendUrl('/api/v1/users/profile'), () => {
          // Return empty object (no responseData property)
          return HttpResponse.json({});
        }),
      );

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('navigate')).toHaveTextContent('/login');
      });
    });

    it('should handle complex children', async () => {
      // Use default MSW handler which returns a profile
      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
            <button type="button">Action</button>
          </div>
        </SessionCheckMiddleware>,
      );

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
      });
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Action' }),
      ).toBeInTheDocument();
    });
  });
});
