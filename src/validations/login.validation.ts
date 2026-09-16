import { z } from "zod";

export const loginSchema = z.object({
  first_name: z.string().trim().min(1, "Name is required").max(100),
  password: z.string().trim().min(1, "Password is required").max(100),
});

export type LoginDto = z.infer<typeof loginSchema>;
