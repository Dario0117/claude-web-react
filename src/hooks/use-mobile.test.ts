import { act, renderHook } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean): MediaQueryList => ({
  matches,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  onchange: null,
  media: '',
});

// Store original window.innerWidth
const originalInnerWidth = window.innerWidth;

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true when window width is less than mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    vi.spyOn(window, 'matchMedia').mockImplementation(() =>
      mockMatchMedia(true),
    );

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should return false when window width is greater than or equal to mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    vi.spyOn(window, 'matchMedia').mockImplementation(() =>
      mockMatchMedia(false),
    );

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should update when window size changes', () => {
    const mockMql: MediaQueryList = {
      ...mockMatchMedia(false),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMql);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate window resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      const changeHandler = (mockMql.addEventListener as any).mock.calls.find(
        (call: any[]) => call[0] === 'change',
      )?.[1];

      if (changeHandler) {
        changeHandler();
      }
    });

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const mockMql: MediaQueryList = {
      ...mockMatchMedia(false),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.spyOn(window, 'matchMedia').mockReturnValue(mockMql);

    const { unmount } = renderHook(() => useIsMobile());

    expect(mockMql.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );

    unmount();

    expect(mockMql.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });
});
