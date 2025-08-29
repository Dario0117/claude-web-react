import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('should render successfully with default variant and size', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-slot', 'button');
  });

  it('should render with custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole('button', { name: 'Test' });
    expect(button).toHaveClass('custom-class');
  });

  it('should render with different variants', () => {
    const { rerender } = render(
      <Button variant="destructive">Destructive</Button>,
    );
    let button = screen.getByRole('button', { name: 'Destructive' });
    expect(button).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button', { name: 'Outline' });
    expect(button).toHaveClass('border');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-secondary');

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button', { name: 'Ghost' });
    expect(button).toHaveClass('hover:bg-accent');

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole('button', { name: 'Link' });
    expect(button).toHaveClass('text-primary', 'underline-offset-4');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('h-8');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: 'Large' });
    expect(button).toHaveClass('h-10');

    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole('button', { name: 'Icon' });
    expect(button).toHaveClass('size-9');
  });

  it('should handle click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveAttribute('data-slot', 'button');
  });

  it('should forward all props correctly', () => {
    render(
      <Button
        type="submit"
        aria-label="Submit form"
        data-testid="submit-button"
      >
        Submit
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Submit form' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
    expect(button).toHaveAttribute('data-testid', 'submit-button');
  });

  it('should have proper focus styles', () => {
    render(<Button>Focus me</Button>);
    const button = screen.getByRole('button', { name: 'Focus me' });
    expect(button).toHaveClass('focus-visible:ring-ring/50');
  });

  it('should combine variant and size classes correctly', () => {
    render(
      <Button
        variant="destructive"
        size="lg"
      >
        Large Destructive
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Large Destructive' });
    expect(button).toHaveClass('bg-destructive', 'h-10');
  });
});
