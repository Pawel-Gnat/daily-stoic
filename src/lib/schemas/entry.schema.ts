import { z } from "zod";

export const createEntrySchema = z.object({
  what_matters_most: z
    .string()
    .min(1, "Field cannot be empty")
    .max(500, "Field exceeds maximum length (500 characters)"),
  fears_of_loss: z.string().min(1, "Field cannot be empty").max(500, "Field exceeds maximum length (500 characters)"),
  personal_goals: z.string().min(1, "Field cannot be empty").max(500, "Field exceeds maximum length (500 characters)"),
});

export const entryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(25).optional().default(10),
  sort: z.string().optional().default("created_at:desc"),
});

export const uuidSchema = z.string().uuid();
