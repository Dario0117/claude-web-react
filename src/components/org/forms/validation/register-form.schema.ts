import * as z from 'zod';

export const registerFormSchema = z
  .object({
    name: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
    email: z.email(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
