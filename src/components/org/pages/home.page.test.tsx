import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/lib/test-wrappers.utils';
import { HomePage } from './home.page';

describe('HomePage', () => {
  it('should render loading state initially', () => {
    const { container } = renderWithProviders(<HomePage />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render organization dashboard with stats', async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByText('Welcome to Test Organization'),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('Manage your devices and execute remote commands'),
    ).toBeInTheDocument();
  });

  it('should render stat cards with correct data', async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Devices')).toBeInTheDocument();
    });

    expect(screen.getByText('Commands (24h)')).toBeInTheDocument();
    expect(screen.getByText('Tier')).toBeInTheDocument();
    expect(screen.getByText('Free Tier')).toBeInTheDocument();
  });

  it('should render recent activity section', async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });
});
