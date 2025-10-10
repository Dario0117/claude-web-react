import { useForm } from '@tanstack/react-form';
import { logError } from '@/lib/logger.utils';
import type { useResetPasswordMutationType } from '@/services/users.http-service';
import { resetPasswordFormSchema } from '../validation/reset-password-form.schema';
import type { UseResetPasswordFormProps } from './use-reset-password-form.d';

export function useResetPasswordForm({
  resetPasswordMutation,
}: UseResetPasswordFormProps) {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: resetPasswordFormSchema,
      async onSubmitAsync({ value, signal }) {
        try {
          await resetPasswordMutation.mutateAsync({
            body: {
              email: value.email,
            },
            signal,
          });
        } catch (exception: unknown) {
          const error = exception as useResetPasswordMutationType['error'];
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
