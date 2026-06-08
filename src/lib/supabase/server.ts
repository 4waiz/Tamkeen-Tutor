import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options?: CookieOptions };
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";

/**
 * Server Supabase client for Server Components, Server Actions and
 * Route Handlers. Reads/writes the auth session via cookies.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` is called from a Server Component where mutating
            // cookies is not allowed. The middleware refreshes sessions,
            // so this can be safely ignored here.
          }
        },
      },
    },
  );
}

/**
 * Service-role client - bypasses RLS. SERVER ONLY.
 * Returns null if the service role key is not configured, so callers can
 * gracefully degrade (e.g. the mentor dashboard).
 */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
