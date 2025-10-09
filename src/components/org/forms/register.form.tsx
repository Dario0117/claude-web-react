import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormErrorDisplay } from '@/components/ui/form-error-display';
import { FormField } from '@/components/ui/form-field';
import { useRegisterForm } from './hooks/use-register-form';
import type { RegisterFormProps } from './register.form.d';

export function RegisterForm({
  registerMutation,
  handleSuccess,
}: RegisterFormProps) {
  const form = useRegisterForm({ registerMutation });

  useEffect(() => {
    if (registerMutation.isSuccess) {
      handleSuccess(registerMutation.data);
    }
  }, [registerMutation.isSuccess, registerMutation.data, handleSuccess]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <form.Field name="username">
                {(field) => (
                  <FormField
                    field={field}
                    label="Username"
                    placeholder="johndoe17"
                    required
                  />
                )}
              </form.Field>
              <form.Field name="email">
                {(field) => (
                  <FormField
                    field={field}
                    label="Email"
                    placeholder="johndoe17@mail.com"
                    required
                  />
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <FormField
                    field={field}
                    label="Password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                )}
              </form.Field>
              <form.Field name="confirm">
                {(field) => (
                  <FormField
                    field={field}
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                  />
                )}
              </form.Field>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                >
                  Register
                </Button>
              </div>
            </div>

            <form.Subscribe selector={(state) => [state.errorMap]}>
              {([errorMap]) => {
                const submitErrors = errorMap?.onSubmit;
                if (!submitErrors) {
                  return null;
                }
                return <FormErrorDisplay errors={submitErrors} />;
              }}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
