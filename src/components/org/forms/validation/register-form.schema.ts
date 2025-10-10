import * as z from 'zod';

export const registerFormSchema = z
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

export type RegisterFormData = z.infer<typeof registerFormSchema>;
