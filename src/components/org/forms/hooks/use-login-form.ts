import { useForm } from '@tanstack/react-form';
import type { CoreHTTPResponse, LoginResponse } from '@/types/api.d';
import { loginFormSchema } from '../validation/login-form.schema';

interface UseLoginFormProps {
  handleLogin: (
    username: string,
    password: string,
  ) => Promise<CoreHTTPResponse<LoginResponse>>;
}

export function useLoginForm({ handleLogin }: UseLoginFormProps) {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onChange: loginFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      // Clear any previous errors
      formApi.setErrorMap({
        onSubmit: {
          form: null,
          fields: {},
        },
      });

      const result = await handleLogin(value.username, value.password);

      if (result.errors) {
        formApi.setErrorMap({
          onSubmit: {
            form: result.errors,
            fields: {},
          },
        });
      }
    },
  });

  return form;
}
