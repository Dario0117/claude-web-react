import { render, screen } from '@testing-library/react';
import { HomePage } from './home.page';

describe('HomePage', () => {
  it('should render the page content', () => {
    render(<HomePage />);

    expect(screen.getByText('Home stats for nerds')).toBeInTheDocument();
  });

  it('should have proper page structure and styling', () => {
    const { container } = render(<HomePage />);

    const section = container.querySelector('section');
    expect(section).toHaveClass(
      'flex',
      'min-h-svh',
      'w-full',
      'items-center',
      'justify-center',
      'p-6',
      'md:p-10',
    );

    const contentDiv = container.querySelector('.w-full.max-w-sm');
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toHaveTextContent('Home stats for nerds');
  });

  it('should render accessibility landmarks', () => {
    render(<HomePage />);

    const section = screen.getByText('Home stats for nerds').closest('section');
    expect(section).toBeInTheDocument();
  });

  it('should maintain consistent rendering on multiple renders', () => {
    const { rerender } = render(<HomePage />);

    expect(screen.getByText('Home stats for nerds')).toBeInTheDocument();

    rerender(<HomePage />);

    expect(screen.getByText('Home stats for nerds')).toBeInTheDocument();
  });
});
