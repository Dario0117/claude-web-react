import { useForm } from '@tanstack/react-form';
import { logError } from '@/lib/logger.utils';
import type { useLoginMutationType } from '@/services/users.service';
import { loginFormSchema } from '../validation/login-form.schema';

interface UseLoginFormProps {
  loginMutation: useLoginMutationType;
}

export function useLoginForm({ loginMutation }: UseLoginFormProps) {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onChange: loginFormSchema,
      async onSubmitAsync({ value, signal }) {
        try {
          await loginMutation.mutateAsync({
            body: {
              username: value.username,
              password: value.password,
            },
            signal,
          });
        } catch (exception: unknown) {
          const error = exception as useLoginMutationType['error'];
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
