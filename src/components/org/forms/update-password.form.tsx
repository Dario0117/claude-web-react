import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormErrorDisplay } from '@/components/ui/form-error-display';
import { FormField } from '@/components/ui/form-field';
import { useUpdatePasswordForm } from './hooks/use-update-password-form';
import type { UpdatePasswordFormProps } from './update-password.form.d';

export function UpdatePasswordForm({
  updatePasswordMutation,
  handleSuccess,
}: UpdatePasswordFormProps) {
  const form = useUpdatePasswordForm({ updatePasswordMutation });

  useEffect(() => {
    if (updatePasswordMutation.isSuccess) {
      handleSuccess(updatePasswordMutation.data);
    }
  }, [
    updatePasswordMutation.isSuccess,
    updatePasswordMutation.data,
    handleSuccess,
  ]);
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Update your password</CardTitle>
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
                  Update password
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
