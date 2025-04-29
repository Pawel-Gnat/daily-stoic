import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "@/db/supabase.client";

const PUBLIC_PATHS = [
  // Server-Rendered Astro Pages
  "/",
  "/entries",
  "/entries/:id",
  "/entries/sample-entry-1",
  "/entries/sample-entry-2",
  "/entries/sample-entry-3",
  "/entries/sample-entry-4",
  "/login",
  "/register",
  // Auth API endpoints
  "/forgot-password",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
];

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
  // Auth API endpoints
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/register",
];

export const onRequest = defineMiddleware(async ({ request, url, cookies, locals, redirect }, next) => {
  // if (PUBLIC_PATHS.includes(url.pathname)) {
  //   console.log("@PUBLIC_PATHS", url.pathname);
  //   return next();
  // }

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
