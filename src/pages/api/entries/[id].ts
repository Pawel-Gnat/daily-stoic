import type { APIContext } from "astro";
import { EntryService } from "../../../lib/services/entry.service";
import { uuidSchema } from "../../../lib/schemas/entry.schema";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";

export const prerender = false;

/**
 * GET /entries/:id - Retrieve a specific entry
 */
export async function GET({ params, locals }: APIContext) {
  try {
    // Validate ID parameter
    const result = uuidSchema.safeParse(params.id);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: "validation_error",
            message: "Invalid ID format",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // In a production environment, we would get the user ID from the JWT token
    // For now, we use the default user ID as per instructions
    const userId = DEFAULT_USER_ID;

    // Get entry using the entry service
    const entryService = new EntryService(locals.supabase);
    const entry = await entryService.getEntry(userId, result.data);

    // Check if entry exists
    if (!entry) {
      return new Response(
        JSON.stringify({
          error: {
            code: "not_found",
            message: "Entry not found",
          },
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return entry
    return new Response(JSON.stringify(entry), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching entry:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: "server_error",
          message: "Failed to retrieve entry. Please try again later.",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * DELETE /entries/:id - Delete a specific entry
 */
export async function DELETE({ params, locals }: APIContext) {
  try {
    // Validate ID parameter
    const result = uuidSchema.safeParse(params.id);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: "validation_error",
            message: "Invalid ID format",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // In a production environment, we would get the user ID from the JWT token
    // For now, we use the default user ID as per instructions
    const userId = DEFAULT_USER_ID;

    // First check if the entry exists
    const entryService = new EntryService(locals.supabase);
    const entry = await entryService.getEntry(userId, result.data);

    if (!entry) {
      return new Response(
        JSON.stringify({
          error: {
            code: "not_found",
            message: "Entry not found",
          },
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Delete entry
    await entryService.deleteEntry(userId, result.data);

    // Return success with no content
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting entry:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: "server_error",
          message: "Failed to delete entry. Please try again later.",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
