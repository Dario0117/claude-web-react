import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SignOutDialog } from './sign-out-dialog';

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

const mockLogoutMutate = vi.fn();

vi.mock('@/services/users.http-service', () => ({
  useLogoutMutation: () => ({
    mutate: mockLogoutMutate,
  }),
}));

describe('SignOutDialog', () => {
  const mockOnOpenChange = vi.fn();

  it('should render dialog with title and description', () => {
    const { baseElement } = renderWithProviders(
      <SignOutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );
    // Dialog renders in portal, check in document body
    expect(baseElement.textContent).toContain('Sign out');
    expect(baseElement.textContent).toContain(
      'Are you sure you want to sign out?',
    );
  });

  it('should call logout mutation when sign out is confirmed', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SignOutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );
    const signOutButtons = screen.getAllByText('Sign out');
    const signOutButton = signOutButtons[1];
    if (signOutButton) {
      await user.click(signOutButton);
    }
    expect(mockLogoutMutate).toHaveBeenCalledWith({});
  });

  it('should call logout mutation on confirm', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SignOutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );
    const signOutButtons = screen.getAllByText('Sign out');
    const signOutButton = signOutButtons[1];
    if (signOutButton) {
      await user.click(signOutButton);
    }
    expect(mockLogoutMutate).toHaveBeenCalledWith({});
  });

  it('should render cancel button', () => {
    renderWithProviders(
      <SignOutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
