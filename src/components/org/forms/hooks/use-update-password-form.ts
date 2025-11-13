import { useParams } from '@tanstack/react-router';
import { logError } from '@/lib/logger.utils';
import type { useUpdatePasswordMutationType } from '@/services/users.http-service';
import { updatePasswordFormSchema } from '../validation/update-password-form.schema';
import { useAppForm } from './app-form';
import type { UseUpdatePasswordFormProps } from './use-update-password-form.d';

export function useUpdatePasswordForm({
  updatePasswordMutation,
  handleSuccess,
}: UseUpdatePasswordFormProps) {
  const { token } = useParams({
    from: '/(unauthenticated)/update-password/$token',
  });
  const form = useAppForm({
    defaultValues: {
      password: '',
      confirm: '',
    },
    validators: {
      onChange: updatePasswordFormSchema,
      async onSubmitAsync({ value, signal }) {
        try {
          const results = await updatePasswordMutation.mutateAsync({
            body: {
              token: token,
              password: value.password,
            },
            signal,
          });
          handleSuccess(results);
        } catch (exception: unknown) {
          const error = exception as useUpdatePasswordMutationType['error'];
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
