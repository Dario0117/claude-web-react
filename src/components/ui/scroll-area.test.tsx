import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './scroll-area';

describe('ScrollArea', () => {
  it('should render scroll area with children', () => {
    render(
      <ScrollArea data-testid="scroll-area">
        <div>Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render with vertical orientation by default', () => {
    render(
      <ScrollArea data-testid="scroll-area">
        <div>Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
  });

  it('should render with horizontal orientation', () => {
    render(
      <ScrollArea
        orientation="horizontal"
        data-testid="scroll-area"
      >
        <div>Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <ScrollArea
        className="custom-class"
        data-testid="scroll-area"
      >
        <div>Content</div>
      </ScrollArea>,
    );
    const scrollArea = screen.getByTestId('scroll-area');
    expect(scrollArea).toHaveClass('custom-class');
  });

  it('should render with data-slot attributes', () => {
    render(
      <ScrollArea data-testid="scroll-area">
        <div>Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area')).toHaveAttribute(
      'data-slot',
      'scroll-area',
    );
  });

  it('should accept additional props', () => {
    render(
      <ScrollArea
        data-testid="scroll-area"
        aria-label="Scrollable content"
      >
        <div>Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area')).toHaveAttribute(
      'aria-label',
      'Scrollable content',
    );
  });
});
