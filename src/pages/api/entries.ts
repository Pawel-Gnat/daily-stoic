import type { APIRoute } from "astro";
import { EntryService } from "../../lib/services/entry.service";
import { createEntrySchema, entryListQuerySchema } from "../../lib/schemas/entry.schema";
import { DuplicateEntryError } from "../../lib/errors/entry-errors";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
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
        }
      );
    }

    const { what_matters_most, fears_of_loss, personal_goals } = result.data;

    const userId = locals.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: { code: "unauthorized", message: "Unauthorized" } }), {
        status: 401,
      });
    }

    const entryService = new EntryService(locals.supabase);
    const entry = await entryService.createEntry(userId, {
      what_matters_most,
      fears_of_loss,
      personal_goals,
    });

    return new Response(JSON.stringify(entry), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof DuplicateEntryError) {
      return new Response(JSON.stringify({ error: { code: "duplicate_entry", message: error.message } }), {
        status: 409,
      });
    }
    console.error("Error creating entry:", error);

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
      }
    );
  }
};

/**
 * GET /entries - Retrieve paginated list of user's entries
 */
export const GET: APIRoute = async ({ url, locals }) => {
  try {
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
        }
      );
    }

    const userId = locals.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: { code: "unauthorized", message: "Unauthorized" } }), {
        status: 401,
      });
    }

    const entryService = new EntryService(locals.supabase);
    const response = await entryService.getEntries(userId, result.data);

    return new Response(JSON.stringify(response), {
      status: 200,
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
      }
    );
  }
};
