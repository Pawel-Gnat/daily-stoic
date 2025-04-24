import type { APIContext } from "astro";
import { EntryService } from "../../../lib/services/entry.service";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";

export const prerender = false;

export async function GET({ locals }: APIContext) {
  try {
    const userId = DEFAULT_USER_ID;
    const entryService = new EntryService(locals.supabase);
    const entry = await entryService.getTodayEntry(userId);

    if (!entry) {
      return new Response(JSON.stringify({ error: { code: "not_found", message: "No entry for today" } }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(entry), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching today's entry:", error);
    return new Response(
      JSON.stringify({ error: { code: "server_error", message: "Failed to retrieve today's entry" } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
