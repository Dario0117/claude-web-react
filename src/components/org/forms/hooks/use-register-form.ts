import { authClient } from '@/services/auth.http-service';
import { registerFormSchema } from '../validation/register-form.schema';
import { useAppForm } from './app-form';
import type { UseRegisterFormProps } from './use-register-form.types';

export function useRegisterForm({ handleSuccess }: UseRegisterFormProps) {
  const form = useAppForm({
    defaultValues: {
      name: '',
      password: '',
      confirm: '',
      email: '',
    },
    validators: {
      onChange: registerFormSchema,
      async onSubmitAsync({ value }) {
        const { data, error } = await authClient.signUp.email({
          name: value.name,
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
