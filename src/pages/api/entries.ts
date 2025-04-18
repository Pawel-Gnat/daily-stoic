import type { APIContext } from "astro";
import { EntryService } from "../../lib/services/entry.service";
import { createEntrySchema, entryListQuerySchema } from "../../lib/schemas/entry.schema";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

export const prerender = false;

/**
 * POST /entries - Create a new entry with AI-generated stoic sentence
 */
export async function POST({ request, locals }: APIContext) {
  try {
    // Parse and validate request body
    const json = await request.json();
    const result = createEntrySchema.safeParse(json);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: "validation_error",
            message: "Invalid input data",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get validated data
    const { what_matters_most, fears_of_loss, personal_goals } = result.data;

    // In a production environment, we would get the user ID from the JWT token
    // For now, we use the default user ID as per instructions
    const userId = DEFAULT_USER_ID;

    // Create entry using the entry service
    const entryService = new EntryService(locals.supabase);
    const entry = await entryService.createEntry(userId, {
      what_matters_most,
      fears_of_loss,
      personal_goals,
    });

    // Return created entry
    return new Response(JSON.stringify(entry), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating entry:", error);

    // Determine if it's an AI generation error or another server error
    const errorMessage =
      error instanceof Error && error.message.includes("Failed to generate stoic sentence")
        ? "AI generation failed. Please try again later."
        : "An unexpected error occurred. Please try again later.";

    return new Response(
      JSON.stringify({
        error: {
          code: "server_error",
          message: errorMessage,
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
 * GET /entries - Retrieve paginated list of user's entries
 */
export async function GET({ url, locals }: APIContext) {
  try {
    // Extract and validate query parameters
    const params = Object.fromEntries(url.searchParams.entries());
    const result = entryListQuerySchema.safeParse(params);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: "validation_error",
            message: "Invalid query parameters",
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

    // Get entries using the entry service
    const entryService = new EntryService(locals.supabase);
    const response = await entryService.getEntries(userId, result.data);

    // Return entries with pagination info
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching entries:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: "server_error",
          message: "Failed to retrieve entries. Please try again later.",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
