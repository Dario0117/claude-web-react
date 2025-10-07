import { render, screen } from '@testing-library/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from './header';

const mockMatchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
});

function renderHeader(props = {}) {
  return render(
    <SidebarProvider>
      <Header {...props}>
        <div data-testid="header-content">Header Content</div>
      </Header>
    </SidebarProvider>,
  );
}

describe('Header', () => {
  it('should render header with children', () => {
    renderHeader();

    expect(screen.getByTestId('header-content')).toBeInTheDocument();
  });

  it('should render sidebar trigger button', () => {
    renderHeader();

    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });

  it('should apply fixed class when fixed prop is true', () => {
    const { container } = renderHeader({ fixed: true });

    const header = container.querySelector('header');
    expect(header).toHaveClass(
      'header-fixed',
      'peer/header',
      'sticky',
      'top-0',
    );
  });

  it('should not apply fixed class when fixed prop is false', () => {
    const { container } = renderHeader({ fixed: false });

    const header = container.querySelector('header');
    expect(header).not.toHaveClass('header-fixed');
    expect(header).not.toHaveClass('peer/header');
  });

  it('should apply custom className', () => {
    const { container } = renderHeader({ className: 'custom-header' });

    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-header');
  });

  it('should have correct height class', () => {
    const { container } = renderHeader();

    const header = container.querySelector('header');
    expect(header).toHaveClass('h-16');
  });

  it('should apply shadow-none class when not scrolled', () => {
    const { container } = renderHeader({ fixed: true });

    const header = container.querySelector('header');
    expect(header).toHaveClass('shadow-none');
  });

  it('should add scroll event listener when component mounts', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

    renderHeader({ fixed: true });

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true },
    );

    addEventListenerSpy.mockRestore();
  });

  it('should remove scroll event listener when component unmounts', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHeader({ fixed: true });
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should pass through additional HTML attributes', () => {
    const { container } = renderHeader({ 'data-testid': 'test-header' });

    const header = container.querySelector('header');
    expect(header).toHaveAttribute('data-testid', 'test-header');
  });

  it('should render SidebarTrigger with correct variant', () => {
    renderHeader();

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('max-md:scale-125');
  });
});
