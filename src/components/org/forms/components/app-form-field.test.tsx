import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAppForm } from '../hooks/app-form';

describe('AppFormField', () => {
  const TestFormWrapper = ({
    initialValue = '',
    hasError = false,
    errorMessage = 'This field is required',
    required = false,
    type = 'text',
    placeholder = 'Enter value',
    label = 'Test Field',
    children,
  }: {
    initialValue?: string;
    hasError?: boolean;
    errorMessage?: string;
    required?: boolean;
    type?: string;
    placeholder?: string;
    label?: string;
    children?: React.ReactNode;
  }) => {
    const form = useAppForm({
      defaultValues: {
        testField: initialValue,
      },
      onSubmit: async () => {
        // Intentionally empty for testing
      },
    });

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <form.AppField
          name="testField"
          validators={{
            onChange: hasError ? () => errorMessage : undefined,
          }}
        >
          {(field) => (
            <field.AppFormField
              label={label}
              placeholder={placeholder}
              type={type as React.ComponentPropsWithoutRef<'input'>['type']}
              required={required}
            >
              {children}
            </field.AppFormField>
          )}
        </form.AppField>
      </form>
    );
  };

  it('should render field with label', () => {
    render(<TestFormWrapper label="Username" />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should render field with placeholder', () => {
    render(<TestFormWrapper placeholder="Enter username" />);

    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('should render required indicator when required is true', () => {
    render(
      <TestFormWrapper
        label="Email"
        required={true}
      />,
    );

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('should not render required indicator when required is false', () => {
    render(
      <TestFormWrapper
        label="Email"
        required={false}
      />,
    );

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should render input with correct type attribute', () => {
    render(
      <TestFormWrapper
        type="email"
        label="Email"
      />,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should render password input type', () => {
    render(
      <TestFormWrapper
        type="password"
        label="Password"
      />,
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should render text input by default', () => {
    render(<TestFormWrapper label="Name" />);

    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should display initial value', () => {
    render(
      <TestFormWrapper
        initialValue="test value"
        label="Field"
      />,
    );

    const input = screen.getByLabelText('Field') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should update input value on user typing', async () => {
    const user = userEvent.setup();
    render(<TestFormWrapper label="Username" />);

    const input = screen.getByLabelText('Username') as HTMLInputElement;

    await user.type(input, 'newvalue');

    await waitFor(() => {
      expect(input.value).toBe('newvalue');
    });
  });

  it('should display error message when field has error', async () => {
    const user = userEvent.setup();
    render(
      <TestFormWrapper
        label="Username"
        hasError={true}
        errorMessage="Username is required"
      />,
    );

    const input = screen.getByLabelText('Username');

    // Trigger onChange to show error
    await user.type(input, 'a');
    await user.clear(input);

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });
  });

  it('should set aria-invalid when field has error', async () => {
    const user = userEvent.setup();
    render(
      <TestFormWrapper
        label="Email"
        hasError={true}
        errorMessage="Invalid email"
      />,
    );

    const input = screen.getByLabelText('Email');

    // Trigger onChange to show error
    await user.type(input, 'a');
    await user.clear(input);

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should set aria-describedby when field has error', async () => {
    const user = userEvent.setup();
    render(
      <TestFormWrapper
        label="Password"
        hasError={true}
        errorMessage="Password is required"
      />,
    );

    const input = screen.getByLabelText('Password');

    // Trigger onChange to show error
    await user.type(input, 'a');
    await user.clear(input);

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-describedby', 'testField-error');
    });
  });

  it('should render error message with role alert', async () => {
    const user = userEvent.setup();
    render(
      <TestFormWrapper
        label="Field"
        hasError={true}
        errorMessage="Error message"
      />,
    );

    const input = screen.getByLabelText('Field');

    // Trigger onChange to show error
    await user.type(input, 'a');
    await user.clear(input);

    await waitFor(() => {
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveTextContent('Error message');
    });
  });

  it('should not display error message when field has no error', () => {
    render(
      <TestFormWrapper
        label="Field"
        hasError={false}
      />,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <TestFormWrapper label="Field">
        <span data-testid="custom-child">Custom content</span>
      </TestFormWrapper>,
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('should have required attribute when required is true', () => {
    render(
      <TestFormWrapper
        label="Email"
        required={true}
      />,
    );

    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute('required');
  });

  it('should not have required attribute when required is false', () => {
    render(
      <TestFormWrapper
        label="Email"
        required={false}
      />,
    );

    const input = screen.getByLabelText('Email');
    expect(input).not.toHaveAttribute('required');
  });

  it('should handle blur event', async () => {
    const user = userEvent.setup();
    render(<TestFormWrapper label="Username" />);

    const input = screen.getByLabelText('Username');

    await user.click(input);
    await user.tab();

    // Input should lose focus
    expect(input).not.toHaveFocus();
  });

  it('should display "Invalid input" for non-string error messages', async () => {
    const user = userEvent.setup();
    const TestFormWrapperWithObjectError = () => {
      const form = useAppForm({
        defaultValues: {
          testField: '',
        },
        onSubmit: async () => {
          // Intentionally empty for testing
        },
      });

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <form.AppField
            name="testField"
            validators={{
              onChange: () => ({ type: 'required' }) as unknown as string,
            }}
          >
            {(field) => (
              <field.AppFormField
                label="Field"
                placeholder="Enter value"
              />
            )}
          </form.AppField>
        </form>
      );
    };

    render(<TestFormWrapperWithObjectError />);

    const input = screen.getByLabelText('Field');

    // Trigger onChange to show error
    await user.type(input, 'a');
    await user.clear(input);

    await waitFor(() => {
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });
  });

  it('should handle number input type', () => {
    render(
      <TestFormWrapper
        type="number"
        label="Age"
      />,
    );

    const input = screen.getByLabelText('Age');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should properly associate label with input via htmlFor', () => {
    render(<TestFormWrapper label="Username" />);

    const label = screen.getByText('Username').closest('label');
    const input = screen.getByLabelText('Username');

    expect(label).toHaveAttribute('for', 'testField');
    expect(input).toHaveAttribute('id', 'testField');
  });

  it('should render with proper structure', () => {
    const { container } = render(<TestFormWrapper label="Field" />);

    const gridContainer = container.querySelector('.grid.gap-3');
    expect(gridContainer).toBeInTheDocument();

    const flexContainer = container.querySelector('.flex.items-center');
    expect(flexContainer).toBeInTheDocument();
  });
});
