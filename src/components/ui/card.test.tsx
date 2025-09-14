import { render, screen } from '@testing-library/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render successfully', () => {
      render(<Card>Card content</Card>);
      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('data-slot', 'card');
    });

    it('should render with custom className', () => {
      render(<Card className="custom-card">Card</Card>);
      const card = screen.getByText('Card');
      expect(card).toHaveClass('custom-card');
    });

    it('should have default card styles', () => {
      render(<Card>Card</Card>);
      const card = screen.getByText('Card');
      expect(card).toHaveClass(
        'bg-card',
        'text-card-foreground',
        'flex',
        'flex-col',
        'gap-6',
        'border',
        'py-6',
      );
    });
  });

  describe('CardHeader', () => {
    it('should render successfully', () => {
      render(<CardHeader>Header content</CardHeader>);
      const header = screen.getByText('Header content');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'card-header');
    });

    it('should have proper header styles', () => {
      render(<CardHeader>Header</CardHeader>);
      const header = screen.getByText('Header');
      expect(header).toHaveClass('flex', 'flex-col', 'gap-1.5', 'px-6');
    });
  });

  describe('CardTitle', () => {
    it('should render successfully', () => {
      render(<CardTitle>Card Title</CardTitle>);
      const title = screen.getByText('Card Title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute('data-slot', 'card-title');
    });

    it('should have proper title styles', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass(
        'font-medium',
        'text-[15px]',
        'text-muted-foreground',
      );
    });
  });

  describe('CardDescription', () => {
    it('should render successfully', () => {
      render(<CardDescription>Card description</CardDescription>);
      const description = screen.getByText('Card description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute('data-slot', 'card-description');
    });

    it('should have proper description styles', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description).toHaveClass('text-muted-foreground', 'text-sm');
    });
  });

  describe('CardContent', () => {
    it('should render successfully', () => {
      render(<CardContent>Card content</CardContent>);
      const content = screen.getByText('Card content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-slot', 'card-content');
    });

    it('should have proper content styles', () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toHaveClass('px-6');
    });
  });

  describe('CardFooter', () => {
    it('should render successfully', () => {
      render(<CardFooter>Footer content</CardFooter>);
      const footer = screen.getByText('Footer content');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'card-footer');
    });

    it('should have proper footer styles', () => {
      render(<CardFooter>Footer</CardFooter>);
      const footer = screen.getByText('Footer');
      expect(footer).toHaveClass('flex', 'items-center', 'px-6');
    });
  });

  describe('Complete Card Structure', () => {
    it('should render a complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test description</CardDescription>
            <div>Action</div>
          </CardHeader>
          <CardContent>
            <p>Main content goes here</p>
          </CardContent>
          <CardFooter>
            <button type="button">Footer button</button>
          </CardFooter>
        </Card>,
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Main content goes here')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Footer button' }),
      ).toBeInTheDocument();
    });

    it('should forward all props correctly', () => {
      render(
        <Card
          data-testid="test-card"
          id="card-id"
        >
          <CardHeader data-testid="test-header">
            <CardTitle data-testid="test-title">Title</CardTitle>
          </CardHeader>
        </Card>,
      );

      expect(screen.getByTestId('test-card')).toHaveAttribute('id', 'card-id');
      expect(screen.getByTestId('test-header')).toBeInTheDocument();
      expect(screen.getByTestId('test-title')).toBeInTheDocument();
    });
  });
});
