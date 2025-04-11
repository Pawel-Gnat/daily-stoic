import { z } from "zod";

/**
 * Schema for validating entry creation payload
 */
export const createEntrySchema = z.object({
  what_matters_most: z
    .string()
    .min(1, "Field cannot be empty")
    .max(500, "Field exceeds maximum length (500 characters)"),
  fears_of_loss: z.string().min(1, "Field cannot be empty").max(500, "Field exceeds maximum length (500 characters)"),
  personal_goals: z.string().min(1, "Field cannot be empty").max(500, "Field exceeds maximum length (500 characters)"),
});

/**
 * Schema for validating entry list query parameters
 */
export const entryListQuerySchema = z.object({
  page: z.coerce.number().int("Page must be an integer").positive("Page must be positive").optional().default(1),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .positive("Limit must be positive")
    .max(25, "Maximum limit is 25 items")
    .optional()
    .default(10),
  sort: z
    .string()
    .regex(/^(created_at):(asc|desc)$/, "Invalid sort format")
    .optional()
    .default("created_at:desc"),
});

/**
 * Schema for validating UUID parameters
 */
export const uuidSchema = z.string().uuid("Invalid ID format");
