
import { z } from "zod";

export const createPaymentSchema = z.object({
  tenant: z.string().regex(/^[a-f\d]{24}$/i, "Invalid tenant id"),
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be like 2026-10"),
  amount: z.number().positive("Amount must be greater than 0"),
  paidDate: z.coerce.date().optional(), // defaults to today when paid
  status: z.enum(["paid", "unpaid"]).default("paid"),
});