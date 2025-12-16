import { authClient } from '@/services/auth.http-service';
import { loginFormSchema } from '../validation/login-form.schema';
import { useAppForm } from './app-form';
import type { UseLoginFormProps } from './use-login-form.types';

export function useLoginForm({ handleSuccess }: UseLoginFormProps) {
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginFormSchema,
      async onSubmitAsync({ value }) {
        const { data, error } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });
        if (error) {
          return {
            form: [error?.message],
            fields: {},
          };
        }
        handleSuccess(data);
      },
    },
  });

  return form;
}
