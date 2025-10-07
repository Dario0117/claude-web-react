import { useForm } from '@tanstack/react-form';
import { useParams } from '@tanstack/react-router';
import { logError } from '@/lib/logger.utils';
import type { useUpdatePasswordMutationType } from '@/services/users.http-service';
import { updatePasswordFormSchema } from '../validation/update-password-form.schema';

interface UseResetPasswordFormProps {
  updatePasswordMutation: useUpdatePasswordMutationType;
}

export function useUpdatePasswordForm({
  updatePasswordMutation,
}: UseResetPasswordFormProps) {
  const { token } = useParams({
    from: '/(unauthenticated)/update-password/$token',
  });
  const form = useForm({
    defaultValues: {
      password: '',
      confirm: '',
    },
    validators: {
      onChange: updatePasswordFormSchema,
      async onSubmitAsync({ value, signal }) {
        try {
          await updatePasswordMutation.mutateAsync({
            body: {
              token: token,
              password: value.password,
            },
            signal,
          });
        } catch (exception: unknown) {
          const error = exception as useUpdatePasswordMutationType['error'];
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
