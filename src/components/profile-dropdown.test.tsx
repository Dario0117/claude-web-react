import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProfileDropdown } from './profile-dropdown';

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a
      href={to}
      {...props}
    >
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ href: '/' }),
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}));

describe('ProfileDropdown', () => {
  it('should render profile avatar button', () => {
    render(<ProfileDropdown />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render avatar fallback', () => {
    render(<ProfileDropdown />);
    expect(screen.getByText('SN')).toBeInTheDocument();
  });

  it('should open dropdown menu when avatar is clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('satnaing')).toBeInTheDocument();
    expect(screen.getByText('satnaingdev@gmail.com')).toBeInTheDocument();
  });

  it('should render menu items', async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('New Team')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should render keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('⇧⌘P')).toBeInTheDocument();
    expect(screen.getByText('⌘B')).toBeInTheDocument();
    expect(screen.getByText('⌘S')).toBeInTheDocument();
    expect(screen.getByText('⇧⌘Q')).toBeInTheDocument();
  });

  it('should open sign out dialog when sign out is clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown />);
    const button = screen.getByRole('button');
    await user.click(button);
    const signOutItem = screen.getByText('Sign out');
    await user.click(signOutItem);
    expect(
      await screen.findByText('Sign out', {
        selector: '[data-slot="alert-dialog-title"]',
      }),
    ).toBeInTheDocument();
  });

  it('should render profile links', async () => {
    const user = userEvent.setup();
    render(<ProfileDropdown />);
    const button = screen.getByRole('button');
    await user.click(button);
    const profileLink = screen.getByText('Profile').closest('a');
    const billingLink = screen.getByText('Billing').closest('a');
    const settingsLink = screen.getByText('Settings').closest('a');
    expect(profileLink).toBeInTheDocument();
    expect(billingLink).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
  });
});
