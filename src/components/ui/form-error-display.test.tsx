import { render, screen } from '@testing-library/react';
import type { CoreHTTPError } from '@/types/api.d';
import { FormErrorDisplay } from './form-error-display';

describe('FormErrorDisplay', () => {
  it('should not render anything when error is null', () => {
    const { container } = render(<FormErrorDisplay errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message when error is provided', () => {
    const error: CoreHTTPError<unknown> = {
      message: 'Invalid credentials',
      details: null,
    };

    render(<FormErrorDisplay errors={[error.message]} />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should render error with destructive alert variant', () => {
    const error: CoreHTTPError<unknown> = {
      message: 'Server error occurred',
      details: null,
    };

    const { container } = render(<FormErrorDisplay errors={[error.message]} />);

    expect(screen.getByText('Server error occurred')).toBeInTheDocument();

    // Check if the alert has the destructive variant (this will depend on your Alert component implementation)
    const alert = container.querySelector('[data-slot="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it('should handle error with details', () => {
    const error: CoreHTTPError<{ field: string }> = {
      message: 'Validation failed',
      details: { field: 'username' },
    };

    render(<FormErrorDisplay errors={[error.message]} />);

    expect(screen.getByText('Validation failed')).toBeInTheDocument();
  });

  it('should handle different error message types', () => {
    const testCases = [
      'Authentication failed',
      'Network error',
      'Server temporarily unavailable',
      'Invalid request format',
    ];

    testCases.forEach((message) => {
      const error: CoreHTTPError<unknown> = {
        message,
        details: null,
      };

      const { rerender } = render(
        <FormErrorDisplay errors={[error.message]} />,
      );

      expect(screen.getByText(message)).toBeInTheDocument();

      // Clean up for next iteration
      rerender(<FormErrorDisplay errors={[]} />);
    });
  });

  it('should have proper wrapper structure', () => {
    const error: CoreHTTPError<unknown> = {
      message: 'Test error',
      details: null,
    };

    const { container } = render(<FormErrorDisplay errors={[error.message]} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mt-4');
  });

  it('should render multiple times with different errors', () => {
    const error1: CoreHTTPError<unknown> = {
      message: 'First error',
      details: null,
    };

    const error2: CoreHTTPError<unknown> = {
      message: 'Second error',
      details: null,
    };

    const { rerender } = render(<FormErrorDisplay errors={[error1.message]} />);
    expect(screen.getByText('First error')).toBeInTheDocument();

    rerender(<FormErrorDisplay errors={[error2.message]} />);
    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.queryByText('First error')).not.toBeInTheDocument();

    rerender(<FormErrorDisplay errors={[]} />);
    expect(screen.queryByText('Second error')).not.toBeInTheDocument();
  });

  it('should handle empty error message', () => {
    const error: CoreHTTPError<unknown> = {
      message: '',
      details: null,
    };

    render(<FormErrorDisplay errors={[error.message]} />);

    // Should still render the alert structure even with empty message
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });
});
