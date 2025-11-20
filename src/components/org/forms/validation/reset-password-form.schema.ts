import * as z from 'zod';

export const resetPasswordFormSchema = z.object({
  email: z.email(),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
