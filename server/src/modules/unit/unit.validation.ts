
import { z } from "zod";

export const createUnitSchema = z.object({
  property: z.string().regex(/^[a-f\d]{24}$/i, "Invalid property id"),
  unitNumber: z.string().min(1, "Unit number is required"),
  floor: z.number().int("Floor must be a whole number"),
  monthlyRent: z.number().positive("Monthly rent must be greater than 0"),
});


export const updateUnitSchema = createUnitSchema.omit({ property: true }).partial();