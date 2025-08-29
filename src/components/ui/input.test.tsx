import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('should render successfully', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('should render with different input types', () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    input = document.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="number" />);
    input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test value');
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test value');
  });

  it('should render with custom className', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should have proper placeholder text', () => {
    render(<Input placeholder="Type something here" />);
    const input = screen.getByPlaceholderText('Type something here');
    expect(input).toBeInTheDocument();
  });

  it('should forward all props correctly', () => {
    render(
      <Input
        id="test-input"
        name="testName"
        required
        maxLength={10}
        data-testid="test-input"
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'testName');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('maxlength', '10');
    expect(input).toHaveAttribute('data-testid', 'test-input');
  });

  it('should have proper focus and error styles', () => {
    const { rerender } = render(<Input />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus-visible:border-ring');

    rerender(<Input aria-invalid />);
    input = screen.getByRole('textbox');
    expect(input).toHaveClass('aria-invalid:border-destructive');
  });

  it('should handle readonly attribute', () => {
    render(
      <Input
        readOnly
        value="readonly value"
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveValue('readonly value');
  });

  it('should handle file input type', () => {
    render(
      <Input
        type="file"
        accept=".jpg,.png"
      />,
    );
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', '.jpg,.png');
    expect(input).toHaveClass('file:text-foreground');
  });

  it('should apply default text input styles', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'px-3',
      'py-1',
      'shadow-xs',
    );
  });
});
