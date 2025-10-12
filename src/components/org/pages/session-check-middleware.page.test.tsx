import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuthenticationStore } from '@/stores/authentication.store';
import type { Profile } from '@/stores/authentication.store.d';
import { SessionCheckMiddleware } from './session-check-middleware.page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

// Mock the authentication store
vi.mock('@/stores/authentication.store', () => ({
  useAuthenticationStore: vi.fn(),
}));

// Mock the navigation component
vi.mock('@tanstack/react-router', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
}));

// Mock the profile query
vi.mock('@/services/users.http-service', () => ({
  useProfileQuery: vi.fn(),
}));

const mockUseAuthenticationStore = vi.mocked(useAuthenticationStore);
const mockUseProfileQuery = vi.mocked(
  await import('@/services/users.http-service'),
).useProfileQuery;

const mockProfile: Profile = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
};

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
      mockUseProfileQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      const { container } = renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });
  });

  describe('When profile exists - redirect scenario', () => {
    it('should redirect when profile exists and whenProfileExist is true', () => {
      mockUseProfileQuery.mockReturnValue({
        data: { responseData: mockProfile },
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      renderWithProviders(
        <SessionCheckMiddleware
          to="/"
          whenProfileExist={true}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      expect(screen.getByTestId('navigate')).toHaveTextContent('/');
      expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });

    it('should render children when profile exists and whenProfileExist is false', () => {
      mockUseProfileQuery.mockReturnValue({
        data: { responseData: mockProfile },
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      expect(screen.getByText('Child Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('When profile does not exist - redirect scenario', () => {
    it('should redirect when profile does not exist and whenProfileExist is false', () => {
      mockUseProfileQuery.mockReturnValue({
        data: { responseData: undefined },
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      expect(screen.getByTestId('navigate')).toHaveTextContent('/login');
      expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });

    it('should render children when profile does not exist and whenProfileExist is true', () => {
      mockUseProfileQuery.mockReturnValue({
        data: { responseData: undefined },
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      renderWithProviders(
        <SessionCheckMiddleware
          to="/"
          whenProfileExist={true}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      expect(screen.getByText('Child Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Profile setting', () => {
    it('should call setProfile when profile data is available', async () => {
      mockUseProfileQuery.mockReturnValue({
        data: { responseData: mockProfile },
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      await waitFor(() => {
        expect(mockSetProfile).toHaveBeenCalledWith(mockProfile);
      });
    });

    it('should not call setProfile when profile data is undefined', () => {
      mockUseProfileQuery.mockReturnValue({
        data: { responseData: undefined },
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      expect(mockSetProfile).not.toHaveBeenCalled();
    });

    it('should not call setProfile when data is null', () => {
      mockUseProfileQuery.mockReturnValue({
        data: null,
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      expect(mockSetProfile).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle data without responseData property', () => {
      mockUseProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

      renderWithProviders(
        <SessionCheckMiddleware
          to="/login"
          whenProfileExist={false}
        >
          <div>Child Content</div>
        </SessionCheckMiddleware>,
      );

      expect(screen.getByTestId('navigate')).toHaveTextContent('/login');
    });

    it('should handle complex children', () => {
      mockUseProfileQuery.mockReturnValue({
        data: { responseData: mockProfile },
        isLoading: false,
        // biome-ignore lint/suspicious/noExplicitAny: Test mock
      } as any);

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

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Action' }),
      ).toBeInTheDocument();
    });
  });
});
