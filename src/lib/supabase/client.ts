// ----------------------------------------------------------------------------
// Purpose
// - Factory for a *browser-side* Supabase client.
// - Use this only in Client Components, client-side hooks, or event handlers.
//   For Server Components/Route Handlers, use server helper (lib/supabase/server.ts).
//
// Why a separate browser client?
// - The @supabase/ssr helpers expose createBrowserClient() which configures
//   storage/cookies the way Supabase expects in the browser (localStorage, etc.).
// - Keeps you from accidentally using the server client on the client (and vice versa),
//   which can break auth persistence or leak cookies.
//
// Env vars
// - Must exist in the browser bundle, so they *must* be prefixed with NEXT_PUBLIC_
//   and defined in .env.local (and your hosting env):
//   - NEXT_PUBLIC_SUPABASE_URL
//   - NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// Security notes
// - The anon key is safe to expose to the browser; it enforces RLS and respects your policies.
// - Never ship the service-role key to the client.
//
// Usage patterns
// - Call supabaseBrowser() inside components/hooks when you need to read/write from the client.
// - If you want a singleton per tab to avoid re-instantiation, you can memoize in a module
//   or a React context—this factory keeps things simple and stateless by default.
//
// ----------------------------------------------------------------------------

import { createBrowserClient } from '@supabase/ssr';

/**
 * Returns a new Supabase client configured for the **browser** runtime.
 * Keep server code on `lib/supabase/server.ts`.
 */
export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // e.g. "https://xyzcompany.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // public anon key (enforces RLS)
  );
