import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-card';
import { FormErrorDisplay } from '@/components/ui/form-error-display';
import { FormField } from '@/components/ui/form-field';
import type {
  CoreHTTPError,
  CoreHTTPResponse,
  LoginResponse,
} from '@/types/api.d';
import { useLoginForm } from './hooks/use-login-form';

interface LoginFormProps {
  handleLogin(
    username: string,
    password: string,
  ): Promise<CoreHTTPResponse<LoginResponse>>;
}

export function LoginForm({ handleLogin }: LoginFormProps) {
  const form = useLoginForm({ handleLogin });

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
            <Button
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          </div>
        </div>

        <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
          {(errorMap) => {
            const error =
              errorMap && typeof errorMap === 'object' && 'form' in errorMap
                ? (errorMap as { form: CoreHTTPError<unknown> }).form
                : null;
            return (
              <FormErrorDisplay
                error={error as CoreHTTPError<unknown> | null}
              />
            );
          }}
        </form.Subscribe>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </FormCard>
  );
}
