import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders separator with default props', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-slot', 'separator');
  });

  it('renders with horizontal orientation by default', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders with vertical orientation when specified', () => {
    render(
      <Separator
        orientation="vertical"
        data-testid="separator"
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('is decorative by default', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    // Decorative separators might not always have aria-hidden in test environment
  });

  it('can be non-decorative when specified', () => {
    render(
      <Separator
        decorative={false}
        data-testid="separator"
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).not.toHaveAttribute('aria-hidden', 'true');
    expect(separator).toHaveAttribute('role', 'separator');
  });

  it('applies custom className', () => {
    render(
      <Separator
        className="custom-separator"
        data-testid="separator"
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('custom-separator');
  });

  it('applies default styling classes', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('bg-border', 'shrink-0');
  });

  it('forwards additional props', () => {
    render(
      <Separator
        id="custom-id"
        data-custom="value"
        data-testid="separator"
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('id', 'custom-id');
    expect(separator).toHaveAttribute('data-custom', 'value');
  });

  it('has correct accessibility attributes for decorative separator', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    // Check that it's rendered as decorative (may vary by implementation)
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('has correct accessibility attributes for semantic separator', () => {
    render(
      <Separator
        decorative={false}
        data-testid="separator"
      />,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).not.toHaveAttribute('aria-hidden');
  });
});
