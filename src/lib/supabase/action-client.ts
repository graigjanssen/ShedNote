// ----------------------------------------------------------------------------
// Purpose
// - Factory for a *server-side, writable* Supabase client.
// - Use this **only** in Server Actions (`"use server"`) and Route Handlers,
//   where `cookies()` is mutable and Supabase can update auth cookies.
//
// Why a dedicated action client?
// - In Server Components, cookies are read-only → you must use a read-only
//   adapter (see `lib/supabase/server.ts`).
// - In Server Actions/Routes, we *want* Supabase to set/clear session cookies
//   after sign-in/sign-out/refresh → this adapter wires that up.
//
// Env vars
// - Must be available on the server and safe for anon use:
//   - NEXT_PUBLIC_SUPABASE_URL
//   - NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// Security notes
// - Use ONLY the anon key here (never the service-role key).
// - RLS still applies; elevate privileges via Postgres policies, not secrets.
//
// Optional typing
// - If you have generated types (e.g., Database), you can do:
//     createServerClient<Database>(...)
// ----------------------------------------------------------------------------

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Returns a Supabase client configured for **Server Actions / Route Handlers**.
 * Here, `cookies()` is writable, so Supabase can manage auth cookies.
 */
export async function createActionClient() {
  // Next 15+: cookies() is async; in Actions/Routes it returns a *writable* store
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read current cookie value
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Set/update a cookie (Supabase uses this for session management)
        set(name: string, value: string, options: CookieOptions) {
          // Next supports passing an options object directly
          cookieStore.set({ name, value, ...options });
        },
        // Remove a cookie — use the native delete to avoid deprecated patterns
        remove(name: string, _options: CookieOptions) {
          cookieStore.delete(name);
        },
      },
    }
  );
}
