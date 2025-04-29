import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "@/db/supabase.client";

const RESTRICTED_FOR_UNAUTHENTICATED_USER_PATHS = [
  // Server-Rendered Astro Pages
  "/entries/:id",
  // Auth API endpoints
  "/api/auth/logout",
  // Entries API endpoints
  "/api/entries",
  "/api/entries/:id",
  "/api/entries/today",
];

const RESTRICTED_FOR_AUTHENTICATED_USER_PATHS = [
  // Server-Rendered Astro Pages
  "/login",
  "/register",
  "/forgot-password",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/register",
];

export const onRequest = defineMiddleware(async ({ request, url, cookies, locals, redirect }, next) => {
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });
  locals.supabase = supabase;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    locals.user = {
      id: user.id,
      email: user.email,
    };
  }

  if (!user && RESTRICTED_FOR_UNAUTHENTICATED_USER_PATHS.includes(url.pathname)) {
    return redirect("/login");
  }

  if (user && RESTRICTED_FOR_AUTHENTICATED_USER_PATHS.includes(url.pathname)) {
    return redirect("/");
  }

  return next();
});
