import { logError } from '@/lib/logger.utils';
import type { useRegisterMutationType } from '@/services/users.http-service';
import { registerFormSchema } from '../validation/register-form.schema';
import { useAppForm } from './app-form';
import type { UseRegisterFormProps } from './use-register-form.d';

export function useRegisterForm({
  registerMutation,
  handleSuccess,
}: UseRegisterFormProps) {
  const form = useAppForm({
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
          const results = await registerMutation.mutateAsync({
            body: {
              username: value.username,
              password: value.password,
              email: value.email,
            },
            signal,
          });
          handleSuccess(results);
        } catch (exception: unknown) {
          const error = exception as useRegisterMutationType['error'];
          if (!error?.responseErrors) {
            logError({
              message: 'Unexpected error type',
              error,
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
