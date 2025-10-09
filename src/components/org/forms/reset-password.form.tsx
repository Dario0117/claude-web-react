import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormErrorDisplay } from '@/components/ui/form-error-display';
import { FormField } from '@/components/ui/form-field';
import { useResetPasswordForm } from './hooks/use-reset-password-form';
import type { ResetPasswordFormProps } from './reset-password.form.d';

export function ResetPasswordForm({
  resetPasswordMutation,
  handleSuccess,
}: ResetPasswordFormProps) {
  const form = useResetPasswordForm({ resetPasswordMutation });

  useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      handleSuccess(resetPasswordMutation.data);
    }
  }, [
    resetPasswordMutation.isSuccess,
    resetPasswordMutation.data,
    handleSuccess,
  ]);
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
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
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                >
                  Send reset email
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
