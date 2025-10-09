import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-card';
import { FormErrorDisplay } from '@/components/ui/form-error-display';
import { FormField } from '@/components/ui/form-field';
import { useLoginForm } from './hooks/use-login-form';
import type { LoginFormProps } from './login.form.d';

export function LoginForm({ loginMutation, handleSuccess }: LoginFormProps) {
  const form = useLoginForm({ loginMutation });

  useEffect(() => {
    if (loginMutation.isSuccess) {
      handleSuccess(loginMutation.data);
    }
  }, [loginMutation.isSuccess, loginMutation.data, handleSuccess]);

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

          <form.Field name="password">
            {(field) => (
              <FormField
                field={field}
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
              </FormField>
            )}
          </form.Field>

          <div className="flex flex-col gap-3">
            <form.Subscribe
              selector={(state) => state.isValid && !state.isPristine}
            >
              {(canSubmit) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit}
                >
                  Login
                </Button>
              )}
            </form.Subscribe>
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

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </FormCard>
  );
}
