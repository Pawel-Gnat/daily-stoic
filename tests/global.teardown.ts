import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const userId = process.env.E2E_USERNAME_ID;

async function globalTeardown() {
  if (!supabaseUrl || !supabaseKey || !userId) {
    throw new Error("SUPABASE_URL, SUPABASE_KEY, and E2E_USERNAME_ID environment variables must be set");
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { error } = await supabaseAdmin.from("entries").delete().eq("user_id", userId);

    if (error) {
      console.error("Error deleting entries:", error.message);
    } else {
      console.log("Successfully deleted entries from the database.");
    }
  } catch (err) {
    console.error("An unexpected error occurred during global teardown:", err);
  }
}

export default globalTeardown;
