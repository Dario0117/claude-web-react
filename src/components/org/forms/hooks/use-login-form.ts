import { useForm } from '@tanstack/react-form';
import type { useLoginReturnType } from '@/services/users.service';
import { loginFormSchema } from '../validation/login-form.schema';

interface UseLoginFormProps {
  loginMutation: useLoginReturnType;
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
          const error = exception as useLoginReturnType['error'];
          if (!error?.responseErrors) {
            // biome-ignore lint/suspicious/noConsole: possible 500 error
            console.error('Unexpected error type', error);
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
