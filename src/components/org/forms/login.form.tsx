import { Link } from '@tanstack/react-router';
import { FormCard } from '@/components/ui/form-card';
import { useLoginForm } from './hooks/use-login-form';
import type { LoginFormProps } from './login.form.d';

export function LoginForm({ loginMutation, handleSuccess }: LoginFormProps) {
  const form = useLoginForm({ loginMutation, handleSuccess });

  return (
    <FormCard
      title="Login to your account"
      description="Enter your username below to login to your account"
    >
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

          <form.AppField name="password">
            {(field) => (
              <field.AppFormField
                label="Password"
                type="password"
                placeholder="Password"
                required
              >
                <Link
                  to="/reset-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </field.AppFormField>
            )}
          </form.AppField>

          <div className="flex flex-col gap-3">
            <form.AppForm>
              <form.AppSubscribeSubmitButton label="Login" />
            </form.AppForm>
          </div>
        </div>

        <form.AppForm>
          <form.AppSubscribeErrorButton />
        </form.AppForm>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </FormCard>
  );
}
