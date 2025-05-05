import type { APIRoute } from "astro";
import { EntryService } from "../../../lib/services/entry.service";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const userId = locals.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: { code: "unauthorized", message: "Unauthorized" } }), {
        status: 401,
      });
    }

    const entryService = new EntryService(locals.supabase);
    const entry = await entryService.getTodayEntry(userId);

    return new Response(JSON.stringify(entry), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching today's entry:", error);
    return new Response(
      JSON.stringify({ error: { code: "server_error", message: "Failed to retrieve today's entry" } }),
      { status: 500 }
    );
  }
};
