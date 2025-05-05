import { z } from 'zod';

export const UserLoginSchema = z.object({
  email: z.string().email({ message: "Neplatný email" }),
  password: z.string()
});