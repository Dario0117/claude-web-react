import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SignOutDialog } from './sign-out-dialog';

const mockNavigate = vi.fn();
const mockAuthReset = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    href: '/app/d',
  }),
}));

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({
    auth: {
      reset: mockAuthReset,
    },
  }),
}));

describe('SignOutDialog', () => {
  const mockOnOpenChange = vi.fn();

  it('should render dialog with title and description', () => {
    const { baseElement } = render(
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

  it('should call auth.reset and navigate when sign out is confirmed', async () => {
    const user = userEvent.setup();
    render(
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
    expect(mockAuthReset).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/login',
      search: { redirect: '/app/d' },
      replace: true,
    });
  });

  it('should preserve current location for redirect', async () => {
    const user = userEvent.setup();
    render(
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
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        search: { redirect: '/app/d' },
      }),
    );
  });

  it('should render cancel button', () => {
    render(
      <SignOutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
