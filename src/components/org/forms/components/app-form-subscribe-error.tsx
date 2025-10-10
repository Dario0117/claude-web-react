import { FormErrorDisplay } from '@/components/ui/form-error-display';
import { useFormContext } from '../hooks/app-form';

export function AppSubscribeErrorButton() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.errorMap]}>
      {([errorMap]) => {
        return <FormErrorDisplay errors={errorMap?.onSubmit} />;
      }}
    </form.Subscribe>
  );
}
