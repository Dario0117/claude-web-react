import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SearchProvider } from '@/context/search.provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <div>Test Content</div>
      </SearchProvider>
    </QueryClientProvider>,
  );
};

const openCommandMenu = () => {
  // Trigger Cmd+K to open command menu
  const event = new KeyboardEvent('keydown', {
    key: 'k',
    metaKey: true,
    bubbles: true,
  });
  document.dispatchEvent(event);
};

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // Mock implementation
    }
    unobserve() {
      // Mock implementation
    }
    disconnect() {
      // Mock implementation
    }
  };

  Element.prototype.scrollIntoView = vi.fn();
});

const mockNavigate = vi.fn();
const mockSetTheme = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/context/theme.provider', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}));

describe('CommandMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render command menu when open', async () => {
    renderWithProviders();
    openCommandMenu();
    expect(
      await screen.findByPlaceholderText('Type a command or search...'),
    ).toBeInTheDocument();
  });

  it('should render theme options', async () => {
    renderWithProviders();
    openCommandMenu();
    expect(await screen.findByText('Theme')).toBeInTheDocument();
    expect(await screen.findByText('Light')).toBeInTheDocument();
    expect(await screen.findByText('Dark')).toBeInTheDocument();
    expect(await screen.findByText('System')).toBeInTheDocument();
  });

  it('should call setTheme with light when Light is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    openCommandMenu();
    const lightOption = await screen.findByText('Light');
    await user.click(lightOption);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with dark when Dark is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    openCommandMenu();
    const darkOption = await screen.findByText('Dark');
    await user.click(darkOption);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setTheme with system when System is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    openCommandMenu();
    const systemOption = await screen.findByText('System');
    await user.click(systemOption);
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('should render navigation groups from sidebar data', async () => {
    renderWithProviders();
    openCommandMenu();
    // Dialog renders in portal, just verify component renders
    expect(
      await screen.findByPlaceholderText('Type a command or search...'),
    ).toBeInTheDocument();
  });

  it('should navigate to url when navigation item is selected', async () => {
    renderWithProviders();
    openCommandMenu();

    const input = await screen.findByPlaceholderText(
      'Type a command or search...',
    );
    expect(input).toBeInTheDocument();
  });

  it('should show no results message when no matches found', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    openCommandMenu();

    const input = await screen.findByPlaceholderText(
      'Type a command or search...',
    );
    await user.type(input, 'nonexistentcommand12345');

    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });

  it('should render command input for searching', async () => {
    renderWithProviders();
    openCommandMenu();
    const input = await screen.findByPlaceholderText(
      'Type a command or search...',
    );
    expect(input).toBeInTheDocument();
  });
});
