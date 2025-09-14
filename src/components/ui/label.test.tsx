import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  it('should render successfully', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('should render with custom className', () => {
    render(<Label className="custom-label">Label</Label>);
    const label = screen.getByText('Label');
    expect(label).toHaveClass('custom-label');
  });

  it('should have proper default styles', () => {
    render(<Label>Label</Label>);
    const label = screen.getByText('Label');
    expect(label).toHaveClass(
      'text-foreground',
      'text-sm',
      'leading-4',
      'font-medium',
      'select-none',
    );
  });

  it('should forward all props correctly', () => {
    render(
      <Label
        htmlFor="input-id"
        id="label-id"
        data-testid="test-label"
      >
        Input Label
      </Label>,
    );
    const label = screen.getByText('Input Label');
    expect(label).toHaveAttribute('for', 'input-id');
    expect(label).toHaveAttribute('id', 'label-id');
    expect(label).toHaveAttribute('data-testid', 'test-label');
  });

  it('should work with form inputs', () => {
    render(
      <div>
        <Label htmlFor="email">Email Address</Label>
        <input
          id="email"
          type="email"
        />
      </div>,
    );

    const label = screen.getByText('Email Address');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'email');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('should handle disabled state styles', () => {
    render(
      <div
        className="group"
        data-disabled="true"
      >
        <Label>Disabled Label</Label>
      </div>,
    );
    const label = screen.getByText('Disabled Label');
    expect(label).toHaveClass('group-data-[disabled=true]:pointer-events-none');
  });

  it('should render children correctly', () => {
    render(
      <Label>
        <span>Icon</span>
        Label Text
      </Label>,
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  it('should handle complex content', () => {
    render(
      <Label>
        Required Field
        <span className="text-destructive">*</span>
      </Label>,
    );

    expect(screen.getByText('Required Field')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
