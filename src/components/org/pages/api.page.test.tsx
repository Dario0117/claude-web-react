import { render, screen } from '@testing-library/react';
import { APIPage } from './api.page';

describe('APIPage', () => {
  it('should render the page content', () => {
    render(<APIPage />);

    expect(screen.getByText('Hello API!')).toBeInTheDocument();
  });

  it('should render a div element', () => {
    const { container } = render(<APIPage />);

    const div = container.querySelector('div');
    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent('Hello API!');
  });

  it('should maintain consistent rendering on multiple renders', () => {
    const { rerender } = render(<APIPage />);

    expect(screen.getByText('Hello API!')).toBeInTheDocument();

    rerender(<APIPage />);

    expect(screen.getByText('Hello API!')).toBeInTheDocument();
  });
});
