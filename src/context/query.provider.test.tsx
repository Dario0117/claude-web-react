import { useQuery } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryProvider, queryClient } from './query.provider';

// Test component that uses React Query
function TestComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: () => {
      return { message: 'test data' };
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div data-testid="result">{data?.message}</div>;
}

describe('QueryProvider', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('should render children', () => {
    render(
      <QueryProvider>
        <div data-testid="child">Test Content</div>
      </QueryProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should provide QueryClient to children', async () => {
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('test data');
    });
  });

  it('should allow queries to be executed', async () => {
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('result')).toBeInTheDocument();
    });
  });
});

describe('queryClient', () => {
  it('should export a QueryClient instance', () => {
    expect(queryClient).toBeDefined();
    expect(typeof queryClient.getQueryCache).toBe('function');
    expect(typeof queryClient.getMutationCache).toBe('function');
  });

  it('should allow clearing queries', () => {
    queryClient.setQueryData(['test-key'], { data: 'test' });
    expect(queryClient.getQueryData(['test-key'])).toEqual({ data: 'test' });

    queryClient.clear();
    expect(queryClient.getQueryData(['test-key'])).toBeUndefined();
  });
});
