import type { APIContext } from "astro";
import { EntryService } from "../../../lib/services/entry.service";
import { uuidSchema } from "../../../lib/schemas/entry.schema";

export const prerender = false;

/**
 * GET /entries/:id - Retrieve a specific entry
 */
export async function GET({ params, locals }: APIContext) {
  try {
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
        }
      );
    }

    return new Response(JSON.stringify(entry), {
      status: 200,
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
      }
    );
  }
}

/**
 * DELETE /entries/:id - Delete a specific entry
 */
export async function DELETE({ params, locals }: APIContext) {
  try {
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
        }
      );
    }

    await entryService.deleteEntry(userId, result.data);

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
      }
    );
  }
}
