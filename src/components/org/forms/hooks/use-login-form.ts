import { useForm } from '@tanstack/react-form';
import { logError } from '@/lib/logger.utils';
import type { useLoginMutationType } from '@/services/users.http-service';
import { loginFormSchema } from '../validation/login-form.schema';
import type { UseLoginFormProps } from './use-login-form.d';

export function useLoginForm({
  loginMutation,
  handleSuccess,
}: UseLoginFormProps) {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onChange: loginFormSchema,
      async onSubmitAsync({ value, signal }) {
        try {
          const results = await loginMutation.mutateAsync({
            body: {
              username: value.username,
              password: value.password,
            },
            signal,
          });
          handleSuccess(results);
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
