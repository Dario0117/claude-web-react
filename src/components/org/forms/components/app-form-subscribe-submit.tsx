import { Button } from '@/components/ui/button';
import { useFormContext } from '../hooks/app-form';

export function AppSubscribeSubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isValid && !state.isPristine}>
      {(canSubmit) => (
        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit}
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
