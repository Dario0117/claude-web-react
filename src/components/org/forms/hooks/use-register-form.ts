import { useForm } from '@tanstack/react-form';
import { logError } from '@/lib/logger.utils';
import type { useRegisterMutationType } from '@/services/users.service';
import { registerFormSchema } from '../validation/register-form.schema';

interface UseRegisterFormProps {
  registerMutation: useRegisterMutationType;
}

export function useRegisterForm({ registerMutation }: UseRegisterFormProps) {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirm: '',
      email: '',
    },
    validators: {
      onChange: registerFormSchema,
      async onSubmitAsync({ value, signal }) {
        try {
          await registerMutation.mutateAsync({
            body: {
              username: value.username,
              password: value.password,
              email: value.email,
            },
            signal,
          });
        } catch (exception: unknown) {
          const error = exception as useRegisterMutationType['error'];
          if (!error?.responseErrors) {
            logError({
              message: 'Unexpected error type',
              error: String(error),
            });
            return {
              form: ['Something went wrong, please try again later.'],
              fields: {},
            };
          }
          const { nonFieldErrors: form, ...fields } = error.responseErrors;
          return {
            form,
            fields,
          };
        }
      },
    },
  });
  return form;
}
