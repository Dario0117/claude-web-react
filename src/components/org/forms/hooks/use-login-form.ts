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
          const { nonFieldErrors: form, ...fields } =
            error?.responseErrors || {};
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
