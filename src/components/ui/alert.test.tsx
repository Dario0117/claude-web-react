import { render } from '@testing-library/react';
import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Alert>Alert</Alert>);
    expect(baseElement).toBeTruthy();
  });

  it('should render title successfully', () => {
    const { baseElement } = render(
      <Alert>
        <AlertTitle>Alert title</AlertTitle>
      </Alert>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render description successfully', () => {
    const { baseElement } = render(
      <Alert>
        <AlertTitle>Alert title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>,
    );
    expect(baseElement).toBeTruthy();
  });
});
