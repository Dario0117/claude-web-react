import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import type { CoreHTTPError, CoreHTTPResponse } from '@/services/users.service';

interface ResetPasswordFormProps {
  handleSubmit(
    email: string,
    // biome-ignore lint/suspicious/noExplicitAny: WIP
  ): Promise<CoreHTTPResponse<any>>;
  handleSuccess(): void;
}

const resetPasswordFormSchema = z.object({
  email: z.email(),
});

export function ResetPasswordForm({
  handleSubmit,
  handleSuccess,
}: ResetPasswordFormProps) {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: resetPasswordFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      formApi.setErrorMap({
        onSubmit: {
          form: null,
          fields: {},
        },
      });
      const result = await handleSubmit(value.email);
      if (result.errors) {
        formApi.setErrorMap({
          onSubmit: {
            form: result.errors,
            fields: {},
          },
        });
      } else {
        handleSuccess();
      }
    },
  });
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
            <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
              {(errors) => {
                return (
                  errors && (
                    <div className="mt-4">
                      <Alert variant="destructive">
                        <AlertTitle>
                          {(errors as CoreHTTPError).message}
                        </AlertTitle>
                      </Alert>
                    </div>
                  )
                );
              }}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
