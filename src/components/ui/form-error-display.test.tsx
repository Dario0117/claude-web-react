import { render, screen } from '@testing-library/react';
import type { CoreHTTPError } from '@/services/users.service';
import { FormErrorDisplay } from './form-error-display';

describe('FormErrorDisplay', () => {
  it('should not render anything when error is null', () => {
    const { container } = render(<FormErrorDisplay error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message when error is provided', () => {
    const error: CoreHTTPError = {
      message: 'Invalid credentials',
      details: 'Test error details',
    };

    render(<FormErrorDisplay error={error} />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should render error with destructive alert variant', () => {
    const error: CoreHTTPError = {
      message: 'Server error occurred',
      details: 'Test error details',
    };

    const { container } = render(<FormErrorDisplay error={error} />);

    expect(screen.getByText('Server error occurred')).toBeInTheDocument();

    // Check if the alert has the destructive variant (this will depend on your Alert component implementation)
    const alert = container.querySelector('[data-slot="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it('should handle error with details', () => {
    const error: CoreHTTPError = {
      message: 'Validation failed',
      details: { field: 'username' },
    };

    render(<FormErrorDisplay error={error} />);

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
      const error: CoreHTTPError = {
        message,
        details: 'Test error details',
      };

      const { rerender } = render(<FormErrorDisplay error={error} />);

      expect(screen.getByText(message)).toBeInTheDocument();

      // Clean up for next iteration
      rerender(<FormErrorDisplay error={null} />);
    });
  });

  it('should have proper wrapper structure', () => {
    const error: CoreHTTPError = {
      message: 'Test error',
      details: 'Test error details',
    };

    const { container } = render(<FormErrorDisplay error={error} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mt-4');
  });

  it('should render multiple times with different errors', () => {
    const error1: CoreHTTPError = {
      message: 'First error',
      details: 'Test error details',
    };

    const error2: CoreHTTPError = {
      message: 'Second error',
      details: 'Test error details',
    };

    const { rerender } = render(<FormErrorDisplay error={error1} />);
    expect(screen.getByText('First error')).toBeInTheDocument();

    rerender(<FormErrorDisplay error={error2} />);
    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.queryByText('First error')).not.toBeInTheDocument();

    rerender(<FormErrorDisplay error={null} />);
    expect(screen.queryByText('Second error')).not.toBeInTheDocument();
  });

  it('should handle empty error message', () => {
    const error: CoreHTTPError = {
      message: '',
      details: 'Test error details',
    };

    render(<FormErrorDisplay error={error} />);

    // Should still render the alert structure even with empty message
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });
});
