
import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const createPropertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

export const updatePropertySchema = createPropertySchema.partial();

export const assignManagersSchema = z.object({
  managerIds: z.array(objectId),
});