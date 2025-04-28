import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance, supabaseClient } from "@/db/supabase.client";

export const onRequest = defineMiddleware((context, next) => {
  context.locals.supabase = supabaseClient;
  return next();
});

// // Public routes that do not require authentication
// const PUBLIC_PATHS = [
//   "/login",
//   "/register",
//   "/forgot-password",
//   "/api/auth/sign-in",
//   "/api/auth/sign-up",
//   "/api/auth/logout",
// ];

// export const onRequest = defineMiddleware(async ({ request, url, cookies, locals, redirect }, next) => {
//   // Skip checking for public routes
//   if (PUBLIC_PATHS.includes(url.pathname) || url.pathname.startsWith("/reset-password")) {
//     // Inject supabase instance for convenience
//     locals.supabase = createSupabaseServerInstance({
//       cookies,
//       headers: request.headers,
//     });
//     return next();
//   }

//   // Create a Supabase server client that manages cookies
//   const supabase = createSupabaseServerInstance({
//     cookies,
//     headers: request.headers,
//   });

//   // Always get user session first
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (user) {
//     locals.user = {
//       id: user.id,
//       email: user.email!,
//       name: user.user_metadata.name,
//       created_at: user.created_at,
//     };
//     locals.supabase = supabase;
//     return next();
//   }

//   // Redirect unauthenticated requests to login
//   return redirect("/login");
// });
