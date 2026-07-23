import { email, z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.coerce
    .string()
    .trim()
    .min(8, "Password is required and must be valid"),
//   remember: z.coerce.boolean(),
});

export const signupSchema = z.object({
  email: z.email(),
  password: z.coerce.string().trim().min(8, "Password must be 8 chars long"),
  name: z.coerce.string().trim().min(3, "name must be 3 chars long"),
});


export type SignupDto = z.infer<typeof signupSchema>;



