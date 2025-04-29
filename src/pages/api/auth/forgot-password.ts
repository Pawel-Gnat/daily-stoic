import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "@/db/supabase.client";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email } = await request.json();
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const origin = new URL(request.url).origin;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(null, { status: 200 });
};
