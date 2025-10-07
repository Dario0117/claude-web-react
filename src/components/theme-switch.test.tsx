import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from '@/context/theme.provider';
import { ThemeSwitch } from './theme-switch';

// Mock the theme provider
vi.mock('@/context/theme.provider', () => ({
  useTheme: vi.fn(),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
}));

describe('ThemeSwitch', () => {
  const mockSetTheme = vi.fn();
  const mockUseTheme = vi.mocked(useTheme);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    // Mock the theme-color meta tag
    const metaTag = document.createElement('meta');
    metaTag.name = 'theme-color';
    metaTag.content = '#fff';
    document.head.appendChild(metaTag);
  });

  afterEach(() => {
    // Clean up meta tag
    const metaTag = document.querySelector("meta[name='theme-color']");
    if (metaTag) {
      document.head.removeChild(metaTag);
    }
  });

  it('should render theme switch button with correct accessibility', () => {
    render(<ThemeSwitch />);

    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('should render sun and moon icons', () => {
    render(<ThemeSwitch />);

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('should open dropdown menu when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    const trigger = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(trigger);

    expect(
      screen.getByRole('menuitem', { name: /light/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /dark/i })).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /system/i }),
    ).toBeInTheDocument();
  });

  it('should call setTheme with "light" when Light option is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    const trigger = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(trigger);

    const lightOption = screen.getByRole('menuitem', { name: /light/i });
    await user.click(lightOption);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with "dark" when Dark option is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    const trigger = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(trigger);

    const darkOption = screen.getByRole('menuitem', { name: /dark/i });
    await user.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setTheme with "system" when System option is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    const trigger = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(trigger);

    const systemOption = screen.getByRole('menuitem', { name: /system/i });
    await user.click(systemOption);

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('should show check marks for theme options', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitch />);

    const trigger = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(trigger);

    // Verify all check icons are present in the dropdown
    const lightOption = screen.getByRole('menuitem', { name: /light/i });
    const darkOption = screen.getByRole('menuitem', { name: /dark/i });
    const systemOption = screen.getByRole('menuitem', { name: /system/i });

    const lightCheck = lightOption.querySelector('[data-testid="check-icon"]');
    const darkCheck = darkOption.querySelector('[data-testid="check-icon"]');
    const systemCheck = systemOption.querySelector(
      '[data-testid="check-icon"]',
    );

    expect(lightCheck).toBeInTheDocument();
    expect(darkCheck).toBeInTheDocument();
    expect(systemCheck).toBeInTheDocument();
  });

  it('should update theme-color meta tag when theme changes to dark', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitch />);

    const metaTag = document.querySelector("meta[name='theme-color']");
    expect(metaTag).toHaveAttribute('content', '#020817');
  });

  it('should update theme-color meta tag when theme changes to light', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitch />);

    const metaTag = document.querySelector("meta[name='theme-color']");
    expect(metaTag).toHaveAttribute('content', '#fff');
  });

  it('should handle missing theme-color meta tag gracefully', () => {
    // Remove the meta tag
    const metaTag = document.querySelector("meta[name='theme-color']");
    if (metaTag) {
      document.head.removeChild(metaTag);
    }

    // Should not throw error when meta tag is missing
    expect(() => {
      render(<ThemeSwitch />);
    }).not.toThrow();
  });

  it('should close dropdown when escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitch />);

    const trigger = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(trigger);

    // Verify dropdown is open
    expect(
      screen.getByRole('menuitem', { name: /light/i }),
    ).toBeInTheDocument();

    // Press escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Verify dropdown is closed
    expect(
      screen.queryByRole('menuitem', { name: /light/i }),
    ).not.toBeInTheDocument();
  });

  it('should have correct styling classes on trigger button', () => {
    render(<ThemeSwitch />);

    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toHaveClass('scale-95', 'rounded-full');
  });
});
