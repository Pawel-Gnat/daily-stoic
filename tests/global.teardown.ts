import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const userId = process.env.E2E_USERNAME_ID;
const email = process.env.E2E_USERNAME;
const password = process.env.E2E_PASSWORD;

async function globalTeardown() {
  if (!supabaseUrl || !supabaseKey || !userId) {
    throw new Error("SUPABASE_URL, SUPABASE_KEY, and E2E_USERNAME_ID environment variables must be set");
  }

  if (!email || !password) {
    throw new Error("E2E_USERNAME and E2E_PASSWORD environment variables must be set");
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Error signing in:", signInError);
      throw signInError;
    }

    const { error } = await supabaseAdmin.from("entries").delete().eq("user_id", userId);

    if (error) {
      console.error("Error deleting entries:", error.message);
    } else {
      // eslint-disable-next-line no-console
      console.log("Successfully deleted entries from the database.");
    }
  } catch (err) {
    console.error("An unexpected error occurred during global teardown:", err);
  }
}

export default globalTeardown;
