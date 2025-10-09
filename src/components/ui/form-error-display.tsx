import { Alert, AlertTitle } from '@/components/ui/alert';
import type { FormErrorDisplayProps } from './form-error-display.d';

export function FormErrorDisplay({ errors }: FormErrorDisplayProps) {
  if (!errors.length) {
    return null;
  }

  return (
    <div className="mt-4">
      <Alert variant="destructive">
        <AlertTitle>
          {errors.map((error) => (
            <span key={error}>{error}</span>
          ))}
        </AlertTitle>
      </Alert>
    </div>
  );
}
