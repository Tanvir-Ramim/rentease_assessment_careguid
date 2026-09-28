import { z } from "zod";

export const loginValidationZod = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const createUserValidationZod = z.object({
  name: z.string().min(1, "Name must be at least 1 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 8 characters"),
  role: z.enum(["admin", "manager"]),
});

export const updateUserSchema = createUserValidationZod.partial();
