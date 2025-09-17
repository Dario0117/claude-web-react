import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import type { CoreHTTPError, CoreHTTPResponse } from '@/types/api.d';

interface RegisterFormProps {
  handleSubmit(
    username: string,
    password: string,
    email: string,
    // biome-ignore lint/suspicious/noExplicitAny: WIP
  ): Promise<CoreHTTPResponse<any, any>>;
  handleSuccess(): void;
}

const registerFormSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    confirm: z.string(),
    email: z.email(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password don't match",
    path: ['confirm'],
  });

export function RegisterForm({
  handleSubmit,
  handleSuccess,
}: RegisterFormProps) {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirm: '',
      email: '',
    },
    validators: {
      onChange: registerFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      formApi.setErrorMap({
        onSubmit: {
          form: null,
          fields: {},
        },
      });
      console.log('called');
      const result = await handleSubmit(
        value.username,
        value.password,
        value.email,
      );
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
            <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
              {(errors) => {
                return (
                  errors && (
                    <div className="mt-4">
                      <Alert variant="destructive">
                        <AlertTitle>
                          {/** biome-ignore lint/suspicious/noExplicitAny: WIP */}
                          {(errors as CoreHTTPError<any>).message}
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
