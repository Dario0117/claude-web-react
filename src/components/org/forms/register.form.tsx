import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegisterForm } from './hooks/use-register-form';
import type { RegisterFormProps } from './register.form.d';

export function RegisterForm({
  registerMutation,
  handleSuccess,
}: RegisterFormProps) {
  const form = useRegisterForm({ registerMutation, handleSuccess });

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
              <form.AppField name="username">
                {(field) => (
                  <field.AppFormField
                    label="Username"
                    placeholder="johndoe17"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField name="email">
                {(field) => (
                  <field.AppFormField
                    label="Email"
                    placeholder="johndoe17@mail.com"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.AppFormField
                    label="Password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField name="confirm">
                {(field) => (
                  <field.AppFormField
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                  />
                )}
              </form.AppField>
              <div className="flex flex-col gap-3">
                <form.AppForm>
                  <form.AppSubscribeSubmitButton label="Register" />
                </form.AppForm>
              </div>
            </div>
            <form.AppForm>
              <form.AppSubscribeErrorButton />
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
