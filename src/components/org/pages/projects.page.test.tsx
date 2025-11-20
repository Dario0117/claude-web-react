import { render, screen } from '@testing-library/react';
import { ProjectsPage } from './projects.page';

describe('ProjectsPage', () => {
  it('should render the page content', () => {
    render(<ProjectsPage />);

    expect(screen.getByText('Hello projects!')).toBeInTheDocument();
  });

  it('should render a div element', () => {
    const { container } = render(<ProjectsPage />);

    const div = container.querySelector('div');
    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent('Hello projects!');
  });

  it('should maintain consistent rendering on multiple renders', () => {
    const { rerender } = render(<ProjectsPage />);

    expect(screen.getByText('Hello projects!')).toBeInTheDocument();

    rerender(<ProjectsPage />);

    expect(screen.getByText('Hello projects!')).toBeInTheDocument();
  });
});
