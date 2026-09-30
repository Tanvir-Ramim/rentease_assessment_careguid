
import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(5, "Phone is required"),
  email: z.string().email("Invalid email"),
  unit: z.string().regex(/^[a-f\d]{24}$/i, "Invalid unit id"),
  moveInDate: z.coerce.date(),
});


export const updateTenantSchema = createTenantSchema
  .omit({ unit: true })
  .partial();

export const moveOutSchema = z.object({
  moveOutDate: z.coerce.date().optional(),
});