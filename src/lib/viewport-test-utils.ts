/**
 * Viewport Testing Utilities
 *
 * Helpers for testing responsive components at different viewport sizes.
 * These utilities simulate viewport changes during tests to verify mobile-responsive behavior.
 */

/**
 * Sets the viewport to mobile size (iPhone SE)
 * @example
 * ```ts
 * beforeEach(() => {
 *   setMobileViewport();
 * });
 * ```
 */
export function setMobileViewport() {
  window.innerWidth = 375;
  window.innerHeight = 667;
  window.dispatchEvent(new Event('resize'));
}

/**
 * Sets the viewport to tablet size (iPad)
 * @example
 * ```ts
 * beforeEach(() => {
 *   setTabletViewport();
 * });
 * ```
 */
export function setTabletViewport() {
  window.innerWidth = 768;
  window.innerHeight = 1024;
  window.dispatchEvent(new Event('resize'));
}

/**
 * Sets the viewport to desktop size
 * @example
 * ```ts
 * beforeEach(() => {
 *   setDesktopViewport();
 * });
 * ```
 */
export function setDesktopViewport() {
  window.innerWidth = 1280;
  window.innerHeight = 720;
  window.dispatchEvent(new Event('resize'));
}

/**
 * Custom viewport size
 * @param width - Viewport width in pixels
 * @param height - Viewport height in pixels
 */
export function setViewport(width: number, height: number) {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
}
