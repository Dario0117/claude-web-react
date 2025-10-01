import * as z from 'zod';
export const updatePasswordFormSchema = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password don't match",
    path: ['confirm'],
  });
export type UpdatePasswordFormData = z.infer<typeof updatePasswordFormSchema>;
