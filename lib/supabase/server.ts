import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Next 15+: cookies() is async, so this helper is async too.
 * Use: const supabase = await createClient();
 */
export async function createClient() {
  const cookieStore = await cookies(); // Promise<ReadonlyRequestCookies>

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Use the *deprecated* server adapter shape (get/set/remove)
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // In Server Components, cookies are read-only → no-ops are correct
        set(_name: string, _value: string, _options: CookieOptions) {},
        remove(_name: string, _options: CookieOptions) {},
      },
    }
  );
}
