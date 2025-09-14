import { Alert, AlertTitle } from '@/components/ui/alert';
import type { CoreHTTPError } from '@/types/api-types';

interface FormErrorDisplayProps {
  error: CoreHTTPError | null;
}

export function FormErrorDisplay({ error }: FormErrorDisplayProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="mt-4">
      <Alert variant="destructive">
        <AlertTitle>{error.message}</AlertTitle>
      </Alert>
    </div>
  );
}
