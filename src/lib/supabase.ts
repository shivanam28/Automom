import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. The service role key bypasses Row Level Security, so this
// client must never be imported into a "use client" file or shipped to
// the browser. It's only ever used inside API routes (route.ts files),
// which run exclusively on the server.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Add both to .env.local."
    );
  }

  return createClient(url, serviceKey);
}
