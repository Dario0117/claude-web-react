import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('should render skeleton element', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <Skeleton
        className="custom-class"
        data-testid="skeleton"
      />,
    );
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('custom-class');
  });

  it('should render with data-slot attribute', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
  });

  it('should accept additional props', () => {
    render(
      <Skeleton
        data-testid="skeleton"
        aria-label="Loading"
      />,
    );
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading');
  });
});
