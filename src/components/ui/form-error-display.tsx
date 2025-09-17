import { Alert, AlertTitle } from '@/components/ui/alert';
import type { CoreHTTPError } from '@/types/api.d';

interface FormErrorDisplayProps {
  error: CoreHTTPError<unknown> | null;
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
